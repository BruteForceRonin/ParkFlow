package com.parking.management.backend.controller;

import com.parking.management.backend.entity.ParkingSlot;
import com.parking.management.backend.service.ParkingSlotService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Parking Slot", description = "Operations related to parking slot management")
@RestController
@RequestMapping("/api/parking-slots")
@RequiredArgsConstructor
public class ParkingSlotController {
    private final ParkingSlotService parkingSlotService;

    @PostMapping
    public ResponseEntity<ParkingSlot> createParkingSlot(@RequestBody ParkingSlot parkingSlot) {
        ParkingSlot createSlot = parkingSlotService.createParkingSlot(parkingSlot);
        return ResponseEntity.status(HttpStatus.CREATED).body(createSlot);
    }

    @GetMapping("/lot/{lotId}")
        public ResponseEntity<List<ParkingSlot>> getParkingSlotsByLotId(@PathVariable Long lotId) {
        List<ParkingSlot> getSlot = parkingSlotService.getAllParkingSlotsByParkingLotId(lotId);
        return ResponseEntity.status(HttpStatus.OK).body(getSlot);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingSlot> updateParkingSlot(@PathVariable Long id, @RequestBody ParkingSlot parkingSlot) {
        ParkingSlot updateSlot = parkingSlotService.updateParkingSlot(id, parkingSlot);
        return ResponseEntity.status(HttpStatus.OK).body(updateSlot);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteParkingSlot(@PathVariable Long id) {
     parkingSlotService.deleteParkingSlotById(id);
     return ResponseEntity.status(HttpStatus.OK).body("Parking slot with ID " + id + " has been deleted.");
    }

    @GetMapping
    public ResponseEntity<List<ParkingSlot>> getAllParkingSlots() {
        List<ParkingSlot> parkingSlots = parkingSlotService.getAllParkingSlots();
        return ResponseEntity.ok(parkingSlots);
    }

}

