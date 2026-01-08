package com.example.medicalresponse.repository;

import com.example.medicalresponse.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
}
