import { motion } from "framer-motion";
import "./Popup.css";
export default function ShowPieces({ errorState, successString, errorString, closeFunction }) {
  return (
    <>
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
        className="popup"
      >
        <button
          className="close"
          onClick={() => {
            closeFunction();
          }}
        >
          ✖
        </button>
        {errorState ? (
          <>
            <div style={{ backgroundColor: "#e83e3b" }}>
              <img src="/assets/user_dashboard/task-error-icon.png" alt="cookies-img" />
            </div>
            <p>{errorString}</p>
          </>
        ) : (
          <>
            <div>
              <img src="/assets/user_dashboard/task-done-icon.png" alt="cookies-img" />
            </div>
            <p>{successString}</p>
          </>
        )}
      </motion.div>
    </>
  );
}
