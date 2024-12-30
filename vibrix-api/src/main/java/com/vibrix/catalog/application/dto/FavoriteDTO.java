package com.vibrix.catalog.application.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record FavoriteDTO(
        @NotNull boolean favorite,
        @NotNull UUID publicId) {
}
