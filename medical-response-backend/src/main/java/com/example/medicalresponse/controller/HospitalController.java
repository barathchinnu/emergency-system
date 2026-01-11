package com.example.medicalresponse.controller;

import com.example.medicalresponse.model.Hospital;
import com.example.medicalresponse.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = { "http://localhost", "http://10.249.155.205", "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174" })
public class HospitalController {

    @Autowired
    private HospitalRepository hospitalRepository;

    @GetMapping
    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    @PostMapping
    public Hospital createHospital(@RequestBody Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    @Autowired
    private com.example.medicalresponse.service.EmergencyService emergencyService;

    @PutMapping("/accept/{requestId}")
    public com.example.medicalresponse.model.EmergencyRequest acceptEmergency(
            @PathVariable Long requestId,
            @RequestParam Long hospitalId,
            @RequestParam String doctorName) {
        return emergencyService.acceptByHospital(requestId, hospitalId, doctorName);
    }
}
