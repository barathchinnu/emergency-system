package com.example.medicalresponse.service;

import com.example.medicalresponse.model.EmergencyRequest;
import com.example.medicalresponse.repository.EmergencyRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyService {

    @Autowired
    private EmergencyRequestRepository repository;

    public EmergencyRequest createRequest(EmergencyRequest request) {
        request.setStatus("PENDING"); // Default status
        return repository.save(request);
    }

    public List<EmergencyRequest> getAllRequests() {
        return repository.findAll();
    }

    public EmergencyRequest updateRequest(Long id, EmergencyRequest requestDetails) {
        EmergencyRequest request = repository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));

        if (requestDetails.getStatus() != null) {
            request.setStatus(requestDetails.getStatus());
        }
        if (requestDetails.getAssignedAmbulanceId() != null) {
            request.setAssignedAmbulanceId(requestDetails.getAssignedAmbulanceId());
        }

        return repository.save(request);
    }

    public EmergencyRequest acceptByHospital(Long requestId, Long hospitalId, String doctorName) {
        EmergencyRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Emergency request not found"));

        request.setHospitalId(hospitalId);
        request.setDoctorName(doctorName);
        request.setHospitalStatus("ACCEPTED");

        return repository.save(request);
    }
}
