import "./VehicleForm.css";
import { motion } from "framer-motion";
import { MarkVehicleTask } from "../../../api/backend/employee-dashboard";
import { useState } from "react";
export default function VehicleForm({ setMakeVehicleVisible, setSelectedVehicle, selectedVehicle, username, setMakeVehicleErrorVisible, setMakeVehicleError }) {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [error, setError] = useState(false);

  async function handleVehicleSubmit() {
    if (!selectedVehicle.yard_name) {
      setError(true);
      return;
    }

    if (!selectedVehicle.yard_person_name) {
      setError(true);
      return;
    }

    if (!selectedVehicle.yard_person_contact_number) {
      setError(true);
      return;
    }

    const contactNumberPattern = /^[0-9]{10}$/;
    if (!contactNumberPattern.test(selectedVehicle.yard_person_contact_number)) {
      setError(true);
      return;
    }

    if (!selectedVehicle.description) {
      setError(true);
      return;
    }

    if (!file1 && !file2) {
      setError(true);
      return;
    }

    const MarkVehicleResponse = await MarkVehicleTask(selectedVehicle._id, {
      yard_name: selectedVehicle.yard_name,
      yard_person_name: selectedVehicle.yard_person_name,
      yard_person_contact_number: selectedVehicle.yard_person_contact_number,
      description: selectedVehicle.description,
      file1: selectedVehicle.file1,
      file2: selectedVehicle.file2,
      username: selectedVehicle.username,
      time: selectedVehicle.time,
      date: selectedVehicle.date,
      completed: true,
    });

    if (MarkVehicleResponse.success === true) {
      setMakeVehicleError(false);
      setSelectedVehicle({});
    } else {
      setMakeVehicleError(true);
      setSelectedVehicle({});
    }

    setMakeVehicleVisible(false);
    setMakeVehicleErrorVisible(true);
  }
  return (
    <motion.div
      initial={{
        left: "50%",
        top: "50%",
        scale: 0,
        x: "-50%",
        y: "-50%",
      }}
      animate={{
        left: "50%",
        top: "50%",
        scale: 1,
        x: "-50%",
        y: "-50%",
      }}
      exit={{
        left: "50%",
        top: "50%",
        scale: 0,
        x: "-50%",
        y: "-50%",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="make-vehicle-done-window mt-4"
    >
      <button
        className="close-button"
        style={{ color: "white" }}
        onClick={() => {
          setMakeVehicleVisible(false);
          setSelectedVehicle({});
          setFile1(null);
          setFile2(null);
          setError(false);
        }}
      >
        ✖
      </button>

      <h1 style={{ marginTop: "10px" }}>Make Vehicle Done.</h1>

      <div className="vehicle-details-container1" style={{ width: "90%" }}>
        <div className="vehicle-details">
          <p className="p1" style={{ backgroundColor: "#9129ac" }}>
            Vehicle Number
          </p>
          <p className="p2">{selectedVehicle.registration_no}</p>
        </div>
        <div className="vehicle-details">
          <p className="p1" style={{ backgroundColor: "#fd9a1e" }}>
            Engine Number
          </p>
          <p className="p2">{selectedVehicle.engine_no}</p>
        </div>
      </div>
      <div className="vehicle-details-container2" style={{ width: "90%" }}>
        <div className="vehicle-details">
          <p className="p1" style={{ backgroundColor: "#e83e3b" }}>
            Chassis Number
          </p>
          <p className="p2">{selectedVehicle.chassis_no}</p>
        </div>
        <div className="vehicle-details">
          <p className="p1" style={{ backgroundColor: "#4aa34d" }}>
            EMI
          </p>
          <p className="p2">{selectedVehicle.emi}</p>
        </div>
      </div>

      <h1 style={{ marginTop: "10px" }}>Enter Vehicle Details To Proceed.</h1>

      <form>
        <div className="vehicle-form-flex">
          <input
            type="text"
            placeholder="Yard Name."
            value={selectedVehicle.yard_name}
            onChange={(e) => {
              setSelectedVehicle({ ...selectedVehicle, yard_name: e.target.value });
            }}
            id="vehicle-number"
            name="vehicle-number"
          />
          <input
            type="text"
            value={selectedVehicle.yard_person_name}
            onChange={(e) => {
              setSelectedVehicle({ ...selectedVehicle, yard_person_name: e.target.value });
            }}
            placeholder="Yard Person Name."
            id="engine-number"
            name="engine-number"
          />
        </div>

        <input
          type="tel"
          value={selectedVehicle.yard_person_contact_number}
          onChange={(e) => {
            setSelectedVehicle({ ...selectedVehicle, yard_person_contact_number: e.target.value });
          }}
          placeholder="Yard Person Contact Number."
          id="chassis-number"
          name="chassis-number"
        />

        <textarea
          value={selectedVehicle.description}
          onChange={(e) => {
            setSelectedVehicle({ ...selectedVehicle, description: e.target.value });
          }}
          placeholder="Description."
        ></textarea>

        <div className="vehicle-form-flex">
          <label htmlFor="vehiclefile1">{selectedVehicle.file1 ? "File 1 Selected." : "Click to choose a file."}</label>
          <label htmlFor="vehiclefile2">{selectedVehicle.file2 ? "File 2 Selected." : "Click to choose a file."}</label>
          <input
            type="file"
            onChange={(e) => {
              setSelectedVehicle({ ...selectedVehicle, file1: e.target.files[0].name });
              setFile1(e.target.files[0]);
            }}
            id="vehiclefile1"
            name="vehiclefile1"
          />
          <input
            type="file"
            onChange={(e) => {
              setSelectedVehicle({ ...selectedVehicle, file2: e.target.files[0].name });
              setFile2(e.target.files[0]);
            }}
            id="vehiclefile2"
            name="vehiclefile2"
          />
        </div>
      </form>

      <h2 style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", padding: "10px 15px" }}>
        <span>
          <i>{username}</i>
        </span>
        <span>
          <i>{selectedVehicle.time}</i>
        </span>
        <span>
          <i>{selectedVehicle.date}</i>
        </span>
      </h2>
      {error ? (
        <h2 style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "13px", padding: "10px 15px", color: "#e83e3b", borderBottom: "1px solid #e83e3b" }}>
          <span>
            <i>Please Fill out all the inputs to proceed.</i>
          </span>
        </h2>
      ) : null}
      <div className="vehicle-form-flex-button">
        <button
          type="submit"
          style={{ marginBottom: "20px", backgroundColor: "#4aa34d" }}
          id="vehicle-submit-button"
          onClick={(e) => {
            e.preventDefault();
            handleVehicleSubmit();
          }}
        >
          Submit
        </button>
        <button
          type="button"
          style={{ marginBottom: "20px", backgroundColor: "#e83e3b" }}
          id="vehicle-submit-button"
          onClick={() => {
            setMakeVehicleVisible(false);
            setSelectedVehicle({});
            setFile1(null);
            setFile2(null);
            setError(false);
          }}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}
