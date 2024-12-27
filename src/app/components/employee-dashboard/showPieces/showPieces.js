import { motion } from "framer-motion";
import "./showPieces.css";
export default function ShowPieces({ cardsArray }) {
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

  return (
    <div className="employee-main-show-pieces">
      {cardsArray.map((card) => {
        return (
          <div className="employee-main-show-piece mt-4" key={card.no * Math.random()}>
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
  );
}
