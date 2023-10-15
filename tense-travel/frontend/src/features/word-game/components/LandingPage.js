import React, { useEffect, useState } from "react";
import "../../../sass/styles.scss";
import spaceship from "../../../assets/images/spaceship.svg";
import { useNavigate } from "react-router-dom";
import TourGuideIndex from "../common/TourGuide";

import rocketLeft from "../../../assets/images/rocket-left-panel.svg";
import rocketRight from "../../../assets/images/rocket-right-panel.svg";
import rocketHead from "../../../assets/images/rocket-head.svg";
// import rocketBody from "../../../assets/images/rocket-body-panel.svg";
import rocketBody from "../../../assets/images/rocket-body-with-line.svg";
import dotedRocketHead from "../../../assets/images/doted-rocket-head.svg";
import dotedRocketLeft from "../../../assets/images/doted-rocket-left-panel.svg";
import dotedRocketRight from "../../../assets/images/doted-rocket-right-panel.svg";
// import dotedRocketBody from "../../../assets/images/doted-rocket-body.svg";
import dotedRocketBody from "../../../assets/images/doted-rocket-body-with-line.svg";
import moonHalf from "../../../assets/images/moon-half.png";
import rightLine from "../../../assets/images/line1.svg";
import headLine from "../../../assets/images/line3.svg";
import bodyLine from "../../../assets/images/line2.svg";
import { ProgressBar } from "react-bootstrap";
import { tourGuideSteps } from "../../../utils/constants";

function LandingPage() {
  tourGuideSteps.steps = 1;
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
  const [showTenseBtn, setShowTenseBtn] = useState({
    opacity: 0,
  });

  const [showStartBtn, setShowStartBtn] = useState({
    opacity: 1,
  });

  const [showHalfMoon, setShowShowHalfMoon] = useState("");
  const [showPresentBtn, setShowPresentBtn] = useState("");
  const [firstStepOpacity, setFirstStepOpacity] = useState();
  const [allPartsOpacity, setAllPartsOpacity] = useState();
  // const [, setAllPartsOpacity] = useState();

  const navigateChooseEra = () => {
    setShowStartBtn({
      opacity: 0,
    });
    setTimeout(() => {
      setShowDotted({ display: "block", zIndex: 1 });
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

    setShowShowHalfMoon("active");
  };

  const tourGuideCallback = (params) => {
    if (params["showTenseBtn"] === true) {
      setShowTenseBtn({
        opacity: 0.2,
      });

      setFirstStepOpacity({
        zIndex: 2,
        opacity: 1,
      });

      setAllPartsOpacity({
        opacity: 0.2,
      });
    }

    if (params["showPresentBtn"] === true) {
      console.log("showPresentBtn");
      setShowTenseBtn({});
    }
  };

  const [eraData, setEraData] = useState([]);
  const navigate = useNavigate();

  const getTenseEra = async () => {
    const tenseEraData = await fetch(
      `${process.env.REACT_APP_API_URL}/era/all-eras`
    );

    const tenseEraParsed = await tenseEraData.json();
    setEraData(tenseEraParsed["data"]);
  };

  const handleNavigateStage = (eraId) => {
    tourGuideSteps.steps++;
    navigate(`/choose-stage/${eraId}`);
  };

  useEffect(() => {
    getTenseEra();
  }, []);

  return (
    <div>
      <div className="container">
        {spaceShipBrok && (
          <TourGuideIndex
            step={tourGuideSteps.steps}
            tourGuideCallback={tourGuideCallback}
          />
        )}
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
            style={firstStepOpacity}
          >
            <div className="rocket-head" style={allPartsOpacity}>
              <img src={rocketHead} alt="" style={showFilledRocketImage} />
              <img
                src={dotedRocketHead}
                alt=""
                className="dotted-rocket-head"
                style={showDotted}
              />
              <img
                src={headLine}
                alt=""
                className="rocket-head-line"
                style={showTenseBtn}
              />
              <div className="tense-btn future-tense-btn" style={showTenseBtn}>
                <button className="default-blue-btn">Future</button>
              </div>
            </div>
            <div className="rocket-left" style={allPartsOpacity}>
              <img src={rocketLeft} alt="" style={showFilledRocketImage} />
              <img
                src={dotedRocketLeft}
                alt=""
                className="dotted-rocket-left"
                style={showDotted}
              />
              <div className="tense-btn past-tense-btn" style={showTenseBtn}>
                <button className="default-blue-btn">Past</button>
                <span className="label">
                  {/* <label className="text-wrapper"> */}
                  {/* <ProgressBar now={70}></ProgressBar>; */}
                  <ProgressBar now={20} label={`${20}%`} />
                  {/* </label> */}
                </span>
              </div>
              <img
                src={rightLine}
                alt=""
                className="rocket-right-line"
                style={showTenseBtn}
              />
            </div>

            <div className="rocket-right" style={allPartsOpacity}>
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
              <img
                src={bodyLine}
                alt=""
                className="rocket-body-line"
                style={showTenseBtn}
              />
              <div
                className="tense-btn present-tense-btn"
                style={firstStepOpacity}
              >
                <button
                  className="default-blue-btn"
                  onClick={() => handleNavigateStage(eraData[0]?._id)}
                >
                  {eraData[0]?.title}
                </button>
                <ProgressBar
                  now={40}
                  label={`${40}%`}
                  style={{
                    position: "absolute",
                    width: "98%",
                    bottom: "-20px",
                  }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={navigateChooseEra}
            className="blue-btn"
            style={showStartBtn}
          >
            Start Game
          </button>

          {/* moon section */}
          <div className={`moon-half ${showHalfMoon}`}>
            <img src={moonHalf} alt="" />
          </div>

          {/* tense butto section */}
          <div className="tense-btn-container" style={showTenseBtn}></div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
