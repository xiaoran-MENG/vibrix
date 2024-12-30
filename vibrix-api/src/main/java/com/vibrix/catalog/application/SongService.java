package com.vibrix.catalog.application;

import com.vibrix.catalog.application.dto.ContentDTO;
import com.vibrix.catalog.application.dto.FavoriteDTO;
import com.vibrix.catalog.application.dto.ReadSongDTO;
import com.vibrix.catalog.application.dto.SaveSongDTO;
import com.vibrix.catalog.application.mapper.ContentMapper;
import com.vibrix.catalog.application.mapper.SongMapper;
import com.vibrix.catalog.model.Favorite;
import com.vibrix.catalog.model.FavoriteId;
import com.vibrix.catalog.repository.FavoriteRepository;
import com.vibrix.catalog.repository.SongContentRepository;
import com.vibrix.catalog.repository.SongRepository;
import com.vibrix.infrastructure.service.dto.State;
import com.vibrix.infrastructure.service.dto.StateBuilder;
import com.vibrix.user.application.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class SongService {
    private final SongMapper songMapper;
    private final ContentMapper contentMapper;
    private final SongRepository songRepository;
    private final SongContentRepository contentRepository;
    private final FavoriteRepository favoriteRepository;
    private final UserService userService;

    public SongService(SongMapper songMapper, ContentMapper contentMapper, SongRepository songRepository, SongContentRepository contentRepository, FavoriteRepository favoriteRepository, UserService userService) {
        this.songMapper = songMapper;
        this.contentMapper = contentMapper;
        this.songRepository = songRepository;
        this.contentRepository = contentRepository;
        this.favoriteRepository = favoriteRepository;
        this.userService = userService;
    }

    public ReadSongDTO add(SaveSongDTO saveSong) {
        var song = songRepository.save(songMapper.toSong(saveSong));
        var content = contentMapper.toContent(saveSong);
        content.setSong(song);
        contentRepository.save(content);
        return songMapper.toReadSongDTO(song);
    }

    @Transactional(readOnly = true)
    public List<ReadSongDTO> list() {
       var songs = songRepository.findAll().stream()
                .map(songMapper::toReadSongDTO)
                .toList();
       if (userService.authenticated()) {
           return getSongsWithLikeStatus(songs);
       }
       return songs;
    }

    public Optional<ContentDTO> one(UUID publicId) {
        return contentRepository
                .findOneBySongPublicId(publicId)
                .map(contentMapper::toContentDTO);
    }

    public List<ReadSongDTO> search(String text) {
        var songs = songRepository.findByTitleOrAuthorContaining(text).stream()
                .map(songMapper::toReadSongDTO)
                .toList();
        if (userService.authenticated()) {
            return getSongsWithLikeStatus(songs);
        }
        return songs;
    }

    public State<FavoriteDTO, String> toggleFavorite(FavoriteDTO dto, String email) {
        StateBuilder<FavoriteDTO, String> builder = State.builder();
        var result = songRepository.findOneByPublicId(dto.publicId());
        if (result.isEmpty()) return builder.forError("Not found").build();
        var song = result.get();
        var user = userService.getByEmail(email).orElseThrow();
        if (dto.favorite()) {
            var favorite = new Favorite();
            favorite.setSongPublicId(song.getPublicId());
            favorite.setUserEmail(user.email());
            favoriteRepository.save(favorite);
        } else {
            var favoriteId = new FavoriteId(song.getPublicId(), user.email());
            favoriteRepository.deleteById(favoriteId);
            dto = new FavoriteDTO(false, song.getPublicId());
        }
        return builder.forSuccess(dto).build();
    }

    public List<ReadSongDTO> getFavoriteSongs(String email) {
        return songRepository.findFavoriteSongs(email).stream()
                .map(songMapper::toReadSongDTO)
                .toList();
    }

    private List<ReadSongDTO> getSongsWithLikeStatus(List<ReadSongDTO> songs) {
        var user = userService.get();
        var publicIds = songs.stream()
                .map(ReadSongDTO::getPublicId)
                .toList();
        var favorites = favoriteRepository.findAllByUserEmailAndSongPublicIdIn(user.email(), publicIds).stream()
                .map(Favorite::getSongPublicId)
                .toList();
        return songs.stream().peek(song -> {
            if (favorites.contains(song.getPublicId())) {
                song.setFavorite(true);
            }
        }).toList();
    }
}
