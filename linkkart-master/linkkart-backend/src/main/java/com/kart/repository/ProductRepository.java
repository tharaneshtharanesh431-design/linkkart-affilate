package com.kart.repository;

import com.kart.entity.Product;
import com.kart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    java.util.Optional<Product> findByName(String name);
    List<Product> findByCategoryNameIgnoreCase(String categoryName);
    List<Product> findByOrganization(com.kart.entity.Organization organization);
    List<Product> findByOrganizationOrderByIdDesc(com.kart.entity.Organization organization);
    List<Product> findByStatus(String status);
    List<Product> findAllByStatusOrderByIdDesc(String status);
    List<Product> findAllByOrderByIdDesc();
    long countByStatus(String status);
    long countByOrganization(com.kart.entity.Organization organization);
    long countByOrganizationAndStatus(com.kart.entity.Organization organization, String status);
}
