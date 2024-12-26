"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { fetchEmployeeTasks, paginationDetails, cancelTask, MarkVehicleTask, searchTasks } from "../../../api/backend/employee-dashboard";
export default function AdminDashboardMain({ id, username, pageno, vehicleData, paginationData }) {
  const [toolbarShow, setToolbarShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [makeVehicleVisible, setMakeVehicleVisible] = useState(false);
  const [cancelVehicleVisible, setCancelVehicleVisible] = useState(false);
  const [vehiclesArray, setVehiclesArray] = useState(vehicleData);
  const [pagination, setPagination] = useState(paginationData);
  const [searchValue, setSearchValue] = useState("");
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [error, setError] = useState(false);
  const [cancelError, setCancelError] = useState(false);
  const [makeVehicleError, setMakeVehicleError] = useState(false);
  const [makeVehicleErrorVisible, setMakeVehicleErrorVisible] = useState(false);
  const containerRef = useRef(null);
  let cardsCounter = 0;
  const [selectedVehicle, setSelectedVehicle] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const vehicleData = await fetchEmployeeTasks(id, pageno);
        const paginationData = await paginationDetails(id, pageno);
        setVehiclesArray(vehicleData);
        setPagination(paginationData);
      } catch (err) {
        console.log("Error fetching employee tasks:", err);
      }
    }

    fetchData();
    console.log(vehiclesArray);
  }, [pageno, id]);

  const cardsArray = [
    { no: 1, heading: 213, description: "Total Tasks", img: "/assets/user_dashboard/tasks_icon.png", alt: "tasksimg", class: "piece1", color: "#fd9a1e" },
    { no: 2, heading: 21, description: "Cancelled Tasks", img: "/assets/user_dashboard/cancel_icon.png", alt: "cancelledimg", class: "piece1", color: "#e83e3b" },
    { no: 3, heading: 57, description: "Completed Tasks", img: "/assets/user_dashboard/recovered_icon.png", alt: "recoveredimg", class: "piece1", color: "#4aa34d" },
  ];

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
    } else {
      setMakeVehicleError(true);
    }

    setMakeVehicleVisible(false);
    setMakeVehicleErrorVisible(true);
  }

  function findcancelled() {
    let result;
    result = (cardsArray[1].heading / 100) * cardsArray[0].heading;
    return result;
  }

  function findrecovered() {
    let result;
    result = (cardsArray[2].heading / 100) * cardsArray[0].heading;
    return result;
  }

  async function handleVehicleCancel(_id) {
    const cancelresponse = await cancelTask(_id);
    console.log(cancelresponse);
    if (cancelresponse.success) {
      setCancelError(false);
      const vehicleData = await fetchEmployeeTasks(id, pageno);
      const paginationData = await paginationDetails(id, pageno);
      setVehiclesArray(vehicleData);
      setPagination(paginationData);
    } else {
      setCancelError(true);
    }
    setCancelVehicleVisible(true);
  }

  async function handleSearch(searchData) {
    setSearchValue(searchData); // Update the search value
    if (searchData === "") {
      // If the search data is empty, fetch all tasks
      const vehicleData = await fetchEmployeeTasks(id, pageno);
      setVehiclesArray(vehicleData);
    } else {
      // Perform search query with normalized (uppercased) search data
      const searchResult = await searchTasks(searchData.toUpperCase());
      setVehiclesArray(searchResult);
    }
  }

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

  return (
    <>
      <div className="admin-page-container" ref={containerRef} style={{ filter: cancelVehicleVisible || makeVehicleVisible ? "brightness(0.4)" : "none" }}>
        {isMobile ? (
          <div className={toolbarShow ? "admin-toolbar-enter admin-toolbar-responsive" : "admin-toolbar-leave admin-toolbar-responsive"}>
            <div style={{ display: "flex", height: "50px", width: "150px", alignItems: "center", justifyContent: "center", gap: "3px" }}>
              <img src="/favicon.ico" alt="Favicon" style={{ height: "20px", width: "20px", borderRadius: "50%" }} />
              <h1 className="admin-title">Afford Motors</h1>
            </div>
            <center>
              <hr className="admin-bg-line" />
            </center>
            <div className="admin-toolbar-options">
              <button className="admin-toolbar-button admin-icons-container" style={{ borderBottom: "none", marginLeft: "15px" }}>
                <span>
                  <b>
                    <i>{username}</i>
                  </b>
                </span>
              </button>
              <button className="admin-toolbar-button admin-icons-container mt-3">
                <span className="material-icons admin-icons" style={{ fontSize: "20px" }}>
                  directions_bus
                </span>
                <span>Vehicles</span>
              </button>
              <button className="admin-toolbar-button admin-icons-container">
                <img src="/assets/user_dashboard/user_icon.png" alt="usericonimg" className="admin-icons" style={{ height: "22px", width: "22px" }} />
                <span>Profile</span>
              </button>
            </div>
            <div className="admin-toolbar-bottom">
              <center>
                <hr className="admin-bg-line line-below" />
              </center>
              <div className="admin-toolbar-bottom-options">
                <div className="admin-icons-container" style={{ marginBottom: "20px" }}>
                  <span className="material-icons admin-icons" style={{ fontSize: "20px", marginLeft: "3px" }}>
                    logout
                  </span>
                  <span>Logout</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="admin-toolbar">
            <div style={{ display: "flex", height: "50px", width: "150px", alignItems: "center", justifyContent: "center", gap: "3px" }}>
              <img src="/favicon.ico" alt="Favicon" style={{ height: "20px", width: "20px", borderRadius: "50%" }} />
              <h1 className="admin-title">Afford Motors</h1>
            </div>
            <center>
              <hr className="admin-bg-line" />
            </center>
            <div className="admin-toolbar-options">
              <button className="admin-toolbar-button admin-icons-container" style={{ borderBottom: "none", marginLeft: "15px" }}>
                <span>
                  <b>
                    <i>{username}</i>
                  </b>
                </span>
              </button>
              <button className="admin-toolbar-button admin-icons-container mt-3">
                <span className="material-icons admin-icons" style={{ fontSize: "20px" }}>
                  directions_bus
                </span>
                <span>Vehicles</span>
              </button>
              <button className="admin-toolbar-button admin-icons-container">
                <img src="/assets/user_dashboard/user_icon.png" alt="usericonimg" className="admin-icons" style={{ height: "22px", width: "22px" }} />
                <span>Profile</span>
              </button>
            </div>
            <div className="admin-toolbar-bottom">
              <center>
                <hr className="admin-bg-line line-below" />
              </center>
              <div className="admin-toolbar-bottom-options">
                <div className="admin-icons-container" style={{ marginBottom: "20px" }}>
                  <span className="material-icons admin-icons" style={{ fontSize: "20px", marginLeft: "3px" }}>
                    logout
                  </span>
                  <span>Logout</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="admin-main">
          <div
            className="menu-button"
            onClick={() => {
              setToolbarShow(!toolbarShow);
            }}
          >
            <span className="material-icons admin-icons" style={{ userSelect: "none" }}>
              menu
            </span>
          </div>
          <div className="heading-div">
            <h1>DashBoard</h1>
            <h2>Hi {username}. Welcome back to Employee Dashboard.</h2>
          </div>

          <div className="admin-main-show-pieces">
            {cardsArray.map((card) => {
              return (
                <div className="admin-main-show-piece mt-4" style={{ marginLeft: "20px", marginRight: "20px" }} key={card.no}>
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
                        <span>decline by 3%</span>
                      </p>
                    ) : null}
                    {card.no === 2 ? (
                      <div className="range">
                        <div className="range-inside" style={{ width: findcancelled(), backgroundColor: card.color }}></div>
                      </div>
                    ) : null}
                    {card.no === 3 ? (
                      <div className="range">
                        <div className="range-inside" style={{ width: findrecovered(), backgroundColor: card.color }}></div>
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
            <input type="text" id="search" value={searchValue} onChange={(e) => handleSearch(e.target.value)} onKeyDown={(e) => handleSearch(e.target.value)} onKeyUp={(e) => handleSearch(e.target.value)} placeholder="Search by Vehicle Number" />
          </div>

          <div className="overall-cards-container">
            <div className="cards-container">
              {vehiclesArray.map((vehicle) => {
                cardsCounter = cardsCounter + 1;

                return (
                  <div className="card mt-4">
                    <div className="card-header1" key={vehicle.registration_no}>
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
              })}
            </div>
          </div>
          <footer>
            <center>
              <ul className="pagination1 mt-4 mb-4">
                <Link href={`/loan-recovery/admin-dashboard/${id.toString()}?username=${username}&pageno=1`}>
                  <li className="page-item1">
                    <span className="material-icons page-link1">keyboard_double_arrow_left</span>
                  </li>
                </Link>
                {pageno !== 1 ? (
                  <Link href={`/loan-recovery/admin-dashboard/${id.toString()}?username=${username}&pageno=${pageno - 1}`}>
                    <li className="page-item1">
                      <span className="material-icons page-link1">arrow_back</span>
                    </li>
                  </Link>
                ) : null}

                {pagination.map((page) => {
                  return (
                    <Link key={page.index_number} href={`/loan-recovery/admin-dashboard/${id.toString()}?username=${username}&pageno=${page.value}`}>
                      <li className="page-item1" style={{ backgroundColor: page.color, cursor: page.cursor }}>
                        <span className="page-link1">{page.value}</span>
                      </li>
                    </Link>
                  );
                })}
                {pageno !== pagination[4].value ? (
                  <Link href={`/loan-recovery/admin-dashboard/${id.toString()}?username=${username}&pageno=${parseInt(pageno) + 1}`}>
                    <li className="page-item1">
                      <span className="material-icons page-link1">arrow_forward</span>
                    </li>
                  </Link>
                ) : null}
                <Link href={`/loan-recovery/admin-dashboard/${id.toString()}?username=${username}&pageno=${pagination[4].value}`}>
                  <li className="page-item1">
                    <span className="material-icons page-link1">keyboard_double_arrow_right</span>
                  </li>
                </Link>
              </ul>
            </center>
          </footer>
        </main>
      </div>

      {makeVehicleErrorVisible ? (
        <div className="cancel-vehicle-done-window" style={{ display: makeVehicleErrorVisible ? "flex" : "none" }}>
          <button
            className="close"
            onClick={() => {
              setMakeVehicleErrorVisible(false);
              setMakeVehicleError(false);
            }}
          >
            ✖
          </button>
          {makeVehicleError && makeVehicleErrorVisible ? (
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
              <p>Marked Vehicle Successfully.</p>
            </>
          )}
        </div>
      ) : (
        <div className="make-vehicle-done-window mt-4" style={{ display: makeVehicleVisible ? "flex" : "none" }}>
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
        </div>
      )}

      <div className="cancel-vehicle-done-window" style={{ display: cancelVehicleVisible ? "flex" : "none" }}>
        <button
          className="close"
          onClick={() => {
            setCancelVehicleVisible(false);
            setCancelError(false);
          }}
        >
          ✖
        </button>
        {cancelError && cancelVehicleVisible ? (
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
      </div>
    </>
  );
}
