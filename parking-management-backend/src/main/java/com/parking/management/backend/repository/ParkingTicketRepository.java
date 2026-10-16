package com.parking.management.backend.repository;

import com.parking.management.backend.entity.ParkingTicket;
import com.parking.management.backend.entity.ParkingTktStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingTicketRepository extends JpaRepository<ParkingTicket,Long> {
    Optional<ParkingTicket> findFirstByVehicleIdAndStatus(Long vehicleId, ParkingTktStatus status);
    List<ParkingTicket> findByVehicleIdAndStatus(Long vehicleId, ParkingTktStatus status);
    List<ParkingTicket> findByVehicleId(Long vehicleId);
    List<ParkingTicket> findByStatus(ParkingTktStatus status);

}
