package com.vibrix.catalog.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "favorite_song")
@IdClass(FavoriteId.class)
public class Favorite implements Serializable {
    @Id
    @Column(name = "song_public_id")
    private UUID songPublicId;

    @Id
    @Column(name = "user_email")
    private String userEmail;

    public UUID getSongPublicId() {
        return songPublicId;
    }

    public void setSongPublicId(UUID songPublicId) {
        this.songPublicId = songPublicId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}
