import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ExitStageConfirmPopup(props) {
  const [active, setActive] = useState(props?.exitPopup);
  const [remainingQuestions, setRemainingQuestions] = useState(
    props?.remainingQuestions
  );
  const [tenseEraId, setTenseEraId] = useState(props?.tenseEra);
  const navigate = useNavigate();

  const handleBtnClick = (action) => {
    switch (action) {
      case "play":
        setActive(false);
        props.handleExitStage(false);
        return;
      case "exit":
        setActive(false);
        navigate(`/choose-stage/${tenseEraId}`);
        return;
      default:
        navigate(`/`);
        return;
    }
  };

  return (
    <>
      <div
        // className="right-answer-block active confirm-popup-section"
        className={
          active
            ? "right-answer-block active confirm-popup-section"
            : "right-answer-block confirm-popup-section"
        }
        style={{ backgroundColor: "" }}
      >
        <div className="flex">
          <div className="confirm-text-sectoin">
            <p>Just {remainingQuestions} More Answers</p>
            <p>If you exit now, your progress will be lost</p>
          </div>
        </div>
        <div className="confirm-button-section">
          <button className="exit-btn" onClick={() => handleBtnClick("exit")}>
            Exit
          </button>
          <button className="play-btn" onClick={() => handleBtnClick("play")}>
            Play
          </button>
        </div>
      </div>
    </>
  );
}

export default ExitStageConfirmPopup;
