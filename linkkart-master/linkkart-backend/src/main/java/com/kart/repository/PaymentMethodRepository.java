package com.kart.repository;

import com.kart.entity.PaymentMethod;
import com.kart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    List<PaymentMethod> findByAffiliateAndIsActiveTrue(User affiliate);
}
