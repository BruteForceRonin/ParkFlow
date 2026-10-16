import { useState } from "react";
import { useLocation } from "react-router-dom";
import LotsTab from "../components/LotsTab";
import SlotsTab from "../components/SlotsTab";
import VehiclesTab from "../components/VehiclesTab";
const ManagePage = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.state?.activeTab || "lots");

  const handleClick = (tab) => {
    setActive(tab);
  };
  return (
    <>
      <main>
        <div className="container-fluid mt-4">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${active === "lots" ? "active" : ""}`}
                onClick={() => handleClick("lots")}
              >
                Parking Lots
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${active === "slots" ? "active" : ""}`}
                onClick={() => handleClick("slots")}
              >
                Parking Slots
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${active === "vehicles" ? "active" : ""}`}
                onClick={() => handleClick("vehicles")}
              >
                Vehicles
              </button>
            </li>
          </ul>
          <div className="tab-content mt-3">
            {active === "lots" && (
              <div className="tab-pane active"><LotsTab/></div>
            )}
            {active === "slots" && (
              <div className="tab-pane active"><SlotsTab /></div>
            )}
            {active === "vehicles" && (
              <div className="tab-pane active"><VehiclesTab /></div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ManagePage;
