import React, { useEffect, useState } from "react";
import "../../../sass/styles.scss";
import { useNavigate } from "react-router-dom";
import TourGuideIndex from "../common/TourGuide";

import rocketLeft from "../../../assets/images/rocket-left-panel.svg";
import rocketRight from "../../../assets/images/rocket-right-panel.svg";
import rocketHead from "../../../assets/images/rocket-head.svg";
import rocketBody from "../../../assets/images/rocket-body-with-line.svg";
import dotedRocketHead from "../../../assets/images/doted-rocket-head.svg";
import dotedRocketLeft from "../../../assets/images/doted-rocket-left-panel.svg";
import dotedRocketRight from "../../../assets/images/doted-rocket-right-panel.svg";
import dotedRocketBody from "../../../assets/images/doted-rocket-body-with-line.svg";
import moonHalf from "../../../assets/images/moon-half.png";
import rightLine from "../../../assets/images/line1.svg";
import headLine from "../../../assets/images/line3.svg";
import bodyLine from "../../../assets/images/line2.svg";
import { tourGuideSteps, userIds } from "../../../utils/constants";
import { userTourStatus } from "../../../services/userAPI";
import { removeTourGuideStep } from "../common/TourGuide/UpdateTourGuideSteps";
import { API_END_POINT } from "../../../utils/endpoints";

let userTourData;
function LandingPage(props) {
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
  const [tourStatusData, setTourStatusData] = useState();
  let userId;
  if(userIds?.userId){
    userId = userIds?.userId;
  }else {
    userId = props['storageData']?.userId;
  }


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

    if (userTourData["data"]?.tourGuide) {
      removeTourGuideStep();
      setTimeout(() => {
        setShowTenseBtn({
          opacity: 1,
        });

        setFirstStepOpacity({
          // zIndex: 2,
          opacity: 1,
        });
      }, 3500);
    }
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
      // console.log("showPresentBtn");
      setShowTenseBtn({});
    }
  };

  const [eraData, setEraData] = useState([]);
  const navigate = useNavigate();

  const getTenseEra = async () => {
    // const tenseEraData = await fetch(
    //   `${process.env.REACT_APP_API_URL}/era/all-eras`
    // );
    const tenseEraData = await fetch(
      `${process.env.REACT_APP_API_URL}/${API_END_POINT.TENSE_ERA_PERCENTAGE}`,
      {
        method: "POST",
        body: JSON.stringify({ userId: userId }),
        headers: { "Content-Type": "application/json" },
      }
    );

    const tenseEraParsed = await tenseEraData.json();
    tenseEraParsed["data"].map((era, item) => {
      if (era["stage"].length > 0) {
        let totalMarks = 0;
        era["stage"].map((stage, indx) => {
          totalMarks = totalMarks + stage["gotStageMarks"];
        });
        era["totalMarks"] = totalMarks;
      }
    });
    setEraData(tenseEraParsed["data"]);
  };

  const handleNavigateStage = (eraId) => {
    tourGuideSteps.steps++;
    navigate(`/choose-stage/${eraId}`);
  };

  const userTourStaus = async () => {
    // const userId = userIds.userId;
    userTourData = await userTourStatus(userId);
    setTourStatusData(userTourData);

    whenUserCompletedTourGuide(userTourData);
  };

  const whenUserCompletedTourGuide = async (userTourData) => {
    if (userTourData["data"]?.tourGuide) {
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

      removeTourGuideStep();
      tourGuideSteps.steps = 0;
      setTimeout(() => {
        setShowTenseBtn({
          opacity: 1,
        });

        setFirstStepOpacity({
          opacity: 1,
        });
      }, 3500);
    }
  };

  useEffect(() => {
    getTenseEra();
    userTourStaus();
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
                <button
                  className="default-blue-btn"
                  onClick={() => handleNavigateStage(eraData[2]?._id)}
                >
                  {eraData[2]?.title}
                </button>
                <div
                  className="progress position-relative"
                  style={{ background: "#9B9EA1", top: "3px" }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    // style={{ width: "10%" }}
                    style={{ width: `${Math.ceil(eraData[2]?.totalMarks)}%` }}
                    aria-valuenow="60"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                  <small className="justify-content-center d-flex position-absolute w-100 progress-bar-font-weight">
                    {`${Math.ceil(eraData[2]?.totalMarks)}%`}
                  </small>
                </div>
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
                <button
                  className="default-blue-btn"
                  onClick={() => handleNavigateStage(eraData[1]?._id)}
                >
                  {eraData[1]?.title}
                </button>
                <div
                  className="progress position-relative"
                  style={{ background: "#9B9EA1", top: "3px" }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    // style={{ width: "10%" }}
                    style={{ width: `${Math.ceil(eraData[1]?.totalMarks)}%` }}
                    aria-valuenow="60"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                  <small className="justify-content-center d-flex position-absolute w-100 progress-bar-font-weight">
                    {`${Math.ceil(eraData[1]?.totalMarks)}%`}
                  </small>
                </div>
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
                <div
                  className="progress position-relative"
                  style={{ background: "#9B9EA1", top: "3px" }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    // style={{ width: "10%" }}
                    style={{ width: `${Math.ceil(eraData[0]?.totalMarks)}%` }}
                    aria-valuenow="60"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                  <small className="justify-content-center d-flex position-absolute w-100 progress-bar-font-weight">
                    {`${Math.ceil(eraData[0]?.totalMarks)}%`}
                  </small>
                </div>
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
