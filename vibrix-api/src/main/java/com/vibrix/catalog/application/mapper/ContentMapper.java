package com.vibrix.catalog.application.mapper;

import com.vibrix.catalog.application.dto.ContentDTO;
import com.vibrix.catalog.application.dto.SaveSongDTO;
import com.vibrix.catalog.model.SongContent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ContentMapper {
    @Mapping(source = "song.publicId", target = "publicId")
    ContentDTO toContentDTO(SongContent songContent);

    SongContent toContent(SaveSongDTO songDTO);
}
