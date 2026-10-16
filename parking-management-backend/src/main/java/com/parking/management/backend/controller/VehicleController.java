package com.parking.management.backend.controller;

import com.parking.management.backend.entity.Vehicle;
import com.parking.management.backend.service.VehicleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Tag(name = "Vehicle", description = "Operations related to vehicle management")
@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<Vehicle> registerAVehicle(@RequestBody Vehicle vehicle) {
        Vehicle registerVehicle = vehicleService.registerAVehicle(vehicle);
        return ResponseEntity.status(HttpStatus.CREATED).body(registerVehicle);
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        List<Vehicle> getAllVehicle = vehicleService.getAllVehicles();
        return ResponseEntity.status(HttpStatus.OK).body(getAllVehicle);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVehicleById(@PathVariable Long id) {
        Optional<Vehicle> getVehicleById = vehicleService.getVehicleById(id);
        if (getVehicleById.isPresent()) {
            // lot was found â€” return 200 with the object
            return ResponseEntity.status(HttpStatus.OK).body(getVehicleById.get());
        } else {
            // lot not found â€” return 404
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vehicle with ID " + id + " not found.");
        }
    }

    @GetMapping("/registration/{registrationNumber}")
    public ResponseEntity<?> getVehicleByRegistrationNo(@PathVariable String registrationNumber) {
        Optional<Vehicle> getVehicleByRegistrationNo = vehicleService.getVehicleByRegistrationNo(registrationNumber);
        if (getVehicleByRegistrationNo.isPresent()) {
            // lot was found â€” return 200 with the object
            return ResponseEntity.status(HttpStatus.OK).body(getVehicleByRegistrationNo.get());
        } else {
            // lot not found â€” return 404
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vehicle with registration number " + registrationNumber + " not found.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicleById(@PathVariable Long id) {
        vehicleService.deleteVehicleById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Vehicle with ID " + id + " has been deleted.");
    }

}

