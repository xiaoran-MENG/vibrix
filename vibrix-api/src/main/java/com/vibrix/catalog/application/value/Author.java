package com.vibrix.catalog.application.value;

import jakarta.validation.constraints.NotBlank;

public record Author(@NotBlank String value) {
}
