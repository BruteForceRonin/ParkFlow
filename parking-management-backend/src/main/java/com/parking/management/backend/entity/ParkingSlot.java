package com.parking.management.backend.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ParkingSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer slotNumber;

    @Enumerated(EnumType.STRING)

    private VehicleType type;

    @Enumerated(EnumType.STRING)

    private ParkingSlotStatus status;
    @ManyToOne
    private ParkingLot parkingLot;

}

