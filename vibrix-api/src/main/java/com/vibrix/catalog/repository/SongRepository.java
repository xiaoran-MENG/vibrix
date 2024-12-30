package com.vibrix.catalog.repository;

import com.vibrix.catalog.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SongRepository extends JpaRepository<Song, Long> {
    @Query("SELECT s FROM Song s WHERE lower(s.title) LIKE lower(concat('%',:text,'%'))" +
            "OR lower(s.author) LIKE lower(concat('%',:text,'%'))")
    List<Song> findByTitleOrAuthorContaining(String text);

    Optional<Song> findOneByPublicId(UUID publicId);

    @Query("SELECT s FROM Song s JOIN Favorite f ON s.publicId = f.songPublicId WHERE f.userEmail = :email")
    List<Song> findFavoriteSongs(String email);
}
