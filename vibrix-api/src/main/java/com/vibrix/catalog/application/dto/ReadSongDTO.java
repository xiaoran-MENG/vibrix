package com.vibrix.catalog.application.dto;

import com.vibrix.catalog.application.value.Author;
import com.vibrix.catalog.application.value.Title;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class ReadSongDTO {
    private Title title;
    private Author author;
    @NotNull private byte[] cover;
    @NotNull private String coverContentType;
    @NotNull private boolean favorite;
    @NotNull UUID publicId;

    public Title getTitle() {
        return title;
    }

    public void setTitle(Title title) {
        this.title = title;
    }

    public Author getAuthor() {
        return author;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    @NotNull
    public byte[] getCover() {
        return cover;
    }

    public void setCover(@NotNull byte[] cover) {
        this.cover = cover;
    }

    public @NotNull String getCoverContentType() {
        return coverContentType;
    }

    public void setCoverContentType(@NotNull String coverContentType) {
        this.coverContentType = coverContentType;
    }

    @NotNull
    public boolean isFavorite() {
        return favorite;
    }

    public void setFavorite(@NotNull boolean favorite) {
        this.favorite = favorite;
    }

    public @NotNull UUID getPublicId() {
        return publicId;
    }

    public void setPublicId(@NotNull UUID publicId) {
        this.publicId = publicId;
    }
}
