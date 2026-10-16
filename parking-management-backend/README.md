# ParkFlow

ParkFlow is a backend parking lot management system built with Spring Boot, PostgreSQL, and Spring Data JPA. It provides REST APIs for managing parking lots, parking slots, vehicles, parking tickets, fee calculation, payments, and PDF receipts.

The project is designed as a portfolio application that models real-world parking operations commonly found in Chennai malls and metro stations. Its goal is to demonstrate practical backend engineering, database design, REST API development, and business logic beyond basic CRUD operations.

## Project Status

| Area | Status |
| --- | --- |
| Backend phases 1-6 | Complete |
| PDF ticket generation | Complete |
| Swagger/OpenAPI documentation | Complete |
| PostgreSQL database integration | Complete |
| Backend REST API | Complete |
| Formal project report | Planned |

## Features

- Parking lot CRUD operations
- Parking slot CRUD operations
- Slot availability lookup by parking lot
- Support for two-wheelers and four-wheelers
- Vehicle registration and lookup by registration number
- Automatic parking slot assignment during vehicle entry
- Vehicle exit processing with fee calculation
- Payment status tracking for cash, card, and UPI
- Active and closed parking ticket management
- Context-aware PDF entry slips and receipts
- PostgreSQL persistence with Spring Data JPA
- OpenAPI/Swagger API documentation
- Centralized handling for common application and database errors

## Technology Stack

| Technology | Usage |
| --- | --- |
| Java 21 | Application language |
| Spring Boot 3.5 | Backend framework |
| Spring Web | REST API |
| Spring Data JPA / Hibernate | Persistence and ORM |
| PostgreSQL | Relational database |
| Lombok | Boilerplate reduction |
| iText 7.2.5 | PDF generation |
| Springdoc OpenAPI 2.8.8 | Swagger documentation |
| Maven | Build and dependency management |

## Application URLs

| Service | URL |
| --- | --- |
| Backend server | `http://localhost:8080` |
| API base URL | `http://localhost:8080/api` |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` |
| OpenAPI specification | `http://localhost:8080/v3/api-docs` |

## Domain Model

ParkFlow is built around four core entities:

- **ParkingLot**: Name, location, total capacity, and active/inactive status.
- **ParkingSlot**: Slot number, vehicle type, slot status, and parking lot reference.
- **Vehicle**: Owner name, model, registration number, and vehicle type.
- **ParkingTicket**: Entry and exit times, fee, payment details, ticket status, vehicle, and assigned slot.

### Supported Values

- Vehicle types: `TWO_WHEELER`, `FOUR_WHEELER`
- Slot statuses: `FREE`, `OCCUPIED`, `RESERVED`
- Payment modes: `CASH`, `CARD`, `UPI`
- Payment statuses: `PENDING`, `PAID`
- Ticket statuses: `ACTIVE`, `CLOSED`

## Ticket Lifecycle

```text
ACTIVE on vehicle entry
        |
        v
Fee calculated on vehicle exit
Slot released
        |
        v
CLOSED after payment
```

Tickets remain `ACTIVE` after exit until payment is completed.

## Parking Fee Rules

| Vehicle Type | Rate | Maximum Daily Fee |
| --- | ---: | ---: |
| Two-wheeler | Rs. 10 per started hour | Rs. 50 |
| Four-wheeler | Rs. 20 per started hour | Rs. 100 |

The first 30 minutes are free.

## API Reference

The backend API is available under:

```text
http://localhost:8080/api
```

### Parking Lots

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/parking-lots` | Create a parking lot |
| `GET` | `/parking-lots` | List all parking lots |
| `GET` | `/parking-lots/{id}` | Get a parking lot |
| `PUT` | `/parking-lots/{id}` | Update a parking lot |
| `DELETE` | `/parking-lots/{id}` | Delete a parking lot |
| `GET` | `/parking-lots/{id}/available-slots` | List free slots in a lot |

### Parking Slots

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/parking-slots` | Create a parking slot |
| `GET` | `/parking-slots` | List all parking slots |
| `GET` | `/parking-slots/lot/{lotId}` | List slots in a parking lot |
| `PUT` | `/parking-slots/{id}` | Update a parking slot |
| `DELETE` | `/parking-slots/{id}` | Delete a parking slot |

### Vehicles

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/vehicles` | Register a vehicle |
| `GET` | `/vehicles` | List all vehicles |
| `GET` | `/vehicles/{id}` | Get a vehicle |
| `GET` | `/vehicles/registration/{registrationNumber}` | Find a vehicle by registration number |
| `DELETE` | `/vehicles/{id}` | Delete a vehicle |

### Parking Tickets

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/tickets/entry?vehicleId={vehicleId}&parkingLotId={parkingLotId}` | Assign a compatible free slot and create a ticket |
| `PUT` | `/tickets/{id}/exit` | Record exit, calculate the fee, and release the slot |
| `PUT` | `/tickets/{id}/pay?paymentMode={paymentMode}` | Process payment and close the ticket |
| `GET` | `/tickets` | List all tickets |
| `GET` | `/tickets/{id}` | Get a ticket |
| `GET` | `/tickets/active` | List active tickets |
| `GET` | `/tickets/{ticketId}/pdf` | Download a ticket PDF |

## PDF Ticket Generation

The endpoint `GET /api/tickets/{ticketId}/pdf` generates a PDF in memory using iText 7 and `ByteArrayOutputStream`. Files are not stored on disk.

- An `ACTIVE` ticket returns an entry slip.
- A `CLOSED` ticket returns a full parking receipt.

The PDF can include ticket, vehicle, parking lot, slot, entry, exit, duration, fee, and payment information.

## Project Structure

```text
parking-management-backend/
|-- src/
|   |-- main/
|   |   |-- java/com/parking/management/
|   |   |   |-- config/          # OpenAPI configuration
|   |   |   |-- controller/      # REST endpoints
|   |   |   |-- entity/          # JPA entities and enums
|   |   |   |-- exception/       # Global exception handling
|   |   |   |-- repository/      # Spring Data repositories
|   |   |   `-- service/         # Business logic
|   |   `-- resources/
|       `-- application.properties
|   `-- test/
|       `-- java/                # Spring context tests
|-- pom.xml
|-- mvnw
|-- mvnw.cmd
`-- README.md
```
## Getting Started

### Prerequisites

- Java 21 or later
- PostgreSQL
- Maven, or the included Maven Wrapper

### 1. Create the database

Create a PostgreSQL database named `parking_db`:

```sql
CREATE DATABASE parking_db;
```

### 2. Configure the database

Update `src/main/resources/application.properties` with your local PostgreSQL credentials:

```properties
spring.application.name=parking-management-backend

spring.datasource.url=jdbc:postgresql://localhost:5432/parking_db
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false
```

Do not commit real database passwords or other secrets. Keep local configuration out of Git and use a safe example file for shared settings.

### 3. Run the application

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

macOS/Linux:

```bash
./mvnw spring-boot:run
```

The backend starts at `http://localhost:8080`.

### 4. Build and test

Windows:

```powershell
.\mvnw.cmd clean test
```

macOS/Linux:

```bash
./mvnw clean test
```

## Example Workflow

1. Create a parking lot.
2. Create compatible parking slots for the lot.
3. Register a vehicle.
4. Create an entry ticket:

   ```text
   POST /api/tickets/entry?vehicleId=1&parkingLotId=1
   ```

5. Record the vehicle exit:

   ```text
   PUT /api/tickets/1/exit
   ```

6. Process payment:

   ```text
   PUT /api/tickets/1/pay?paymentMode=UPI
   ```

7. Download the ticket PDF:

   ```text
   GET /api/tickets/1/pdf
   ```

## Development Phases

- **Phases 1-6:** Project setup, entities, repositories, services, controllers, Postman testing, and global exception handling.
- **Phase 7:** iText 7 PDF generation with a single context-aware ticket endpoint.
- **Phase 8:** Springdoc OpenAPI and Swagger documentation.
- **Phase 9:** Formal project report and final documentation.

## Current Limitations

The following features are not currently implemented:

- Authentication and role-based authorization
- Reservation workflow
- Real payment gateway integration
- Reporting, analytics, or occupancy dashboards
- Database migration tooling such as Flyway or Liquibase
- Email, SMS, or push notifications
- Comprehensive request validation and structured error responses
- Concurrency protection for simultaneous slot assignment
- Comprehensive controller, service, repository, PDF, and workflow tests

## Testing Status

The project currently includes a Spring Boot context-load test. Additional automated tests should be added for controllers, services, repositories, fee calculation, PDF generation, and the complete entry-to-payment workflow.

## License

No project license has been defined yet.
