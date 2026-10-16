import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getParkingLots, getVehicleByRegistration, vehicleEntry } from "../api/api";

const EntryPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [lots, setLots] = useState([]);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [parkingLotId, setParkingLotId] = useState("");
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getParkingLots().then((lotData) => {
      setLots(lotData.filter((lot) => lot.status === "ACTIVE"));
    }).catch((requestError) => {
      console.error("Error loading entry form:", requestError);
      setError("Unable to load parking lots.");
    });
  }, []);

  const handleVehicleSearch = async (event) => {
    event.preventDefault();
    try {
      setError("");
      const vehicle = await getVehicleByRegistration(registrationNumber.trim().toUpperCase());
      setVehicles([vehicle]);
      setSelectedVehicle(vehicle);
      setVehicleId(String(vehicle.id));
    } catch (requestError) {
      if (requestError.response?.status === 404) {
        navigate("/manage", { state: { activeTab: "vehicles" } });
        return;
      }
      console.error("Error searching vehicle:", requestError);
      setError("Unable to search for vehicle.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setTicket(await vehicleEntry(Number(vehicleId), Number(parkingLotId)));
    } catch (requestError) {
      console.error("Error recording vehicle entry:", requestError);
      setError("Unable to record entry. Check vehicle and slot availability.");
    }
  };

  return (
    <main className="container mt-4">
      <div className="row justify-content-center"><div className="col-lg-7">
        <h2 className="mb-3">Vehicle Entry</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form className="card card-body shadow-sm" onSubmit={handleSubmit}>
          <label className="form-label">Vehicle registration number</label>
          <div className="input-group mb-3">
            <input className="form-control" value={registrationNumber} onChange={(event) => setRegistrationNumber(event.target.value)} placeholder="TN01AB1234" required />
            <button className="btn btn-outline-primary" type="button" onClick={handleVehicleSearch}>Search</button>
          </div>
          {selectedVehicle && <div className="alert alert-info py-2">Vehicle: {selectedVehicle.registrationNumber} ({selectedVehicle.type})</div>}
          {vehicles.length === 0 && <p className="text-muted">Search for a registered vehicle to continue.</p>}
          <label className="form-label">Parking lot</label>
          <select className="form-select mb-3" value={parkingLotId} onChange={(event) => setParkingLotId(event.target.value)} required>
            <option value="">Select parking lot</option>
            {lots.map((lot) => <option key={lot.id} value={lot.id}>{lot.name} — {lot.location}</option>)}
          </select>
          <button className="btn btn-primary" disabled={!vehicleId}>Record Entry</button>
        </form>
        {ticket && <div className="alert alert-success mt-3"><strong>Entry recorded.</strong> Ticket #{ticket.id}, slot {ticket.parkingSlot?.slotNumber} at {ticket.parkingSlot?.parkingLot?.name}.</div>}
      </div></div>
    </main>
  );
};

export default EntryPage;