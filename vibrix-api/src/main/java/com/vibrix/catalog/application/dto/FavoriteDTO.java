package com.vibrix.catalog.application.dto;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.UUID;

public record FavoriteDTO(
        @NotNull boolean favorite,
        @NotNull UUID publicID) {
}
