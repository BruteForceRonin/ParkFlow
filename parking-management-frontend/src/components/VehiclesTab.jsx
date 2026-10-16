import { useEffect, useState } from "react";
import { getVehicles, registerVehicle } from "../api/api";

const initialForm = { ownerName: "", model: "", registrationNumber: "", type: "TWO_WHEELER" };

const VehiclesTab = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getVehicles().then(setVehicles).catch((requestError) => {
      console.error("Error fetching vehicles:", requestError);
      setError("Unable to load vehicles.");
    });
  }, []);

  const visibleVehicles = vehicles.filter((vehicle) => (
    vehicle.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
    vehicle.ownerName?.toLowerCase().includes(search.toLowerCase())
  ));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const vehicle = await registerVehicle({
        ...formData,
        registrationNumber: formData.registrationNumber.toUpperCase(),
      });
      setVehicles((previous) => [...previous, vehicle]);
      setFormData(initialForm);
      setShowModal(false);
    } catch (requestError) {
      console.error("Error registering vehicle:", requestError);
      setError("Unable to register vehicle. Check that the registration number is unique.");
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Vehicles</h2>
        <button className="btn btn-primary" onClick={() => { setError(""); setShowModal(true); }}>Register Vehicle</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <input className="form-control mb-3" placeholder="Search by registration number or owner" value={search} onChange={(event) => setSearch(event.target.value)} />
      <div className="table-responsive"><table className="table table-striped align-middle">
        <thead><tr><th>Registration Number</th><th>Owner</th><th>Model</th><th>Type</th></tr></thead>
        <tbody>
          {visibleVehicles.map((vehicle) => <tr key={vehicle.id}><td>{vehicle.registrationNumber}</td><td>{vehicle.ownerName}</td><td>{vehicle.model}</td><td>{vehicle.type}</td></tr>)}
          {!visibleVehicles.length && <tr><td colSpan="4" className="text-center text-muted">No vehicles found.</td></tr>}
        </tbody>
      </table></div>
      {showModal && <div className="modal show d-block" tabIndex="-1"><div className="modal-dialog"><div className="modal-content"><form onSubmit={handleSubmit}>
        <div className="modal-header"><h5 className="modal-title">Register Vehicle</h5><button type="button" className="btn-close" onClick={() => setShowModal(false)} /></div>
        <div className="modal-body">
          <input className="form-control mb-3" placeholder="Owner name" value={formData.ownerName} onChange={(event) => setFormData({ ...formData, ownerName: event.target.value })} required />
          <input className="form-control mb-3" placeholder="Model" value={formData.model} onChange={(event) => setFormData({ ...formData, model: event.target.value })} required />
          <input className="form-control mb-3" placeholder="Registration number" value={formData.registrationNumber} onChange={(event) => setFormData({ ...formData, registrationNumber: event.target.value })} required />
          <select className="form-select" value={formData.type} onChange={(event) => setFormData({ ...formData, type: event.target.value })}><option value="TWO_WHEELER">Two Wheeler</option><option value="FOUR_WHEELER">Four Wheeler</option></select>
        </div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button><button className="btn btn-primary">Save</button></div>
      </form></div></div><div className="modal-backdrop fade show" /></div>}
    </section>
  );
};

export default VehiclesTab;
