import { useEffect, useMemo, useState } from "react";
import api from "../api/api";

const initialForm = {
  slotNumber: "",
  type: "TWO_WHEELER",
  status: "FREE",
  parkingLotId: "",
};

const SlotsTab = () => {
  const [slots, setSlots] = useState([]);
  const [lots, setLots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [lotFilter, setLotFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slotsRes, lotsRes] = await Promise.all([
          api.get("/parking-slots"),
          api.get("/parking-lots"),
        ]);
        setSlots(slotsRes.data);
        setLots(lotsRes.data);
      } catch (requestError) {
        console.error("Error fetching parking slots:", requestError);
        setError("Unable to load parking slots.");
      }
    };
    fetchData();
  }, []);

  const filteredSlots = useMemo(() => slots.filter((slot) => (
    (lotFilter === "all" || String(slot.parkingLot?.id) === lotFilter) &&
    (statusFilter === "all" || slot.status === statusFilter) &&
    (typeFilter === "all" || slot.type === typeFilter)
  )), [slots, lotFilter, statusFilter, typeFilter]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleAdd = () => {
    setFormData(initialForm);
    setSelectedSlot(null);
    setIsEditing(false);
    setError("");
    setShowModal(true);
  };

  const handleEdit = (slot) => {
    setFormData({
      slotNumber: slot.slotNumber,
      type: slot.type,
      status: slot.status,
      parkingLotId: String(slot.parkingLot?.id || ""),
    });
    setSelectedSlot(slot);
    setIsEditing(true);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.parkingLotId || !formData.slotNumber) {
      setError("Parking lot and slot number are required.");
      return;
    }
    try {
      const payload = {
        slotNumber: Number(formData.slotNumber),
        type: formData.type,
        status: formData.status,
        ...(isEditing
          ? {}
          : { parkingLot: { id: Number(formData.parkingLotId) } }),
      };
      if (isEditing) {
        const response = await api.put(`/parking-slots/${selectedSlot.id}`, payload);
        setSlots((previous) => previous.map((slot) => (
          slot.id === selectedSlot.id ? response.data : slot
        )));
      } else {
        const response = await api.post("/parking-slots", payload);
        setSlots((previous) => [...previous, response.data]);
      }
      setShowModal(false);
      setFormData(initialForm);
    } catch (requestError) {
      console.error("Error saving parking slot:", requestError);
      setError("Unable to save parking slot.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this parking slot?")) return;
    try {
      await api.delete(`/parking-slots/${id}`);
      setSlots((previous) => previous.filter((slot) => slot.id !== id));
    } catch (requestError) {
      console.error("Error deleting parking slot:", requestError);
      setError(requestError.response?.data || "Unable to delete parking slot.");
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Parking Slots</h2>
        <button className="btn btn-primary" type="button" onClick={handleAdd}>Add Slot</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <select className="form-select" value={lotFilter} onChange={(event) => setLotFilter(event.target.value)}>
            <option value="all">All parking lots</option>
            {lots.map((lot) => <option key={lot.id} value={lot.id}>{lot.name}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="all">All vehicle types</option>
            <option value="TWO_WHEELER">Two Wheeler</option>
            <option value="FOUR_WHEELER">Four Wheeler</option>
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="FREE">Free</option>
            <option value="OCCUPIED">Occupied</option>
          </select>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>Lot Name</th><th>Slot Number</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredSlots.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.parkingLot?.name || "—"}</td>
                <td>{slot.slotNumber}</td>
                <td>{slot.type}</td>
                <td><span className={`badge text-bg-${slot.status === "FREE" ? "success" : "warning"}`}>{slot.status}</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(slot)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(slot.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {!filteredSlots.length && <tr><td colSpan="5" className="text-center text-muted">No parking slots found.</td></tr>}
          </tbody>
        </table>
      </div>
      {showModal && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setShowModal(false)} />
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog"><div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? "Edit Slot" : "Add Slot"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  <label className="form-label">Parking Lot</label>
                  <select className="form-select mb-3" name="parkingLotId" value={formData.parkingLotId} onChange={handleChange} disabled={isEditing} required>
                    <option value="">Select Parking Lot</option>
                    {lots.map((lot) => <option key={lot.id} value={lot.id}>{lot.name}</option>)}
                  </select>
                  <label className="form-label">Slot Number</label>
                  <input className="form-control mb-3" type="number" name="slotNumber" value={formData.slotNumber} onChange={handleChange} disabled={isEditing} required />
                  <label className="form-label">Vehicle Type</label>
                  <select className="form-select mb-3" name="type" value={formData.type} onChange={handleChange}>
                    <option value="TWO_WHEELER">Two Wheeler</option><option value="FOUR_WHEELER">Four Wheeler</option>
                  </select>
                  {isEditing && <><label className="form-label">Status</label><select className="form-select" name="status" value={formData.status} onChange={handleChange}><option value="FREE">Free</option><option value="OCCUPIED">Occupied</option></select></>}
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button><button type="submit" className="btn btn-primary">Save</button></div>
              </form>
            </div></div>
          </div>
        </>
      )}
    </section>
  );
};

export default SlotsTab;
