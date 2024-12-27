package com.vibrix.catalog.repository;

import com.vibrix.catalog.model.Favorite;
import com.vibrix.catalog.model.FavoriteId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {
}
