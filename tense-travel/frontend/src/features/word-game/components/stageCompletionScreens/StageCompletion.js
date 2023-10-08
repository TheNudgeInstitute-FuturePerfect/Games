import React, { useContext, useEffect, useState } from "react";
// import "../../../css/styles.css";
import "../../common/stageCompletion/completionpage.scss";
import successImage from "../../../../assets/stageCmpletionImages/check-mark.svg";
import heart from "../../../../assets/images/heart.svg";
import starimage from "../../../../assets/stageCmpletionImages/three-stars.svg";
import reloadImage from "../../../../assets/stageCmpletionImages/retry.svg";
import coinImage from "../../../../assets/stageCmpletionImages/confidence-coin.svg";
import speedImage from "../../../../assets/stageCmpletionImages/group.svg";
import emptyStarImage from "../../../../assets/stageCmpletionImages/empty-star.svg";
import stageContext from "../../../../context/tenseTravel/StageContext";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { reTryStagePaylod } from "../../../../utils/payload";
import { reTryStage } from "../../../../services/questionAPI";

function StageCompletion() {
  const [showHeart, setShowHeartVisibility] = useState(false);
  const [showFillStar, setShowFillStarVisibility] = useState(false);
  const [showCoins, setCoinsVisibility] = useState(false);
  const [showContinueSec, setContinueSec] = useState(false);
  const [showEmptyStar, setShowEmptyStarVisibility] = useState(false);
  const [checkImg, setCheckImg] = useState(false);
  const navigate = useNavigate();

  const stageCompleteContext = useContext(stageContext);

  setTimeout(() => {
    setCheckImg(true);
  }, 0);

  useEffect(() => {
    setVisibility(setShowEmptyStarVisibility, true, 1000);
    setVisibility(setShowFillStarVisibility, true, 2000);
    setVisibility(setShowHeartVisibility, true, 3000);
    setVisibility(setCoinsVisibility, true, 4000);
    setVisibility(setContinueSec, true, 5000);
  }, []);

  function setVisibility(functionName, value, timing) {
    // console.log(functionName);
    setTimeout(() => {
      functionName(value);
      // setCheckImg(false);
    }, timing);
  }

  console.log("stageCompleteContext", stageCompleteContext.completeStage);
  const completedStageData = stageCompleteContext.completeStage;

  const handleGame = async (action) => {
    if (
      completedStageData !== null ||
      completedStageData !== "null" ||
      completedStageData !== ""
    )
      switch (action) {
        case "retryStage":
          reTryStagePaylod.userId = completedStageData["userId"];
          reTryStagePaylod.sessionId = completedStageData["sessionId"];
          reTryStagePaylod.tenseEraId = completedStageData["eraId"];
          reTryStagePaylod.stageId = completedStageData["stageId"];
          const reTryStageRes = await reTryStage(reTryStagePaylod);
          console.log("Action", reTryStagePaylod);

          if (reTryStageRes["success"] === true) {
            navigate(
              `/question/${completedStageData["eraId"]}/${completedStageData["stageId"]}`
            );
          }
          return;
        case "otherStage":
          navigate(
            `/choose-stage/${stageCompleteContext.completeStage["eraId"]}`
          );
          return;
        default:
          return;
      }
  };

  //const isStar = false;
  return (
    <div>
      <div className="score-page">
        <div className="success-image" style={{ "--heightt": "8%" }}>
          <img
            src={successImage}
            alt="successImage"
            className={checkImg ? "move-up" : ""}
          />
        </div>

        {showHeart && (
          <div className="heart-section">
            <img
              className="heart-img"
              src={heart}
              align="right"
              alt="heart-img"
            />
            <div className="heart-img-txt">
              <span>2</span>
            </div>
          </div>
        )}
        <div className="completeion-image">
          {/* <img src={successImage} alt="successImage" /> */}
        </div>
        {showEmptyStar && (
          <p>
            Simple Present <br /> Completed!
          </p>
        )}

        {showEmptyStar && (
          <div className="empty-three-star">
            <img src={emptyStarImage} alt="emptyStarImage" />
            <img src={emptyStarImage} alt="emptyStarImage" />
            <img src={emptyStarImage} alt="emptyStarImage" />
          </div>
        )}

        {showFillStar && (
          <div className="three-star">
            <img src={starimage} alt="starimage" />
          </div>
        )}

        {showCoins && (
          <div className="score-section">
            <div className="coins-section">
              <div className="coin-txt">Coin</div>
              <div className="coin-count">
                <div className="coin-logo">
                  <img src={coinImage} alt="coinImage" />
                </div>
                <div className="coinTxt">15</div>
              </div>
            </div>
            <div className="speed-section">
              <div className="speed-txt">Speed</div>
              <div className="speed-count">
                <div className="speed-logo">
                  <img src={speedImage} alt="speedImage" />
                </div>
                <div className="speedTxt">10</div>
              </div>
            </div>
          </div>
        )}
        {showContinueSec && (
          <div className="continue-section">
            <div
              className="reload-sec"
              onClick={() => handleGame("retryStage")}
            >
              <img src={reloadImage} alt="reload" />
            </div>
            <div
              className="continue-sec"
              onClick={() => handleGame("otherStage")}
            >
              <div className="continue-txt">Continue</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StageCompletion;
