import React, { useEffect, useState } from "react";
import "./tourGuide.scss";
import { Button } from "react-bootstrap";
import { stepsFilter } from "../../../../utils/tourGuideConfig";
import { useNavigate } from "react-router-dom";
import { tourGuideSteps } from "../../../../utils/constants";

function TourGuideIndex(props) {
  let fadeInTime = 700;
  let fadeOutTime = 200;

  const [fadeInTiming, setFadeInTiming] = useState(700);

  let currentStep = Number(props["step"]);
  let currentStepNo =
    sessionStorage.getItem("step") !== null
      ? sessionStorage.getItem("step")
      : 1;

  if (currentStep > currentStepNo) {
    currentStepNo = currentStep;
    sessionStorage.setItem("step", currentStepNo);
  }

  const [text, setText] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [fade, setFade] = useState("now-whats");
  const [cstep, setCstep] = useState(currentStepNo);
  const [stepsResult, setStepsResult] = useState();
  const navigate = useNavigate();

  const handleNowWhats = () => {
    setTimeout(() => {
      setFade("now-whats fade-out-popup");
      setCstep(Number(cstep) + 1);
      sessionStorage.setItem("step", Number(cstep) + 1);
      tourGuideSteps.steps = Number(cstep) + 1;
      // if (Number(cstep) + 1 === 3) {
      //   setTimeout(() => {
      //     // fadeInTime = 000;
      //     // console.log("fadeInTime", fadeInTime);
      //     // setFadeInTiming(20000);
      //     // setFade("now-whats fade-in-popup");
      //     setFade("now-whats fade-in-popup");
      //     // console.log("================================================");
      //   }, 5000);
      // }
    }, fadeOutTime);

    setTimeout(() => {
      setFade("now-whats fade-in-popup");

      getSteps(Number(cstep) + 1);
      // console.log("getSteps");
      // fadeOutTime = 10000;
    }, fadeInTime);

    tourGuideCallback();
  };

  const getSteps = (stp) => {
    // console.log(stp)
    let stepResult = stepsFilter(stp);
    // console.log("stepsResult", stepResult);
    setStepsResult(stepResult);

    setText(stepResult["text"]);
    setButtonText(stepResult["buttonText"]);

    if (stepResult["routePath"]) {
      navigate(stepResult["routePath"]);
    }
  };

  useEffect(() => {
    // const currentStepNo =
    //   sessionStorage.getItem("step") !== null
    //     ? sessionStorage.getItem("step")
    //     : 1;

    // getSteps(Number(props["step"]));
      getSteps(Number(currentStepNo));

    tourGuideSteps.steps = currentStepNo;
  }, []);

  const tourGuideCallback = () => {
    console.log(props);
    tourGuideSteps.steps = Number(sessionStorage.getItem("step"));
    console.log("tourGuideSteps.steps", tourGuideSteps.steps, cstep);

    let res = {};
    if (cstep === 2) {
      res = { showTenseBtn: true };
      props?.tourGuideCallback(res);
    }

    if (cstep === 3) {
      res = { showTenseBtn: true, showPresentBtn: true };
      props?.tourGuideCallback(res);
    }

    if (tourGuideSteps.steps === 5) {
      console.log("=====================");
      res = { showAnswerBox: true };
      props?.tourGuideCallback(res);
      tourGuideSteps.steps++;
    }
  };

  return (
    <>
      {stepsResult && (
        <div
          className="align-items-center justify-content-center tourGuideContainer"
          style={{ zIndex: 2 }}
        >
          <div
            className="tourGuideBody"
            style={
              stepsResult["style"] ? stepsResult["style"]?.tourGuideBody : ""
            }
          >
            <div
              // className={show ? "now-whats" : "fade-out-popup now-whats"}
              className={`${fade}`}
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
