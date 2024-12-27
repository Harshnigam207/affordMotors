import "./VehicleCards.css";
import { motion } from "framer-motion";
import { cancelTask } from "../../../api/backend/employee-dashboard";
export default function VehicleCards({ username, pageno, searchValue, vehiclesArray, setSelectedVehicle, setMakeVehicleVisible, setCancelVehicleVisible, setCancelError }) {
  function selectVehicle(vehicle) {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toTimeString().slice(0, 5);
    setSelectedVehicle({ ...vehicle, date: formattedDate, time: formattedTime, username: username });
    setMakeVehicleVisible(true);
  }

  async function handleVehicleCancel(_id) {
    const cancelresponse = await cancelTask(_id);
    if (cancelresponse.success) {
      setCancelError(false);
    } else {
      setCancelError(true);
    }
    setCancelVehicleVisible(true);
  }

  let cardsCounter = 0;
  return (
    <div className="overall-cards-container">
      <motion.div className="cards-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.2 }} key={pageno + searchValue}>
        {vehiclesArray.length > 0 ? (
          vehiclesArray.map((vehicle) => {
            cardsCounter = cardsCounter + 1;
            return (
              <div className="card mt-4" key={vehicle._id}>
                <div className="card-header1">
                  <h4 className="card-title1">{cardsCounter}.</h4>
                  <p className="card-text1">{vehicle.registration_no}</p>
                </div>
                <div className="card-footer1">
                  <span
                    className="card-link1 success-link"
                    onClick={() => {
                      selectVehicle(vehicle);
                    }}
                  >
                    Mark Done
                  </span>
                  <span
                    className="card-link1 danger-link"
                    onClick={() => {
                      handleVehicleCancel(vehicle._id);
                    }}
                  >
                    Cancel
                  </span>
                  <div className="card-after-element"></div>
                  <div className="card-before-element"></div>
                </div>
              </div>
            );
          })
        ) : searchValue !== "" ? (
          <h1
            style={{
              color: "var(--dark-gray)",
              fontSize: "24px",
              marginTop: "20px",
              fontWeight: "700",
              borderBottom: "2px solid var(--dark-gray)",
            }}
          >
            No Vehicles Found.
          </h1>
        ) : (
          <h1
            style={{
              color: "var(--dark-gray)",
              fontSize: "24px",
              marginTop: "20px",
              fontWeight: "700",
              borderBottom: "2px solid var(--dark-gray)",
            }}
          >
            No Tasks Assigned to you yet.
          </h1>
        )}
      </motion.div>
    </div>
  );
}
