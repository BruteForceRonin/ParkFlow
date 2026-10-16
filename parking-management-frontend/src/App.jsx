import "./App.css";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";

import Navbar from "./components/Navbar";
import ManagePage from "./pages/ManagePage";
import EntryPage from "./pages/EntryPage";
import ExitPaymentPage from "./pages/ExitPaymentPage";

function App() {
  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/manage" element={<ManagePage />} />
        <Route path="/entry" element={<EntryPage />} />
        <Route path="/exit" element={<ExitPaymentPage />} />
      </Routes>
    </>
  );
}

export default App;
