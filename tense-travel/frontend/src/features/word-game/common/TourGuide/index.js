import React, { useEffect, useState } from "react";
import "./tourGuide.scss";
import { Button } from "react-bootstrap";
import { stepsFilter } from "../../../../utils/tourGuideConfig";
import { useNavigate } from "react-router-dom";
import { tourGuideSteps, userInfo } from "../../../../utils/constants";
import { userIds } from "../../../../utils/constants";
import {
  updateUserTourStatus,
  userTourStatus,
} from "../../../../services/userAPI";
import { updateUserTourStatusPayload } from "../../../../utils/payload";

let userTourData;
function TourGuideIndex(props) {
  let fadeInTime = 700;
  let fadeOutTime = 200;

  const [fadeInTiming, setFadeInTiming] = useState(".7s");

  let currentStep = Number(props["step"]);
  let currentStepNo =
    sessionStorage.getItem("step") !== null
      ? sessionStorage.getItem("step")
      : 1;

  if (
    currentStep > Number(currentStepNo) ||
    currentStep === Number(currentStepNo)
  ) {
    currentStepNo = currentStep;
    sessionStorage.setItem("step", currentStepNo);
  }

  const [text, setText] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [fade, setFade] = useState("now-whats");
  const [cstep, setCstep] = useState(currentStepNo);
  const [stepsResult, setStepsResult] = useState();
  const [tourGuideContainer, setTourGuideContainer] =
    useState("tourGuideContainer");
  const navigate = useNavigate();
  const [tourStatusData, setTourStatusData] = useState();
  const userDetail = userInfo();
  const [tourCurrentStep, setTourCurrentStep] = useState();

  const handleNowWhats = () => {
    //fade out settimeout
    const fadeOutSetTime = setTimeout(() => {
      // setFade("now-whats fade-out-popup");
      setFade("fade-out-popup");

      if (parseInt(tourGuideSteps.steps) === 7) {
        tourGuideSteps.steps = 7;
        setCstep(tourGuideSteps.steps);
        sessionStorage.setItem("step", tourGuideSteps.steps);
      } else if (parseInt(tourGuideSteps.steps) === 8) {
        tourGuideSteps.steps = 8;
        setCstep(tourGuideSteps.steps);
        sessionStorage.setItem("step", tourGuideSteps.steps);
      } else if (parseInt(tourGuideSteps.steps) === 9) {
        tourGuideSteps.steps = 9;
        setCstep(tourGuideSteps.steps);
        sessionStorage.setItem("step", tourGuideSteps.steps);
      } else {
        setCstep(Number(cstep) + 1);
        sessionStorage.setItem("step", Number(cstep) + 1);
        tourGuideSteps.steps = Number(cstep) + 1;
      }
      clearTimeout(fadeOutSetTime);
    }, fadeOutTime);

    //fade in settimeout
    const fadeInSetTime = setTimeout(() => {
      // setFade("now-whats fade-in-popup");
      setFade("fade-in-popup");
      setFadeInTiming(".7s");

      getSteps(Number(cstep) + 1);

      // fadeOutTime = 10000;
      if (tourGuideSteps.steps === 3) {
        setFadeInTiming("3s");
      }

      clearTimeout(fadeInSetTime);
    }, fadeInTime);

    tourGuideCallback();
  };

  const getSteps = (stp) => {
    if (userTourData["data"]?.tourGuide === false) {
      let stepResult = stepsFilter(stp);

      setStepsResult(stepResult);
      if (stepResult) {
        setText(stepResult["text"]);
        setButtonText(stepResult["buttonText"]);

        if (stepResult["routePath"]) {
          navigate(stepResult["routePath"]);
        }
      }

      if (tourGuideSteps.steps < 9) updateUserTour();
    } else if (userTourData["data"]?.tourGuide === true) {
      sessionStorage.removeItem("step");
    }
  };

  const userTourStaus = async () => {
    let userId = userIds.userId;
    if (userId) {
      userTourData = await userTourStatus(userId);
    } else {
      userId = userDetail["userId"];
      userTourData = await userTourStatus(userId);
    }
    userTourData = await userTourStatus(userId);
    setTourStatusData(userTourData);
    getSteps(Number(currentStepNo));
  };

  useEffect(() => {
    userTourStaus();

    tourGuideSteps.steps = currentStepNo;
  }, []);

  const tourGuideCallback = () => {
    tourGuideSteps.steps = Number(sessionStorage.getItem("step"));

    let res = {};
    props?.tourGuideCallback(res);
    if (cstep === 2) {
      res = { showTenseBtn: true };
      props?.tourGuideCallback(res);
    }

    if (cstep === 3) {
      res = { showTenseBtn: true, showPresentBtn: true };
      props?.tourGuideCallback(res);
    }

    if (tourGuideSteps.steps === 5) {
      res = { showAnswerBox: true };
      props?.tourGuideCallback(res);
      tourGuideSteps.steps++;
    }
  };

  const updateUserTour = async () => {
    updateUserTourStatusPayload.sessionId = userIds.sessionId;
    updateUserTourStatusPayload.userId = userIds.userId;
    updateUserTourStatusPayload.tourGuideStep = tourGuideSteps.steps;
    updateUserTourStatusPayload.tourGuide = false;

    const udpateUserTourData = await updateUserTourStatus(
      updateUserTourStatusPayload
    );
  };

  return (
    <>
      {stepsResult && (
        <div
          // className="align-items-center justify-content-center tourGuideContainer"
          className={`align-items-center justify-content-center ${tourGuideContainer}`}
          style={{ zIndex: 2 }}
        >
          <div style={stepsResult["arrowImg"]?.style}>
            <img src={stepsResult["arrowImg"]?.arrowImg} alt="" />
          </div>
          <div
            className="tourGuideBody"
            style={
              stepsResult["style"] ? stepsResult["style"]?.tourGuideBody : ""
            }
          >
            <div
              // className={show ? "now-whats" : "fade-out-popup now-whats"}
              className={`now-whats ${fade}`}
              // className="now-whats"
              // className={tourGuideSteps.steps===3?"fade active-tense-step":fade}
              // style={{ animation: 'fadeIn 3s' }}
              style={{ "--fadeInTime": fadeInTiming }}
              id={currentStep}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: text ? text : stepsResult["text"],
                }}
              ></span>

              {buttonText && (
                <div className="now-whats-btn">
                  <Button onClick={handleNowWhats}>{buttonText}</Button>
                </div>
              )}
            </div>
            {/* <div>{buttonText}</div> */}
            {/* <div
            className={show1 ? "fade-in-popup lets-go" : "lets-go"}
            id="letsGo"
          >
            We have to go to and collect all the 3 pieces-
            <div className="lets-go-btn">
              <Button>Lets go</Button>
            </div>
          </div> */}
          </div>
          <div style={stepsResult["style"]?.imgStyle}>
            <img
              src={stepsResult["img"]}
              alt=""
              height={stepsResult["imgDimension"]?.height}
              width={stepsResult["imgDimension"]?.width}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default TourGuideIndex;
