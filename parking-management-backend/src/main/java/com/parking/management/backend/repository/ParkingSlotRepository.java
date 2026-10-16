package com.parking.management.backend.repository;

import com.parking.management.backend.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot,Long> {
    List<ParkingSlot> findByParkingLotId(Long id);
    List<ParkingSlot> findByParkingLotIdAndStatusAndType(Long id, ParkingSlotStatus status, VehicleType type);
    List<ParkingSlot> findByParkingLotIdAndStatus(Long id, ParkingSlotStatus status);
}


