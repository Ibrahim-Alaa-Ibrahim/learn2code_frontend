package org.ntg.learn2code.repository;

import org.ntg.learn2code.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Payment> findByUserIdAndProviderAndProviderTxnId(
            Long userId,
            String provider,
            String providerTxnId
    );
}
