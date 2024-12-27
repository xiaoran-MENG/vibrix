package com.vibrix.catalog.repository;

import com.vibrix.catalog.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SongRepository extends JpaRepository<Song, Long> {
}
