package com.vibrix.catalog.application.mapper;

import com.vibrix.catalog.application.dto.ReadSongDTO;
import com.vibrix.catalog.application.dto.SaveSongDTO;
import com.vibrix.catalog.application.value.Author;
import com.vibrix.catalog.application.value.Title;
import com.vibrix.catalog.model.Song;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SongMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "publicId", ignore = true)
    Song toSong(SaveSongDTO song);

    @Mapping(target = "favorite", ignore = true)
    ReadSongDTO toReadSongDTO(Song song);

    default Title toTitle(String title){
        return new Title(title);
    }

    default Author toAuthor(String author){
        return new Author(author);
    }

    default String toTitleString(Title title) {
        return title.value();
    }

    default String toAuthorString(Author author) {
        return author.value();
    }
}
