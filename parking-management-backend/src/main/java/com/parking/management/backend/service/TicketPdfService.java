package com.parking.management.backend.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.parking.management.backend.entity.ParkingTicket;
import com.parking.management.backend.entity.ParkingTktStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class TicketPdfService {
    public byte[] generatePdfForTicket(ParkingTicket parkingTicket) {
        // In a real implementation, you would use a library like iText to generate a PDF document with the ticket details.
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        // Here you would create a PDF document, add content to it, and then close the writer.
        PdfDocument pdfDocument = new PdfDocument(writer);
        Document document = new Document(pdfDocument);

        if (parkingTicket.getStatus() == ParkingTktStatus.ACTIVE) {
            document.add(new Paragraph("ParkFlow Entry Slip"));
            document.add(new Paragraph("----------------------------"));
            document.add(new Paragraph("Ticket ID: " + parkingTicket.getId()));
            document.add(new Paragraph("Vehicle: " + parkingTicket.getVehicle().getRegistrationNumber()));
            document.add(new Paragraph("Vehicle Type: " + parkingTicket.getVehicle().getType()));
            document.add(new Paragraph("Parking Lot Name: " + parkingTicket.getParkingSlot().getParkingLot().getName()));
            document.add(new Paragraph("Parking Slot: " + parkingTicket.getParkingSlot().getSlotNumber()));
            document.add(new Paragraph("Entry Time: " + parkingTicket.getEntryTime()));


        } else {
            document.add(new Paragraph("ParkFlow Exit Slip"));
            document.add(new Paragraph("----------------------------"));
            document.add(new Paragraph("Vehicle: " + parkingTicket.getVehicle().getRegistrationNumber()));
            document.add(new Paragraph("Parking Lot Name: " + parkingTicket.getParkingSlot().getParkingLot().getName()));
            document.add(new Paragraph("Parking Slot: " + parkingTicket.getParkingSlot().getSlotNumber()));
            document.add(new Paragraph("Entry Time: " + parkingTicket.getEntryTime()));
            document.add(new Paragraph(("Exit Time: " + parkingTicket.getExitTime())));
            document.add(new Paragraph("Duration: " + java.time.Duration.between(parkingTicket.getEntryTime(), parkingTicket.getExitTime()).toMinutes() + " minutes"));
            document.add(new Paragraph("Parking Fee: " + parkingTicket.getFee()));
            document.add(new Paragraph("Payment Mode: " + parkingTicket.getPaymentMode()));


        }

        document.close();

        return outputStream.toByteArray();


    }
}

