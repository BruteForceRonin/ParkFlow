package com.parking.management.backend.controller;

import com.parking.management.backend.entity.ParkingLot;
import com.parking.management.backend.entity.ParkingSlot;
import com.parking.management.backend.service.ParkingLotService;
import com.parking.management.backend.service.ParkingSlotService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Tag(name = "Parking Lot", description = "Operations related to parking lot management")

@RestController
@RequestMapping("/api/parking-lots")
@RequiredArgsConstructor
public class ParkingLotController {
    private final ParkingLotService parkingLotService;
    private final ParkingSlotService parkingSlotService;

    @PostMapping
    public ResponseEntity<ParkingLot> createParkingLot(@RequestBody ParkingLot parkingLot) {
        ParkingLot savedLot = parkingLotService.createParkingLot(parkingLot);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedLot);

    }

    @GetMapping
    public ResponseEntity<List<ParkingLot>> getAllParkingLots() {
        List<ParkingLot> getLot = parkingLotService.getAllParkingLots();
        return ResponseEntity.status(HttpStatus.OK).body(getLot);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getParkingLotById(@PathVariable Long id) {
        Optional<ParkingLot> getLotId = parkingLotService.getParkingLotById(id);
        if (getLotId.isPresent()) {
            // lot was found â€” return 200 with the object
            return ResponseEntity.status(HttpStatus.OK).body(getLotId.get());
        } else {
            // lot not found â€” return 404
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Parking lot with ID " + id + " not found.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingLot> updateParkingLot(@PathVariable Long id, @RequestBody ParkingLot parkingLot) {
        ParkingLot updateLot = parkingLotService.updateParkingLot(id, parkingLot);
        return ResponseEntity.status(HttpStatus.OK).body(updateLot);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteParkingLot(@PathVariable Long id) {
        parkingLotService.deleteParkingLotById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Parking lot with ID " + id + " has been deleted.");

    }

    @GetMapping("/{id}/available-slots")
    public ResponseEntity<List<ParkingSlot>> getAvailableParkingSlotsById(@PathVariable Long id) {
        List<ParkingSlot> getAvailableSlots = parkingSlotService.getParkingSlotsByLotAndStatus(id);
        return ResponseEntity.status(HttpStatus.OK).body(getAvailableSlots);
    }


}

