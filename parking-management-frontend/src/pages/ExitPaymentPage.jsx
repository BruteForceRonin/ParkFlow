import { useEffect, useState } from "react";
import { downloadTicketPdf, getActiveTickets, processPayment, vehicleExit } from "../api/api";

const ExitPaymentPage = () => {
  const [ticketId, setTicketId] = useState("");
  const [activeTickets, setActiveTickets] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [error, setError] = useState("");

  const formatDateTime = (value) => value ? new Date(value).toLocaleString() : "—";
  const getDuration = () => {
    if (!ticket?.entryTime || !ticket?.exitTime) return "—";
    const minutes = Math.max(0, Math.floor(
      (new Date(ticket.exitTime) - new Date(ticket.entryTime)) / 60000,
    ));
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  useEffect(() => {
    const fetchActiveTickets = async () => {
      try {
        setActiveTickets(await getActiveTickets());
      } catch (requestError) {
        console.error("Error fetching active tickets:", requestError);
        setError("Unable to load active tickets.");
      }
    };
    fetchActiveTickets();
  }, []);

  const handleExit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setTicket(await vehicleExit(Number(ticketId)));
    } catch (requestError) {
      console.error("Error recording vehicle exit:", requestError);
      setError("Unable to record exit. Verify that the ticket is active.");
    }
  };

  const handlePayment = async () => {
    try {
      setError("");
      setTicket(await processPayment(ticket.id, paymentMode));
    } catch (requestError) {
      console.error("Error processing payment:", requestError);
      setError("Unable to process payment.");
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadTicketPdf(ticket.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket-${ticket.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      console.error("Error downloading ticket PDF:", requestError);
      setError("Unable to download ticket PDF.");
    }
  };

  return (
    <main className="container mt-4">
      <div className="row justify-content-center"><div className="col-lg-7">
        <h2 className="mb-3">Exit & Payment</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {!ticket && <form className="card card-body shadow-sm" onSubmit={handleExit}>
          <label className="form-label">Active Ticket</label>
          <select className="form-select mb-3" value={ticketId} onChange={(event) => setTicketId(event.target.value)} required>
            <option value="">Select an active ticket</option>
            {activeTickets.map((activeTicket) => (
              <option key={activeTicket.id} value={activeTicket.id}>
                Ticket #{activeTicket.id} — {activeTicket.vehicle?.registrationNumber || "Vehicle"}
              </option>
            ))}
          </select>
          {!activeTickets.length && <p className="text-muted">There are no active tickets available.</p>}
          <button className="btn btn-primary" disabled={!activeTickets.length}>Record Exit</button>
        </form>}
        {ticket && <div className="card card-body shadow-sm">
          <h5>Ticket #{ticket.id}</h5>
          <p className="mb-1">Vehicle: {ticket.vehicle?.registrationNumber}</p>
          <p className="mb-1">Entry time: {formatDateTime(ticket.entryTime)}</p>
          <p className="mb-1">Exit time: {formatDateTime(ticket.exitTime)}</p>
          <p className="mb-1">Duration: {getDuration()}</p>
          <p className="mb-1">Fee: ₹{ticket.fee ?? 0}</p>
          <p>Status: <strong>{ticket.status}</strong></p>
          {ticket.paymentStatus !== "PAID" ? <>
            <label className="form-label">Payment mode</label>
            <select className="form-select mb-3" value={paymentMode} onChange={(event) => setPaymentMode(event.target.value)}>
              <option value="CASH">Cash</option><option value="CARD">Card</option><option value="UPI">UPI</option>
            </select>
            <button className="btn btn-success" onClick={handlePayment}>Complete Payment</button>
          </> : <div className="alert alert-success mb-3">Payment completed.</div>}
          <button className="btn btn-outline-primary mt-3" onClick={handleDownload}>Download PDF</button>
          <button className="btn btn-link mt-2" onClick={async () => {
            setTicket(null);
            setTicketId("");
            setError("");
            setActiveTickets(await getActiveTickets());
          }}>Process another ticket</button>
        </div>}
      </div></div>
    </main>
  );
};

export default ExitPaymentPage;
