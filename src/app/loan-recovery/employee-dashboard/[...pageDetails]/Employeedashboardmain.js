"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchEmployeeTasks, paginationDetails, searchTasks, taskOverallDetails } from "../../../api/backend/employee-dashboard";
import ShowPieces from "../../../components/employee-dashboard/showPieces/showPieces";
import Popup from "../../../components/employee-dashboard/Popup/Popup";
import Pagination from "../../../components/employee-dashboard/Pagination/Pagination";
import VehicleCards from "../../../components/employee-dashboard/VehicleCards/VehicleCards";
import VehicleForm from "../../../components/employee-dashboard/VehicleForm/VehicleForm";

export default function EmployeeDashboardMain({ id, username, pageno, vehicleData, paginationData, tasksData }) {
  const [toolbarShow, setToolbarShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [makeVehicleVisible, setMakeVehicleVisible] = useState(false);
  const [cancelVehicleVisible, setCancelVehicleVisible] = useState(false);
  const [vehiclesArray, setVehiclesArray] = useState(vehicleData);
  const [pagination, setPagination] = useState(paginationData);
  const [cardsArray, setCardsArray] = useState(tasksData);
  const [searchValue, setSearchValue] = useState("");
  const [cancelError, setCancelError] = useState(false);
  const [makeVehicleError, setMakeVehicleError] = useState(false);
  const [makeVehicleErrorVisible, setMakeVehicleErrorVisible] = useState(false);
  const containerRef = useRef(null);
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const mainRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        callAgain();
      } catch (err) {
        console.log("Error fetching employee tasks:", err);
      }
    }
    fetchData();
    setSearchValue("");
    setSelectedVehicle({});
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pageno, id]);

  useEffect(() => {
    function checkWidth() {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  async function callAgain() {
    const vehicleData = await fetchEmployeeTasks(id, pageno);
    const paginationData = await paginationDetails(id, pageno);
    const tasksData = await taskOverallDetails(id);
    setVehiclesArray(vehicleData);
    setPagination(paginationData);
    setCardsArray(tasksData);
  }

  async function handleSearch(searchData) {
    setSearchValue(searchData);
    if (searchData === "") {
      const vehicleData = await fetchEmployeeTasks(id, pageno);
      setVehiclesArray(vehicleData);
    } else {
      const searchResult = await searchTasks(searchData.toUpperCase());
      setVehiclesArray(searchResult);
    }
  }

  return (
    <>
      <div className="employee-page-container" ref={containerRef} style={{ filter: cancelVehicleVisible || makeVehicleVisible || makeVehicleErrorVisible ? "brightness(0.4)" : "none" }}>
        {isMobile ? (
          <div className={toolbarShow ? "employee-toolbar-enter employee-toolbar-responsive" : "employee-toolbar-leave employee-toolbar-responsive"}>
            <div style={{ display: "flex", height: "50px", width: "150px", alignItems: "center", justifyContent: "center", gap: "3px" }}>
              <img src="/favicon.ico" alt="Favicon" style={{ height: "20px", width: "20px", borderRadius: "50%" }} />
              <h1 className="employee-title">Afford Motors</h1>
            </div>
            <center>
              <hr className="employee-bg-line" />
            </center>
            <div className="employee-toolbar-options">
              <button className="employee-toolbar-button employee-icons-container" style={{ borderBottom: "none", marginLeft: "15px" }}>
                <span>
                  <b>
                    <i>{username}</i>
                  </b>
                </span>
              </button>
              <button className="employee-toolbar-button employee-icons-container mt-3">
                <span className="material-icons employee-icons" style={{ fontSize: "20px" }}>
                  directions_bus
                </span>
                <span>Vehicles</span>
              </button>
              <button className="employee-toolbar-button employee-icons-container">
                <img src="/assets/user_dashboard/user_icon.png" alt="usericonimg" className="employee-icons" style={{ height: "22px", width: "22px" }} />
                <span>Profile</span>
              </button>
            </div>
            <div className="employee-toolbar-bottom">
              <center>
                <hr className="employee-bg-line line-below" />
              </center>
              <div className="employee-toolbar-bottom-options">
                <div className="employee-icons-container" style={{ marginBottom: "20px" }}>
                  <span className="material-icons employee-icons" style={{ fontSize: "20px", marginLeft: "3px" }}>
                    logout
                  </span>
                  <span>Logout</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="employee-toolbar">
            <div style={{ display: "flex", height: "50px", width: "150px", alignItems: "center", justifyContent: "center", gap: "3px" }}>
              <img src="/favicon.ico" alt="Favicon" style={{ height: "20px", width: "20px", borderRadius: "50%" }} />
              <h1 className="employee-title">Afford Motors</h1>
            </div>
            <center>
              <hr className="employee-bg-line" />
            </center>
            <div className="employee-toolbar-options">
              <button className="employee-toolbar-button employee-icons-container" style={{ borderBottom: "none", marginLeft: "15px" }}>
                <span>
                  <b>
                    <i>{username}</i>
                  </b>
                </span>
              </button>
              <button className="employee-toolbar-button employee-icons-container mt-3">
                <span className="material-icons employee-icons" style={{ fontSize: "20px" }}>
                  directions_bus
                </span>
                <span>Vehicles</span>
              </button>
              <button className="employee-toolbar-button employee-icons-container">
                <img src="/assets/user_dashboard/user_icon.png" alt="usericonimg" className="employee-icons" style={{ height: "22px", width: "22px" }} />
                <span>Profile</span>
              </button>
            </div>
            <div className="employee-toolbar-bottom">
              <center>
                <hr className="employee-bg-line line-below" />
              </center>
              <div className="employee-toolbar-bottom-options">
                <div className="employee-icons-container" style={{ marginBottom: "20px" }}>
                  <span className="material-icons employee-icons" style={{ fontSize: "20px", marginLeft: "3px" }}>
                    logout
                  </span>
                  <span>Logout</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <motion.main
          initial={{
            x: "100%",
            opacity: 0,
          }}
          animate={{
            x: "0%",
            opacity: 1,
          }}
          transition={{
            duration: 0.6,
            ease: [0.43, 0.13, 0.28, 0.96],
          }}
          className="employee-main"
          style={{ width: isMobile ? "100vw" : "85vw" }}
          ref={mainRef}
        >
          <div
            className="menu-button"
            onClick={() => {
              setToolbarShow(!toolbarShow);
            }}
          >
            <span className="material-icons employee-icons" style={{ userSelect: "none" }}>
              menu
            </span>
          </div>
          <div className="heading-div">
            <h1>DashBoard</h1>
            <h2>Hi {username}. Welcome back to Employee Dashboard.</h2>
          </div>

          <ShowPieces cardsArray={cardsArray} />

          <div className="heading-div2">
            <h1>Pending Vehicles List</h1>
          </div>
          <div className="vehicle-heading-buttons">
            <button>Excel</button>
            <button>Print</button>
            <input type="text" id="search" value={searchValue} onChange={(e) => handleSearch(e.target.value)} placeholder="Search by Vehicle Number" />
          </div>

          <VehicleCards username={username} pageno={pageno} searchValue={searchValue} vehiclesArray={vehiclesArray} setSelectedVehicle={setSelectedVehicle} setMakeVehicleVisible={setMakeVehicleVisible} setCancelVehicleVisible={setCancelVehicleVisible} setCancelError={setCancelError} />
          <Pagination pagination={pagination} id={id} username={username} pageNo={pageno} lastPage={pagination[4].value} />
        </motion.main>
      </div>

      <AnimatePresence mode="wait">
        {makeVehicleErrorVisible && (
          <Popup
            errorState={makeVehicleError}
            errorString={"An Error Occurred. Please Try Later."}
            successString={"Marked Vehicle Successfully."}
            closeFunction={() => {
              setMakeVehicleErrorVisible(false);
              if (!makeVehicleError) {
                callAgain();
              }
              setMakeVehicleError(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">{!makeVehicleErrorVisible && makeVehicleVisible ? <VehicleForm setMakeVehicleVisible={setMakeVehicleVisible} setSelectedVehicle={setSelectedVehicle} selectedVehicle={selectedVehicle} username={username} setMakeVehicleErrorVisible={setMakeVehicleErrorVisible} setMakeVehicleError={setMakeVehicleError} /> : null}</AnimatePresence>

      <AnimatePresence mode="wait">
        {cancelVehicleVisible && (
          <Popup
            errorState={cancelError}
            errorString={"An Error Occurred. Please Try Later."}
            successString={"Vehicle Cancelled Successfully."}
            closeFunction={() => {
              setCancelVehicleVisible(false);
              if (!cancelError) {
                callAgain();
              }
              setCancelError(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
