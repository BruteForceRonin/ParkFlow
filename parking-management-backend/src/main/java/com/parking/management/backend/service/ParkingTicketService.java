package com.parking.management.backend.service;

import com.parking.management.backend.entity.*;
import com.parking.management.backend.repository.ParkingTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ParkingTicketService {

    private final ParkingTicketRepository parkingTicketRepository;
    private final VehicleService vehicleService;
    private final ParkingSlotService parkingSlotService;

    private BigDecimal getHourlyRate(VehicleType vehicleType) {
        // Implement logic to return hourly rate based on vehicle type
        return switch (vehicleType) {
            case TWO_WHEELER -> BigDecimal.valueOf(10);
            case FOUR_WHEELER -> BigDecimal.valueOf(20);
            default -> throw new IllegalArgumentException("Unknown vehicle type: " + vehicleType);
        };
    }

    private BigDecimal calculateParkingFee(ParkingTicket parkingTicket) {
        // Implement fee calculation logic based on entry and exit time, vehicle type, etc.
        long minutesParked = java.time.Duration.between(parkingTicket.getEntryTime(), parkingTicket.getExitTime()).toMinutes();


        if (minutesParked <= 30) {
            return BigDecimal.ZERO; // Free for the first 30 minutes
        } else {
            BigDecimal hourlyRate = getHourlyRate(parkingTicket.getVehicle().getType());
            BigDecimal dailyCap = parkingTicket.getVehicle().getType() == VehicleType.TWO_WHEELER ? BigDecimal.valueOf(50) : BigDecimal.valueOf(100);
            BigDecimal fee = hourlyRate.multiply(BigDecimal.valueOf(Math.ceil(minutesParked / 60.0)));
            return fee.min(dailyCap);

        }
    }

    public ParkingTicket vehicleEntry(Long vehicleId, Long parkingLotId) {
        Vehicle vehicle = vehicleService.getVehicleById(vehicleId).orElseThrow();
        List<ParkingSlot> availableSlots = parkingSlotService.getParkingSlotsByLotAndType(parkingLotId,
                ParkingSlotStatus.FREE, vehicle.getType());
        ParkingSlot parkingSlot = availableSlots.getFirst();
        parkingSlotService.updateParkingSlotStatus(parkingSlot.getId(), ParkingSlotStatus.OCCUPIED);
        ParkingTicket parkingTicket = new ParkingTicket();
        parkingTicket.setVehicle(vehicle);
        parkingTicket.setParkingSlot(parkingSlot);
        parkingTicket.setEntryTime(LocalDateTime.now());
        parkingTicket.setStatus(ParkingTktStatus.ACTIVE);
        parkingTicket.setPaymentStatus(PaymentStatus.PENDING);
        ParkingTicket saved = parkingTicketRepository.save(parkingTicket);
        return parkingTicketRepository.findById(saved.getId()).orElseThrow();
    }

    public ParkingTicket vehicleExit(Long ticketId) {

        ParkingTicket parkingTicket = parkingTicketRepository.findById(ticketId).orElseThrow();
        if (parkingTicket.getStatus() != ParkingTktStatus.ACTIVE) {
            throw new IllegalStateException("Ticket is not active");
        }

        parkingTicket.setExitTime(LocalDateTime.now());
        parkingTicket.setFee(calculateParkingFee(parkingTicket));
        parkingSlotService.updateParkingSlotStatus(parkingTicket.getParkingSlot().getId(), ParkingSlotStatus.FREE);
        ParkingTicket saved = parkingTicketRepository.save(parkingTicket);
        return parkingTicketRepository.findById(saved.getId()).orElseThrow();

    }

    public ParkingTicket processPayment(Long ticketId, PaymentMode paymentMode){
        ParkingTicket parkingTicket = parkingTicketRepository.findById(ticketId).orElseThrow();
        if (parkingTicket.getExitTime() == null) {
            throw new IllegalStateException("Vehicle has not exited yet");
        }
        if (parkingTicket.getPaymentStatus() == PaymentStatus.PAID) {
            throw new IllegalStateException("Payment already completed for this ticket");
        }else{
            parkingTicket.setPaymentMode(paymentMode);
            parkingTicket.setPaymentStatus(PaymentStatus.PAID);
            parkingTicket.setStatus(ParkingTktStatus.CLOSED);
            ParkingTicket saved = parkingTicketRepository.save(parkingTicket);
            return parkingTicketRepository.findById(saved.getId()).orElseThrow();
        }
    }

    public List<ParkingTicket> getAllParkingTickets() {
        return parkingTicketRepository.findAll();
    }

    public Optional<ParkingTicket> getParkingTicketById(Long id) {
        return parkingTicketRepository.findById(id);
    }

    public List<ParkingTicket> getActiveTickets() {
        return parkingTicketRepository.findByStatus(ParkingTktStatus.ACTIVE);
    }
}

