package com.parking.management.backend.service;

import com.parking.management.backend.entity.ParkingLot;
import com.parking.management.backend.entity.ParkingLotStatus;
import com.parking.management.backend.repository.ParkingLotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ParkingLotService {
    private final ParkingLotRepository parkingLotRepository;

    public ParkingLot createParkingLot(ParkingLot parkingLot){
        return parkingLotRepository.save(parkingLot);
    }

    public List<ParkingLot> getAllParkingLots() {
        return parkingLotRepository.findAll();
    }

    public Optional<ParkingLot> getParkingLotById(Long id){
        return parkingLotRepository.findById(id);
    }

    public ParkingLot updateParkingLot(Long id ,ParkingLot parkingLot){
        ParkingLot updateParkingLot = parkingLotRepository.findById(id).orElseThrow();
        updateParkingLot.setName(parkingLot.getName());
        updateParkingLot.setLocation(parkingLot.getLocation());
        updateParkingLot.setStatus(parkingLot.getStatus());
        updateParkingLot.setTotalCapacity(parkingLot.getTotalCapacity());
        return parkingLotRepository.save(updateParkingLot);
    }

    public ParkingLot updateParkingLotStatus(Long id, ParkingLotStatus status){
        ParkingLot updateParkingLot = parkingLotRepository.findById(id).orElseThrow();
        updateParkingLot.setStatus(status);
        return parkingLotRepository.save(updateParkingLot);
    }

    public void deleteParkingLotById(Long id){
        parkingLotRepository.deleteById(id);
    }
}

