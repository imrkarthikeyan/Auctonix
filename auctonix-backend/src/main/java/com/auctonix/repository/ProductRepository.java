package com.auctonix.repository;

import com.auctonix.model.Product;
import com.auctonix.model.ProductStatus;
import com.auctonix.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStatus(ProductStatus status); //list products by status

    List<Product> findByOwner(User owner); //list products by owner

    List<Product> findByCategory(String category); //list products by category

    @Query("select p from Product p join fetch p.owner where p.id = :id")
    Optional<Product> findByIdWithOwner(Long id);
}
