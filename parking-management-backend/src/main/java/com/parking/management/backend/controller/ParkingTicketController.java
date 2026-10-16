package com.parking.management.backend.controller;

import com.parking.management.backend.entity.ParkingTicket;
import com.parking.management.backend.entity.PaymentMode;
import com.parking.management.backend.service.ParkingTicketService;
import com.parking.management.backend.service.TicketPdfService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Tag(name = "Parking Ticket", description = "Operations related to ticket management, including entry, exit, payment processing, and PDF generation")
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class ParkingTicketController {
    private final ParkingTicketService parkingTicketService;
    private final TicketPdfService  ticketPdfService;

    @PostMapping("/entry")
    @Operation(summary = "Vehicle entry", description = "Creates a new parking ticket and assigns a slot")
    public ResponseEntity<ParkingTicket> createParkingTicket(@RequestParam Long vehicleId, @RequestParam Long parkingLotId){
        ParkingTicket parkingTicket = parkingTicketService.vehicleEntry(vehicleId, parkingLotId);
        return ResponseEntity.status(HttpStatus.CREATED).body(parkingTicket);
    }

    @PutMapping("/{id}/exit")
    @Operation(summary = "Vehicle exit", description = "Records exit time and calculates parking fee")
    public ResponseEntity<ParkingTicket> updateParkingTicket(@PathVariable Long id){
        ParkingTicket parkingTicket = parkingTicketService.vehicleExit(id);
        return ResponseEntity.status(HttpStatus.OK).body(parkingTicket);
    }

    @PutMapping("/{id}/pay")
    @Operation(summary = "Process payment", description = "Processes payment and closes the ticket")
    public ResponseEntity<ParkingTicket> payParkingFee(@PathVariable Long id, @RequestParam PaymentMode paymentMode){
        ParkingTicket parkingTicket = parkingTicketService.processPayment(id, paymentMode);
        return ResponseEntity.status(HttpStatus.OK).body(parkingTicket);
    }

    @GetMapping
    public ResponseEntity<List<ParkingTicket>> getAllParkingTickets() {
        List<ParkingTicket> parkingTickets = parkingTicketService.getAllParkingTickets();
        return ResponseEntity.status(HttpStatus.OK).body(parkingTickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getParkingTicketById(@PathVariable Long id) {
        Optional<ParkingTicket> parkingTicket = parkingTicketService.getParkingTicketById(id);
        if (parkingTicket.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(parkingTicket.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Parking ticket with ID " + id + " not found.");
        }

    }

    @GetMapping("/active")
    public ResponseEntity<List<ParkingTicket>> getActiveParkingTickets() {
        List<ParkingTicket> activeTickets = parkingTicketService.getActiveTickets();
        return ResponseEntity.status(HttpStatus.OK).body(activeTickets);
    }

    @GetMapping("/{ticketId}/pdf")
    @Operation(summary = "Generate ticket", description = "Processes ticket information and generates a PDF for the parking ticket")
    @ApiResponse(responseCode = "200", content = @Content(mediaType = "application/pdf"))
    public ResponseEntity<byte[]> getParkingTicketPdf(@PathVariable Long ticketId) {
        ParkingTicket ticket = parkingTicketService.getParkingTicketById(ticketId).orElseThrow();
        byte[] pdfVariable = ticketPdfService.generatePdfForTicket(ticket);

        HttpHeaders headers = new HttpHeaders();
               headers.setContentType(MediaType.APPLICATION_PDF);
               headers.setContentDispositionFormData("attachment","ticket -"+ticketId+".pdf");

        ResponseEntity<byte[]> result = new ResponseEntity<>(pdfVariable,headers,HttpStatus.OK);

        return result;


    }

}

