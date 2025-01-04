"use client";
import "./EmployeeProfile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { editProfile, changePassword } from "../../../api/backend/employee-dashboard";

export default function EmployeeProfile({ employeeData, profileRef, parentRef }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [city, setCity] = useState("");
  const cities = ["Jabalpur", "Indore", "Bhopal", "Patna", "Seoni", "Pachmadi"];

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cityError, setCityError] = useState({ state: false, message: "" });
  const [changePasswordError, setChangePasswordError] = useState({ state: false, message: "" });
  const [passwordError, setPasswordError] = useState({
    currentPassword: { state: false, message: "" },
    newPassword: { state: false, message: "" },
    confirmPassword: { state: false, message: "" },
  });

  /*useEffect(() => {
    setFirstName(employeeData.firstname);
    setLastName(employeeData.lastname);
    setUserName(employeeData.username);
    setCity(employeeData.city);
  }, [employeeData]);*/

  function currentPasswordValidaty(value) {
    setCurrentPassword(value);
    if (value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setPasswordError({ ...passwordError, currentPassword: { state: false, message: "" } });
      return true;
    } else {
      setPasswordError({ ...passwordError, currentPassword: { state: true, message: "Password must be at least 8 characters, with a digit, uppercase, lowercase, and special character." } });
      return false;
    }
  }
  function newPasswordValidaty(value) {
    setNewPassword(value);
    if (value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setPasswordError({ ...passwordError, newPassword: { state: false, message: "" } });
      return true;
    } else {
      setPasswordError({ ...passwordError, newPassword: { state: true, message: "Password must be at least 8 characters, with a digit, uppercase, lowercase, and special character." } });
      return false;
    }
  }
  function confirmPasswordValidity(value) {
    setConfirmPassword(value);
    if (value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setPasswordError({ ...passwordError, confirmPassword: { state: false, message: "" } });
      return true;
    } else {
      setPasswordError({ ...passwordError, confirmPassword: { state: true, message: "Password must be at least 8 characters, with a digit, uppercase, lowercase, and special character." } });
      return false;
    }
  }

  async function handleEditProfile(formData) {
    if (formData.get("city") === "Choose a city.") {
      setCityError({ state: true, message: "Please select a city." });
      return;
    }
    const response = await editProfile(employeeData._id, formData);
    if (!response.success) {
      setCityError({ state: !response.success, message: response.message });
    } else {
      window.location.reload();
    }
  }

  async function handleChangePassword(formData) {
    if (currentPasswordValidaty(currentPassword) && newPasswordValidaty(newPassword) && confirmPasswordValidity(confirmPassword)) {
      if (newPassword !== confirmPassword) {
        setPasswordError({ ...passwordError, confirmPassword: { state: true, message: "Passwords do not match." } });
        return;
      }
      const response = await changePassword(employeeData._id, formData);
      console.log(response);
      if (!response.success) {
        setChangePasswordError({ state: !response.success, message: response.message });
      } else {
        window.location.reload();
      }
    }
  }
  return (
    <>
      <div className="heading-div2">
        <h1>Profile.</h1>
      </div>
      <motion.div ref={profileRef} className="employee-profile-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.2 }} exit={{ opacity: 0 }}>
        <div className="main-profile">
          <motion.div initial={{ left: "-250px" }} animate={{ left: "0px" }} transition={{ duration: 0.7 }} className="slanted-edge"></motion.div>
          <div className="user-img-parent">
            <div className="user-img"></div>
          </div>
          <div className="profile-element">
            <h1>
              {employeeData.firstname.toUpperCase()} {employeeData.lastname.toUpperCase()}
            </h1>
            <p>
              <span>Username: </span>
              {employeeData.username}
            </p>
            <p>
              <span>Role: </span>Employee.
            </p>
            <p>
              <span>City: </span>
              {employeeData.city}
            </p>
          </div>
        </div>
        <div className="options-bar">
          <button data-bs-toggle="modal" data-bs-target="#myModal1">
            Edit Profile
          </button>
          <button data-bs-toggle="modal" data-bs-target="#myModal2">
            Change Password
          </button>
        </div>
        <div className="modal fade" id="myModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title" id="exampleModalLabel">
                  Edit Profile.
                </h1>
                <h3>Make changes to your profile here. Click save when you're done.</h3>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form action={handleEditProfile}>
                  <div className="form-group">
                    <label htmlFor="firstname">First Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstname"
                      name="firstname"
                      placeholder={employeeData.firstname}
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastname">Last Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastname"
                      name="lastname"
                      placeholder={employeeData.lastname}
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      placeholder={employeeData.username}
                      value={userName}
                      onChange={(e) => {
                        setUserName(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city" style={{ marginLeft: "40px" }}>
                      City:
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) => {
                        setCityError({ state: false, message: "" });
                        setCity(e.target.value);
                      }}
                      name="city"
                      required
                    >
                      {cities.map((city, index) => {
                        if (index === 0) {
                          return (
                            <>
                              <option key="-1">Choose a city.</option>
                              <option key={index} value={city}>
                                {city}
                              </option>
                            </>
                          );
                        }
                        return (
                          <option key={index} value={city}>
                            {city}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group">{cityError.state ? <p style={{ color: "#E83E3B" }}>{cityError.message}</p> : null}</div>
                  <div className="form-group">
                    <button type="submit">Save Changes.</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="myModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title" id="exampleModalLabel">
                  Change Password.
                </h1>
                <h3>Make changes to Your Password here. Click save when you're done.</h3>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form action={handleChangePassword}>
                  <div className="form-group">
                    <label htmlFor="password">Current Password:</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="currentpassword"
                      value={currentPassword}
                      onChange={(e) => {
                        currentPasswordValidaty(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    {passwordError.currentPassword.state ? (
                      <center>
                        <p style={{ color: "#E83E3B", textWrap: "wrap" }}>{passwordError.currentPassword.message}</p>
                      </center>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <label htmlFor="newpassword">New Password:</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newpassword"
                      name="newpassword"
                      value={newPassword}
                      onChange={(e) => {
                        newPasswordValidaty(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    {passwordError.newPassword.state ? (
                      <center>
                        <p style={{ color: "#E83E3B", textWrap: "wrap" }}>{passwordError.newPassword.message}</p>
                      </center>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmpassword">Confirm New Password:</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmpassword"
                      name="confirmpassword"
                      value={confirmPassword}
                      onChange={(e) => {
                        confirmPasswordValidity(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    {passwordError.confirmPassword.state ? (
                      <center>
                        <p style={{ color: "#E83E3B", textWrap: "wrap" }}>{passwordError.confirmPassword.message}</p>
                      </center>
                    ) : null}
                  </div>
                  <div className="form-group">{changePasswordError.state ? <p style={{ color: "#E83E3B" }}>{changePasswordError.message}</p> : null}</div>
                  <div className="form-group">
                    <button type="submit">Save Changes.</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
