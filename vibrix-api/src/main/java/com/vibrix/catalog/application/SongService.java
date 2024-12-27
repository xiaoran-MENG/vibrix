package com.vibrix.catalog.application;

import com.vibrix.catalog.application.dto.ReadSongDTO;
import com.vibrix.catalog.application.dto.SaveSongDTO;
import com.vibrix.catalog.application.mapper.ContentMapper;
import com.vibrix.catalog.application.mapper.SongMapper;
import com.vibrix.catalog.repository.SongContentRepository;
import com.vibrix.catalog.repository.SongRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SongService {
    private final SongMapper songMapper;
    private final ContentMapper contentMapper;
    private final SongRepository songRepository;
    private final SongContentRepository contentRepository;

    public SongService(SongMapper songMapper, ContentMapper contentMapper, SongRepository songRepository, SongContentRepository contentRepository) {
        this.songMapper = songMapper;
        this.contentMapper = contentMapper;
        this.songRepository = songRepository;
        this.contentRepository = contentRepository;
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
        return songRepository.findAll().stream()
                .map(songMapper::toReadSongDTO)
                .toList();
    }
}
