"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { handleLogin, handleSignup } from "../../api/backend/loginpage";
import { useRouter } from "next/navigation";

export default function Loginform() {
  const spanRef = useRef(null);
  const hasMounted = useRef(false);
  const router = useRouter();
  const signInErrorsRef = useRef({
    signInUsername: "",
    signInPassword: "",
  });

  const signUpErrorsRef = useRef({
    signUpUsername: "",
    signUpPassword: "",
    firstName: "",
    lastName: "",
    city: "",
  });

  const [isSignIn, setIsSignIn] = useState(true);
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [isOverlapping, setIsOverlapping] = useState(false); // Track overlap state
  const cities = ["Jabalpur", "Indore", "Bhopal", "Patna", "Seoni", "Pachmadi"];
  const [signInUsername, setSignInUsername] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [turner, setTurner] = useState(false);

  const validateSignInFormUsername = () => {
    let valid = true;
    let usernameError = "";

    // Check if the username is empty
    if (!signInUsername) {
      usernameError = "Username is required.";
      valid = false;
    }
    // Check if the username contains spaces
    else if (/\s/.test(signInUsername)) {
      usernameError = "Username cannot contain spaces.";
      valid = false;
    }

    // Set the error message for username
    signInErrorsRef.current.signInUsername = usernameError;
    setTurner(!turner);
    return valid;
  };

  const validateSignInFormPassword = () => {
    let valid = true;

    if (signInPassword.length >= 8 && /[a-z]/.test(signInPassword) && /[A-Z]/.test(signInPassword) && /\d/.test(signInPassword) && /[!@#$%^&*(),.?":{}|<>]/.test(signInPassword)) {
      signInErrorsRef.current.signInPassword = "";
    } else {
      signInErrorsRef.current.signInPassword = "Password must be at least 8 characters, with a digit, uppercase, lowercase, and special character.";
      valid = false;
    }
    setTurner(!turner);
    return valid;
  };

  const validateSignUpFirstName = () => {
    let valid = true;
    if (!firstName) {
      signUpErrorsRef.current.firstName = "First-name is required.";
      valid = false;
    } else {
      signUpErrorsRef.current.firstName = "";
    }
    setTurner(!turner);
    return valid;
  };

  const validateSignUpLastName = () => {
    let valid = true;
    if (!lastName) {
      signUpErrorsRef.current.lastName = "Last-name is required.";
      valid = false;
    } else {
      signUpErrorsRef.current.lastName = "";
    }
    setTurner(!turner);
    return valid;
  };

  const validateSignUpFormUsername = () => {
    let valid = true;
    let usernameError = "";

    // Check if the username is empty
    if (!signUpUsername) {
      usernameError = "Username is required.";
      valid = false;
    }
    // Check if the username contains spaces
    else if (/\s/.test(signUpUsername)) {
      usernameError = "Username cannot contain spaces.";
      valid = false;
    }

    // Set the error message for username
    signUpErrorsRef.current.signUpUsername = usernameError;
    setTurner(!turner);
    return valid;
  };

  const validateSignUpFormPassword = () => {
    let valid = true;
    // Check if password meets all required conditions
    if (signUpPassword.length >= 8 && /[a-z]/.test(signUpPassword) && /[A-Z]/.test(signUpPassword) && /\d/.test(signUpPassword) && /[!@#$%^&*(),.?":{}|<>]/.test(signUpPassword)) {
      signUpErrorsRef.current.signUpPassword = ""; // Clear any existing error
    } else {
      signUpErrorsRef.current.signUpPassword = "Password must be at least 8 characters, with a digit, uppercase, lowercase, and special character.";
      valid = false;
    }
    setTurner(!turner);
    return valid;
  };

  const validateSignUpFormCity = () => {
    let valid = true;
    if (!city) {
      signUpErrorsRef.current.city = "City is required.";
      valid = false;
    }
    setTurner(!turner);
    return valid;
  };

  async function SignUpFunction() {
    const firstNameValid = validateSignUpFirstName();
    const lastNameValid = validateSignUpLastName();
    const usernameValid = validateSignUpFormUsername();
    const passwordValid = validateSignUpFormPassword();
    const cityValid = validateSignUpFormCity();

    if (firstNameValid && lastNameValid && usernameValid && passwordValid && cityValid) {
      let response = await handleSignup(firstName, lastName, signUpUsername, signUpPassword, city);

      if (response.token != null) {
        document.cookie = `auth_token=${response.token}; path=/;`;
        /*document.cookie = `id=${response._id.toString()}; path=/;`;
        document.cookie = `username=${response.username}; path=/;`;*/
      }
      if (response.resultCode == 200) {
        if (response.employee === true) {
          router.push(`/loan-recovery/employee-dashboard/${response._id.toString()}?username=${response.username}&pageno=1`);
        }
      } else {
        alert(response.result);
        console.log("The Response code was: " + response.resultCode);
      }
    }
  }

  async function SignInFunction() {
    const usernameValid = validateSignInFormUsername();
    const passwordValid = validateSignInFormPassword();

    if (usernameValid && passwordValid) {
      let response = await handleLogin(signInUsername, signInPassword);

      if (response.token != null) {
        document.cookie = `auth_token=${response.token}; path=/;`;
        /*document.cookie = `id=${response._id.toString()}; path=/;`;
        document.cookie = `username=${response.username}; path=/;`;*/
      }
      if (response.resultCode == 200) {
        if (response.admin === true) {
          router.push(`/loan-recovery/admin-dashboard/${response._id.toString()}?username=${response.username}&pageno=1`);
        }

        if (response.employee === true) {
          router.push(`/loan-recovery/employee-dashboard/${response._id.toString()}?username=${response.username}&pageno=1`);
        }

        if (response.moderator === true) {
          router.push(`/loan-recovery/moderator-dashboard/${response._id.toString()}?username=${response.username}&pageno=1`);
        }
      } else {
        alert(response.result);
        console.log("The Response code was: " + response.resultCode);
      }
    }
  }

  const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  // Function to update ball position based on cursor
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const ballRadius = 50; // Approx radius of the cursor ball
    const spanElement = spanRef.current;
    const spanBox = spanElement.getBoundingClientRect();
    const spanCenterX = spanBox.left + spanBox.width / 2 - left; // Center of the span
    const spanCenterY = spanBox.top + spanBox.height / 2 - top;

    const distance = calculateDistance(x, y, spanCenterX, spanCenterY);

    // Check if the ball overlaps the span
    if (distance < ballRadius) {
      setIsOverlapping(true);
    } else {
      setIsOverlapping(false);
    }

    // Limit the ball movement to the button dimensions
    setBallPosition({
      x: Math.min(width - 20, Math.max(20, x)),
      y: Math.min(height - 20, Math.max(20, y)),
    });
  };

  const handleMouseLeave = () => {
    setIsOverlapping(false); // Reset overlapping state when the mouse leaves
  };
  return (
    <div className="login_page_form_container">
      <div className="login-check">
        <button
          className="login-check-button"
          style={{ borderBottom: isSignIn ? "3px solid #2E2E2E" : "none" }}
          onClick={() => {
            setIsSignIn(true);
          }}
        >
          Sign In
        </button>
        <button
          className="login-check-button"
          style={{ borderBottom: !isSignIn ? "3px solid #2E2E2E" : "none" }}
          onClick={() => {
            setIsSignIn(false);
          }}
        >
          Sign Up
        </button>
      </div>

      {isSignIn ? (
        <form className="login_page_form" style={{ marginTop: "80px" }}>
          <center>
            <h1 className="login_page_h1">Login your Account.</h1>
          </center>
          <h2 className="login_page_h2 mt-3">Since this is your first trip, you'll need to provide us with some imformation before you can check out.</h2>
          <div className="mb-3 mt-4 form-control-wrapper">
            <input
              type="text"
              className="form-control1"
              value={signInUsername}
              onChange={(e) => {
                setSignInUsername(e.target.value);
                validateSignInFormUsername();
              }}
              onKeyUp={() => {
                validateSignInFormUsername();
              }}
              id="username"
              placeholder="Enter username."
              name="username"
            />
            <div className="form-control-line"></div>
            {signInErrorsRef.current.signInUsername && <span className="error-message">{signInErrorsRef.current.signInUsername}</span>}
          </div>

          <div className="mb-3 form-control-wrapper" style={{ position: "relative" }}>
            <input
              type={showSignInPassword ? "text" : "password"}
              className="form-control1"
              value={signInPassword}
              onChange={(e) => {
                setSignInPassword(e.target.value);
              }}
              onKeyUp={() => {
                validateSignInFormPassword();
              }}
              id="pwd"
              placeholder="Enter password."
              name="pwd"
              style={{ paddingRight: "40px" }} // Add space for the icon
            />
            <div
              className="toggle-icon"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: signInErrorsRef.current.signInPassword ? "translateY(-120%)" : "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowSignInPassword(!showSignInPassword)}
            >
              <span className="material-icons">{showSignInPassword ? "lock" : "lock_open"}</span>
            </div>
            <div className="form-control-line"></div>
            {signInErrorsRef.current.signInPassword && <span className="error-message long-messege">{signInErrorsRef.current.signInPassword}</span>}
          </div>

          <button
            type="button"
            onClick={() => {
              SignInFunction();
            }}
            className="mt-4 login_button"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="cursor-ball"
              style={{
                left: `${ballPosition.x}px`,
                top: `${ballPosition.y}px`,
                zIndex: "1",
              }}
            ></div>
            <span ref={spanRef} className="login-button-span" style={{ color: isOverlapping ? "#2E2E2E" : "white" }}>
              Login
            </span>
          </button>
        </form>
      ) : (
        <form className="login_page_form" style={{ marginTop: "30px", marginBottom: "-20px" }}>
          <center>
            <h1 className="login_page_h1">Create an Account.</h1>
          </center>
          <h2 className="login_page_h2 mt-3">Since this is your first trip, you'll need to provide us with some imformation before you can check out.</h2>
          <div className="mb-3 mt-3 inner-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10%" }}>
            <div className="form-control-wrapper">
              <input
                type="text"
                className="form-control1 inner-input"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                onKeyUp={() => {
                  validateSignUpFirstName();
                }}
                id="firstname"
                placeholder="Enter first-name."
                name="firstname"
              />
              <div className="form-control-line inner-line" style={{ width: "100%" }}></div>
              {signUpErrorsRef.current.firstName && <span className="error-message">{signUpErrorsRef.current.firstName}</span>}
            </div>

            <div className="form-control-wrapper">
              <input
                type="text"
                className="form-control1 inner-input"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                onKeyUp={() => {
                  validateSignUpLastName();
                }}
                id="lastname"
                placeholder="Enter last-name."
                name="lastname"
              />
              <div className="form-control-line inner-line" style={{ width: "100%" }}></div>
              {signUpErrorsRef.current.lastName && <span className="error-message">{signUpErrorsRef.current.lastName}</span>}
            </div>
          </div>
          <div className="mb-3 form-control-wrapper">
            <input
              type="text"
              className="form-control1 "
              value={signUpUsername}
              onChange={(e) => {
                setSignUpUsername(e.target.value);
              }}
              onKeyUp={() => {
                validateSignUpFormUsername();
              }}
              id="username"
              placeholder="Enter username."
              name="username"
            />
            <div className="form-control-line" style={{ bottom: "1px" }}></div>
            {signUpErrorsRef.current.signUpUsername && <span className="error-message">{signUpErrorsRef.current.signUpUsername}</span>}
          </div>

          <div className="mb-3 form-control-wrapper" style={{ position: "relative" }}>
            <input
              type={showSignUpPassword ? "text" : "password"}
              className="form-control1"
              value={signUpPassword}
              onChange={(e) => {
                setSignUpPassword(e.target.value);
              }}
              onKeyUp={() => {
                validateSignUpFormPassword();
              }}
              id="pwd"
              placeholder="Enter password."
              name="pwd"
              style={{ paddingRight: "40px" }} // Add space for the icon
            />
            <div
              className="toggle-icon"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: signUpErrorsRef.current.signUpPassword ? "translateY(-120%)" : "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowSignUpPassword(!showSignUpPassword)}
            >
              <span className="material-icons">{showSignUpPassword ? "lock" : "lock_open"}</span>
            </div>
            <div className="form-control-line"></div>
            {signUpErrorsRef.current.signUpPassword && <span className="error-message long-messege">{signUpErrorsRef.current.signUpPassword}</span>}
          </div>

          <div className="mb-3 form-control-wrapper">
            <select
              className={`form-select form-control1 ${signUpErrorsRef.current.city ? "border-danger" : ""}`}
              id="city"
              name="city"
              defaultValue=""
              style={{
                boxShadow: "none",
              }}
              onChange={(e) => {
                const selectedCity = e.target.value;
                setCity(selectedCity);

                // Clear error if a valid city is selected
                if (selectedCity) {
                  signUpErrorsRef.current.city = "";
                }
              }}
              onBlur={() => {
                // Validate city on blur
                validateSignUpFormCity();
              }}
            >
              <option value="" disabled>
                Select a city
              </option>
              {cities.map((city, index) => (
                <option key={index} className="form-control1" value={city}>
                  {city}
                </option>
              ))}
            </select>

            <div className="form-control-line" style={{ bottom: "1px" }}></div>
            {signUpErrorsRef.current.city && <span className="error-message">{signUpErrorsRef.current.city}</span>}
          </div>

          <button
            type="button"
            onClick={() => {
              SignUpFunction();
            }}
            className="mt-4 login_button"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="cursor-ball"
              style={{
                left: `${ballPosition.x}px`,
                top: `${ballPosition.y}px`,
                zIndex: "1",
              }}
            ></div>
            <span ref={spanRef} className="login-button-span" style={{ color: isOverlapping ? "#2E2E2E" : "white" }}>
              Signup
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
