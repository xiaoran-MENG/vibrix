package com.vibrix.catalog.application.dto;

import jakarta.persistence.Lob;

import java.util.UUID;

public record ContentDTO(
        UUID publicId,
        @Lob byte[] file,
        String fileContentType) {
}
