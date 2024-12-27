package com.vibrix.catalog.application.dto;

import com.vibrix.catalog.application.value.Author;
import com.vibrix.catalog.application.value.Title;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public record SaveSongDTO(
        @Valid Title title,
        @Valid Author author,
        @NotBlank byte[] cover,
        @NotNull String coverContentType,
        @NotNull byte[] file,
        @NotNull String fileContentType) {

    public static SaveSongDTO of(Title title, Author author, MultipartFile cover, MultipartFile file) throws IOException {
        return new SaveSongDTO(
                title,
                author,
                cover.getBytes(),
                cover.getContentType(),
                file.getBytes(), 
                file.getContentType());
    }
}
