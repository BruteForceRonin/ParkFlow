package com.parking.management.backend.service;

import com.parking.management.backend.entity.ParkingSlot;
import com.parking.management.backend.entity.ParkingSlotStatus;
import com.parking.management.backend.entity.VehicleType;
import com.parking.management.backend.repository.ParkingSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ParkingSlotService {

    private final ParkingSlotRepository parkingSlotRepository;

    public List<ParkingSlot> getAllParkingSlots() {
        return parkingSlotRepository.findAll();
    }

    public ParkingSlot createParkingSlot(ParkingSlot parkingSlot) {
        ParkingSlot saved = parkingSlotRepository.save(parkingSlot);
        return parkingSlotRepository.findById(saved.getId()).orElseThrow();
    }

    public List<ParkingSlot> getAllParkingSlotsByParkingLotId(Long id) {
        return parkingSlotRepository.findByParkingLotId(id);
    }

    public List<ParkingSlot> getParkingSlotsByLotAndType(Long id, ParkingSlotStatus status, VehicleType type) {
        return parkingSlotRepository.findByParkingLotIdAndStatusAndType(id, status, type);
    }

    public List<ParkingSlot> getParkingSlotsByLotAndStatus(Long id) {
        return parkingSlotRepository.findByParkingLotIdAndStatus(id, ParkingSlotStatus.FREE);
    }

    public ParkingSlot updateParkingSlot(Long id, ParkingSlot parkingSlot) {
        ParkingSlot updateParkingSlot = parkingSlotRepository.findById(id).orElseThrow();
        updateParkingSlot.setType(parkingSlot.getType());
        updateParkingSlot.setStatus(parkingSlot.getStatus());
        return parkingSlotRepository.save(updateParkingSlot);
    }

    public ParkingSlot updateParkingSlotStatus(Long id, ParkingSlotStatus status) {
        ParkingSlot updateParkingSlot = parkingSlotRepository.findById(id).orElseThrow();
        updateParkingSlot.setStatus(status);
        return parkingSlotRepository.save(updateParkingSlot);
    }

    public void deleteParkingSlotById(Long id) {
        parkingSlotRepository.deleteById(id);
    }


}

