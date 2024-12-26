"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fetchEmployeeTasks, paginationDetails, cancelTask, MarkVehicleTask, searchTasks, taskOverallDetails } from "../../../api/backend/employee-dashboard";
export default function EmployeeDashboardMain({ id, username, pageno, vehicleData, paginationData, tasksData }) {
  const [toolbarShow, setToolbarShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [makeVehicleVisible, setMakeVehicleVisible] = useState(false);
  const [cancelVehicleVisible, setCancelVehicleVisible] = useState(false);
  const [vehiclesArray, setVehiclesArray] = useState(vehicleData);
  const [pagination, setPagination] = useState(paginationData);
  const [cardsArray, setCardsArray] = useState(tasksData);
  const [searchValue, setSearchValue] = useState("");
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [error, setError] = useState(false);
  const [cancelError, setCancelError] = useState(false);
  const [makeVehicleError, setMakeVehicleError] = useState(false);
  const [makeVehicleErrorVisible, setMakeVehicleErrorVisible] = useState(false);
  const containerRef = useRef(null);
  let cardsCounter = pageno === 1 ? 1 : (pageno - 1) * 12;
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [isRendered, setIsRendered] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    setIsRendered(true);
  }, [vehiclesArray]);

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

  function selectVehicle(vehicle) {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toTimeString().slice(0, 5);
    setSelectedVehicle({ ...vehicle, date: formattedDate, time: formattedTime, username: username });
    setMakeVehicleVisible(true);
  }

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

    console.log("Form is valid, submit data");
    console.log(selectedVehicle);
    console.log(file1);
    console.log(file2);

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

  function findCancelled() {
    if (!cardsArray || !cardsArray[0] || cardsArray[0].heading === 0) {
      console.error("Invalid data: overall tasks heading is missing or zero.");
      return "0%";
    }

    const overallTasks = cardsArray[0].heading;
    const cancelledTasks = cardsArray[1]?.heading || 0;
    const percentage = (cancelledTasks / overallTasks) * 100;

    return `${percentage.toFixed(2)}%`;
  }

  function findRecovered() {
    if (!cardsArray || !cardsArray[0] || cardsArray[0].heading === 0) {
      console.error("Invalid data: overall tasks heading is missing or zero.");
      return "0%";
    }

    const overallTasks = cardsArray[0].heading;
    const completedTasks = cardsArray[2]?.heading || 0;
    const percentage = (completedTasks / overallTasks) * 100;

    return `${percentage.toFixed(2)}%`;
  }

  async function handleVehicleCancel(_id) {
    const cancelresponse = await cancelTask(_id);
    console.log(cancelresponse);
    if (cancelresponse.success) {
      setCancelError(false);
    } else {
      setCancelError(true);
    }
    setCancelVehicleVisible(true);
  }

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

          <div className="employee-main-show-pieces">
            {cardsArray.map((card) => {
              return (
                <div className="employee-main-show-piece mt-4" style={{ marginLeft: "20px", marginRight: "20px" }} key={card.no * Math.random()}>
                  <div className="piece-ball" style={{ backgroundColor: card.color, marginLeft: card.no === 1 ? "-10px" : null }}>
                    <img src={card.img} alt={card.alt} className={card.class} />
                  </div>
                  <div className="show-piece-internal">
                    <h1 className="piece-heading">{card.heading}</h1>
                    <p className="piece-description">{card.description}</p>
                  </div>
                  <div className="show-piece-range">
                    {card.no === 1 ? (
                      <p className="rangefor1">
                        <span className="material-icons" style={{ fontSize: "20px" }}>
                          arrow_downward
                        </span>
                        <span>{card.value}</span>
                      </p>
                    ) : null}
                    {card.no === 2 ? (
                      <div className="range">
                        <motion.div className="range-inside" initial={{ width: 0 }} animate={{ width: findCancelled() }} transition={{ duration: 1, ease: "easeInOut" }} style={{ backgroundColor: card.color }}></motion.div>
                      </div>
                    ) : null}
                    {card.no === 3 ? (
                      <div className="range">
                        <motion.div className="range-inside" initial={{ width: 0 }} animate={{ width: findRecovered() }} transition={{ duration: 1, ease: "easeInOut" }} style={{ backgroundColor: card.color }}></motion.div>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
            ;
          </div>

          <div className="heading-div2">
            <h1>Pending Vehicles List</h1>
          </div>
          <div className="vehicle-heading-buttons">
            <button>Excel</button>
            <button>Print</button>
            <input type="text" id="search" value={searchValue} onChange={(e) => handleSearch(e.target.value)} placeholder="Search by Vehicle Number" />
          </div>

          <div className="overall-cards-container">
            {/* Container that animates only after the component is rendered */}
            <motion.div
              className="cards-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: isRendered ? 1 : 0 }} // Apply animation only if rendered
              transition={{ delay: 0.3, duration: 0.2 }}
              key={pageno + searchValue}
            >
              {vehiclesArray.length > 0 ? (
                vehiclesArray.map((vehicle, index) => {
                  cardsCounter = cardsCounter + 1;
                  return (
                    <div className="card mt-4" key={vehicle._id || index}>
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
          <footer>
            <center>
              <ul className="pagination1 mt-4 mb-4">
                <Link href={`/loan-recovery/employee-dashboard/${id.toString()}?username=${username}&pageno=1`}>
                  <li className="page-item1">
                    <span className="material-icons page-link1">keyboard_double_arrow_left</span>
                  </li>
                </Link>
                {pageno !== 1 ? (
                  <Link href={`/loan-recovery/employee-dashboard/${id.toString()}?username=${username}&pageno=${pageno - 1}`}>
                    <li className="page-item1">
                      <span className="material-icons page-link1">arrow_back</span>
                    </li>
                  </Link>
                ) : null}

                {pagination.map((page) => {
                  return (
                    <Link key={page.index_number} href={`/loan-recovery/employee-dashboard/${id.toString()}?username=${username}&pageno=${page.value}`}>
                      <li className="page-item1" style={{ backgroundColor: page.color, cursor: page.cursor }}>
                        <span className="page-link1">{page.value}</span>
                      </li>
                    </Link>
                  );
                })}
                {pageno !== pagination[4].value ? (
                  <Link href={`/loan-recovery/employee-dashboard/${id.toString()}?username=${username}&pageno=${parseInt(pageno) + 1}`}>
                    <li className="page-item1">
                      <span className="material-icons page-link1">arrow_forward</span>
                    </li>
                  </Link>
                ) : null}
                <Link href={`/loan-recovery/employee-dashboard/${id.toString()}?username=${username}&pageno=${pagination[4].value}`}>
                  <li className="page-item1">
                    <span className="material-icons page-link1">keyboard_double_arrow_right</span>
                  </li>
                </Link>
              </ul>
            </center>
          </footer>
        </motion.main>
      </div>

      <AnimatePresence mode="wait">
        {makeVehicleErrorVisible && (
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
            className="cancel-vehicle-done-window"
          >
            <button
              className="close"
              onClick={() => {
                setMakeVehicleErrorVisible(false);
                if (!makeVehicleError) {
                  callAgain();
                }
                setMakeVehicleError(false);
              }}
            >
              ✖
            </button>
            {makeVehicleError ? (
              <>
                <div style={{ backgroundColor: "#e83e3b" }}>
                  <img src="/assets/user_dashboard/task-error-icon.png" alt="cookies-img" />
                </div>
                <p>An Error Occurred. Please Try Later.</p>
              </>
            ) : (
              <>
                <div>
                  <img src="/assets/user_dashboard/task-done-icon.png" alt="cookies-img" />
                </div>
                <p>Marked Vehicle Successfully.</p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!makeVehicleErrorVisible && makeVehicleVisible ? (
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
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {cancelVehicleVisible ? (
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
            className="cancel-vehicle-done-window"
          >
            <button
              className="close"
              onClick={() => {
                setCancelVehicleVisible(false);
                if (!cancelError) {
                  callAgain();
                }
                setCancelError(false);
              }}
            >
              ✖
            </button>
            {cancelError ? (
              <>
                <div style={{ backgroundColor: "#e83e3b" }}>
                  <img src="/assets/user_dashboard/task-error-icon.png" alt="cookies-img" />
                </div>
                <p>An Error Occured. Please Try Later.</p>
              </>
            ) : (
              <>
                <div>
                  <img src="/assets/user_dashboard/task-done-icon.png" alt="cookies-img" />
                </div>
                <p>Vehicle Cancelled Successfully.</p>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
