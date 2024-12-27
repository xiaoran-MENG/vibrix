package com.vibrix.catalog.application.value;

import jakarta.validation.constraints.NotBlank;

public record Title(@NotBlank String value) {
}
