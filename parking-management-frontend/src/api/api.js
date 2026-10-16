import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});


const vehicleEntry = async (vehicleId,parkingLotId)=>{
    const res = await api.post("/tickets/entry",null,{params : {vehicleId,parkingLotId}})
    return res.data

}

const vehicleExit = async (ticketId)=>{
    const res = await api.put(`/tickets/${ticketId}/exit`,null)
    return res.data
}

const processPayment = async (ticketId,paymentMode)=>{
    const res = await api.put(`/tickets/${ticketId}/pay`,null,{params : {paymentMode}})
    return res.data
}

const downloadTicketPdf = async (ticketId)=>{
    const res = await api.get(`/tickets/${ticketId}/pdf`,{responseType:'blob'})
    return res.data
}

const getVehicles = async () => (await api.get("/vehicles")).data;
const getVehicleByRegistration = async (registrationNumber) => (
    (await api.get(`/vehicles/registration/${encodeURIComponent(registrationNumber)}`)).data
);
const registerVehicle = async (vehicle) => (await api.post("/vehicles", vehicle)).data;
const getParkingLots = async () => (await api.get("/parking-lots")).data;
const getParkingSlots = async () => (await api.get("/parking-slots")).data;
const getActiveTickets = async () => (await api.get("/tickets/active")).data;

export default api;
export {
    vehicleEntry,
    vehicleExit,
    processPayment,
    downloadTicketPdf,
    getVehicles,
    getVehicleByRegistration,
    registerVehicle,
    getParkingLots,
    getParkingSlots,
    getActiveTickets,
};