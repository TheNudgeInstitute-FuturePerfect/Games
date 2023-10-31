import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { exitGoBackResetStage } from "../../../../services/questionAPI";
import { userInfo } from "../../../../utils/constants";
import { updateUserTourStatus } from "../../../../services/userAPI";

function ExitStageConfirmPopup(props) {
  const [active, setActive] = useState(props?.exitPopup);
  const [remainingQuestions, setRemainingQuestions] = useState(
    props?.remainingQuestions
  );
  const [tenseEraId, setTenseEraId] = useState(props?.tenseEra);
  const navigate = useNavigate();
  const { eraId, stageId } = useParams();
  const storageData = userInfo();

  const handleBtnClick = async (action) => {
    switch (action) {
      case "play":
        setActive(false);
        props.handleExitStage(false);
        return;
      case "exit":
        setActive(false);
        const resetResult = await resetStage();
        navigate(`/choose-stage/${tenseEraId}`);
        return;
      default:
        navigate(`/`);
        return;
    }
  };

  const resetStage = async () => {
    const requestPayload = {
      userId: storageData["userId"],
      tenseEraId: eraId,
      stageId: stageId,
      sessionId: storageData["sessionId"],
    };
    const resetResult = await exitGoBackResetStage(requestPayload);
    await updateUserTour(requestPayload);
    return resetResult;
  };

  const updateUserTour = async (payload) => {
    const requestPayload = {
      userId: payload["userId"],
      sessionId: payload["sessionId"],
      tourGuideStep: 5,
      tourGuide: true,
    };
    await updateUserTourStatus(requestPayload);
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
