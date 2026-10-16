import { useEffect, useState } from "react";
import api from "../api/api";
import StatCard from "../components/StatCard";

const DashboardPage = () => {
  const [parkingLots, setParkingLots] = useState([]);
  const [parkingSlots, setParkingSlots] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const parkingLotsRes = await api.get("/parking-lots");
        setParkingLots(parkingLotsRes.data);

        const parkingSlotsRes = await api.get("/parking-slots");
        setParkingSlots(parkingSlotsRes.data);

        const ticketsRes = await api.get("/tickets/active");
        setTickets(ticketsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <main>
        <div className="container-fluid mt-4 mb-3">
          <div className="row">
            <div className="col-md-6 mb-3">
              <StatCard title="Total Parking Lots" value={parkingLots.length} color="primary"/>
            </div>
            <div className="col-md-6 mb-3">
              <StatCard
                title="Total Parking Slots"
                value={parkingLots.reduce((prev, curr) => {
                  return prev + curr.totalCapacity;
                }, 0)}
                color="success"
              />
            </div>
            <div className="col-md-6 mb-3">
              <StatCard
                title="Available Slots"
                value={
                  parkingSlots.filter((slot) => slot.status === "FREE").length
                }
                color="warning"
              />
            </div>
            <div className="col-md-6 mb-3">
              <StatCard title="Active Tickets" value={tickets.length} color="danger"/>
            </div>
          </div>
                <h5 className="mb-3">Active Tickets</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Ticket ID</th>
                <th scope="col">Registration Number</th>
                <th scope="col">Vehicle Type</th>
                <th scope="col">Slot Number</th>
                <th scope="col">Lot Name</th>
                <th scope="col">Entry Time</th>
                <th scope="col">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                return (
                  <tr key={ticket.id}>
                    <th scope="row">{ticket.id}</th>
                    <td>{ticket.vehicle.registrationNumber}</td>
                    <td>{ticket.vehicle.type}</td>
                    <td>{ticket.parkingSlot.slotNumber}</td>
                    <td>{ticket.parkingSlot.parkingLot.name}</td>
                    <td>{new Date(ticket.entryTime).toLocaleString()}</td>
                    <td>{ticket.paymentStatus}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default DashboardPage;
