import { useState, useEffect } from "react";
import api from "../api/api";
const LotsTab = () => {
  const [parkingLots, setParkingLots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    totalCapacity: "",
    status: "ACTIVE",
  });
  const [selectedLot, setSelectedLot] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parkingLotsRes = await api.get("/parking-lots");
        setParkingLots(parkingLotsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedLot) {
        const res = await api.post("/parking-lots", formData);
        setParkingLots((prevLots) => [...prevLots, res.data]);
      } else {
        const res = await api.put(`/parking-lots/${selectedLot.id}`, formData);
        setParkingLots((prevLots) =>
          prevLots.map((lot) => (lot.id === selectedLot.id ? res.data : lot)),
        );
      }
      setShowModal(false);
      setFormData({
        name: "",
        location: "",
        totalCapacity: "",
        status: "ACTIVE",
      });
      setSelectedLot(null);
    } catch (error) {
      console.error("Error adding parking lot:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      name: "",
      location: "",
      totalCapacity: "",
      status: "ACTIVE",
    });
    setSelectedLot(null);
  };

  const handleEdit = (id) => {
    const lot = parkingLots.find((lot) => lot.id === id);
    setFormData({
      name: lot.name,
      location: lot.location,
      totalCapacity: lot.totalCapacity,
      status: lot.status,
    });
    setSelectedLot(lot);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/parking-lots/${id}`);
      setParkingLots((prevLots) => prevLots.filter((lot) => lot.id !== id));
    } catch (error) {
      console.error("Error deleting parking lot:", error);
    }
  };

  return (
    <>
      <h2>Parking Lots</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowModal(true)}
      >
        Add Parking Lot
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Total Capacity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parkingLots.map((lot) => ( // implicit return when using parentheses () instead of curly braces {}
            <tr key={lot.id}>
              <td>{lot.name}</td>
              <td>{lot.location}</td>
              <td>{lot.totalCapacity}</td>
              <td>{lot.status}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleEdit(lot.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(lot.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Parking Lot</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                {/* Name (text input)
                    Location (text input)
                    Total Capacity (number input)
                    Status (select — ACTIVE or INACTIVE) */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Total Capacity</label>
                    <input
                      type="number"
                      className="form-control"
                      name="totalCapacity"
                      value={formData.totalCapacity}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LotsTab;
