import React, { useState } from "react";
import "../../../sass/styles.scss";
import spaceship from "../../../assets/images/spaceship.svg";
import { useNavigate } from "react-router-dom";
import TourGuideIndex from "../common/TourGuide";

import rocketLeft from "../../../assets/images/rocket-left-panel.svg";
import rocketRight from "../../../assets/images/rocket-right-panel.svg";
import rocketHead from "../../../assets/images/rocket-head.svg";
import rocketBody from "../../../assets/images/rocket-body-panel.svg";
import dotedRocketHead from "../../../assets/images/doted-rocket-head.svg";
import dotedRocketLeft from "../../../assets/images/doted-rocket-left-panel.svg";
import dotedRocketRight from "../../../assets/images/doted-rocket-right-panel.svg";
import dotedRocketBody from "../../../assets/images/doted-rocket-body.svg";
import moonHalf from "../../../assets/images/moon-half.png";

function LandingPage() {
  // const navigate = useNavigate();
  const [show, setShow] = useState({
    display: "block",
  });
  const [spaceShipBrok, setSpaceShipBrok] = useState(false);

  const [isActive, setIsActive] = useState(false);
  const [showDotted, setShowDotted] = useState({});
  const [showFilledRocketImage, setShowFilledRocketImage] = useState({
    opacity: 1,
  });

  const navigateChooseEra = () => {
    setTimeout(() => {
      setShowDotted({ display: "block" });
      setShowFilledRocketImage({
        opacity: 0,
      });
    }, 2000);

    setTimeout(() => {
      setSpaceShipBrok(true);
    }, 5000);

    setShow({
      display: "none",
    });
    setIsActive((current) => !current);
  };

  return (
    <div>
      <div className="container">
        {/* {spaceShipBrok && <TourGuideIndex step={1} style={{ zIndex: 2 }} />} */}
        <div className="first-step">
          <div style={show}>
            <h1>
              <span>Tense Travel:</span>
              <span>Chandrayaan 4</span>
            </h1>
            <p>
              Travel across time and build the <br /> next Chandrayaan!
            </p>
          </div>
          {/* <div className="steper-image-block active"> */}
          <div
            className={
              isActive ? `steper-image-block active` : "steper-image-block"
            }
          >
            <div className="rocket-head">
              <img src={rocketHead} alt="" style={showFilledRocketImage} />
              <img
                src={dotedRocketHead}
                alt=""
                className="dotted-rocket-head"
                style={showDotted}
              />
            </div>
            <div className="rocket-left">
              <img src={rocketLeft} alt="" style={showFilledRocketImage} />
              <img
                src={dotedRocketLeft}
                alt=""
                className="dotted-rocket-left"
                style={showDotted}
              />
            </div>
            <div className="rocket-right">
              <img src={rocketRight} alt="" style={showFilledRocketImage} />
              <img
                src={dotedRocketRight}
                alt=""
                className="dotted-rocket-right"
                style={showDotted}
              />
            </div>
            <div className="rocket-body">
              <img src={rocketBody} alt="" style={showFilledRocketImage} />
              <img
                src={dotedRocketBody}
                alt=""
                className="dotted-rocket-body"
                style={showDotted}
              />
            </div>
          </div>
          <button onClick={navigateChooseEra} className="blue-btn">
            Start Game
          </button>
          <div className="moon-half">
            <img src={moonHalf} alt="" />
          </div>

          <div style={{ position: "absolute" }}>
            <div style={{ left: "31px", position: "relative", top: "-9px" }}>
              <button className="default-blue-btn">Present</button>
            </div>
            <div style={{ position: "relative", top: "322px", right: "27px" }}>
              <button className="default-blue-btn">Past</button>
            </div>
            <div style={{ position: "", top: "493px" }}>
              <button className="default-blue-btn">Future</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
