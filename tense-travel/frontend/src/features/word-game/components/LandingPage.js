import React from "react";
// import "../../../css/styles.css";
import "../../../sass/styles.scss";
import spaceship from "../../../assets/images/spaceship.svg";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const navigateChooseEra = () => {
    navigate("/choose-era");
  };

  return (
    <div>
      <div className="container">
        <div className="first-step">
          <h1>
            <span>Tense Travel:</span>
            <span>Chandrayaan 4</span>
          </h1>
          <p>
            Travel across time and build the <br /> next Chandrayaan!
          </p>
          <div className="image-block">
            <img src={spaceship} alt="spaceship" />
          </div>
          <button onClick={navigateChooseEra} className="blue-btn">
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
