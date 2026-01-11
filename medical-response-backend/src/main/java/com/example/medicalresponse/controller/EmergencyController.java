package com.example.medicalresponse.controller;

import com.example.medicalresponse.model.EmergencyRequest;
import com.example.medicalresponse.service.EmergencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergencies")
@CrossOrigin(origins = { "http://localhost", "http://10.249.155.205", "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174" }) // Allow frontend access
public class EmergencyController {

    @Autowired
    private EmergencyService service;

    @PostMapping
    public EmergencyRequest createEmergency(@RequestBody EmergencyRequest request) {
        return service.createRequest(request);
    }

    @GetMapping
    public List<EmergencyRequest> getAllEmergencies() {
        return service.getAllRequests();
    }

    @PutMapping("/{id}")
    public EmergencyRequest updateEmergency(@PathVariable Long id, @RequestBody EmergencyRequest requestDetails) {
        return service.updateRequest(id, requestDetails);
    }
}
