import React, { useEffect, useState } from "react";
import "./tourGuide.scss";
import { Button } from "react-bootstrap";
import { stepsFilter } from "../../../../utils/tourGuideConfig";
import { useNavigate } from "react-router-dom";

function TourGuideIndex(props) {
  // let stepsResult = stepsFilter(props["step"]);
  // let stepsResult = ""

  let currentStep = Number(props["step"]);
  const currentStepNo =
    sessionStorage.getItem("step") !== null
      ? sessionStorage.getItem("step")
      : 1;

  const [show, setShow] = useState(true);
  let [show1, setShow1] = useState(false);
  const [text, setText] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [fade, setFade] = useState("now-whats");
  const [cstep, setCstep] = useState(currentStepNo);
  const [stepsResult, setStepsResult] = useState();
  const navigate = useNavigate();

  // setText(stepsResult["text"]);
  // setButtonText(stepsResult["buttonText"]);

  const handleNowWhats = () => {
    let ids = "";
    const handleNowWhats = document.getElementsByClassName("now-whats");
    const letsGo = document.getElementById("letsGo");

    setTimeout(() => {
      setFade("now-whats fade-out-popup");
      setCstep(Number(cstep) + 1);
      sessionStorage.setItem("step", Number(cstep) + 1);
    }, 200);

    setTimeout(() => {
      setFade("now-whats fade-in-popup");

      getSteps(Number(cstep) + 1);

    }, 700);
  };

  const getSteps = (stp) => {
    // console.log(stp)
    let stepResult = stepsFilter(stp);
    console.log("stepsResult", stepResult);
    setStepsResult(stepResult);

    setText(stepResult["text"]);
    setButtonText(stepResult["buttonText"]);

    if (stepResult["routePath"]) {
      navigate(stepResult["routePath"]);
    }
  };

  useEffect(() => {
    const currentStepNo =
      sessionStorage.getItem("step") !== null
        ? sessionStorage.getItem("step")
        : 1;

    // getSteps(Number(props["step"]));
    getSteps(Number(currentStepNo));
  }, []);

  return (
    <>
      {stepsResult && (
        <div
          className="d-flex align-items-center justify-content-center tourGuideContainer"
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
              className={fade}
              id={currentStep}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: text ? text : stepsResult["text"],
                }}
              ></span>

              <div className="now-whats-btn">
                {buttonText && (
                  <Button onClick={handleNowWhats}>{buttonText}</Button>
                )}
              </div>
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
