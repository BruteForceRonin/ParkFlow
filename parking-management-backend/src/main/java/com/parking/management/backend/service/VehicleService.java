package com.parking.management.backend.service;


import com.parking.management.backend.entity.Vehicle;
import com.parking.management.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public Vehicle registerAVehicle(Vehicle vehicle){
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> getVehicleById(Long id){
        return vehicleRepository.findById(id);
    }

    public Optional<Vehicle> getVehicleByRegistrationNo(String registrationNumber){
        return vehicleRepository.findByRegistrationNumber(registrationNumber);
    }

    public void deleteVehicleById(Long id){
        vehicleRepository.deleteById(id);
    }

}

