package com.vibrix.catalog.repository;

import com.vibrix.catalog.model.SongContent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SongContentRepository extends JpaRepository<SongContent, Long> {
}
