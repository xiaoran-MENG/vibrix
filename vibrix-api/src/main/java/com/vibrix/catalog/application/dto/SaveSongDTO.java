package com.vibrix.catalog.application.dto;

import com.vibrix.catalog.application.value.Author;
import com.vibrix.catalog.application.value.Title;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SaveSongDTO(
        @Valid Title title,
        @Valid Author author,
        @NotBlank byte[] cover,
        @NotNull String coverContentType,
        @NotNull byte[] file,
        @NotNull String fileContentType) {
}
