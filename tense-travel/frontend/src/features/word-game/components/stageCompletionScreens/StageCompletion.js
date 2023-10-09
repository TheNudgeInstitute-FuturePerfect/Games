import React, { useContext, useEffect, useState } from "react";
import "../../common/stageCompletion/completionpage.scss";
import successImage from "../../../../assets/stageCmpletionImages/check-mark.svg";
import heart from "../../../../assets/images/heart.svg";
import starimage from "../../../../assets/stageCmpletionImages/three-stars.svg";
import reloadImage from "../../../../assets/stageCmpletionImages/retry.svg";
import coinImage from "../../../../assets/stageCmpletionImages/confidence-coin.svg";
import speedImage from "../../../../assets/stageCmpletionImages/group.svg";
import emptyStarImage from "../../../../assets/stageCmpletionImages/empty-star.svg";
import filledStarImage from "../../../../assets/images/filled-star.svg";
import stageContext from "../../../../context/tenseTravel/StageContext";
import { useNavigate } from "react-router-dom";
import { reTryStagePaylod } from "../../../../utils/payload";
import { reTryStage } from "../../../../services/questionAPI";
import { recentCompletedStageScore } from "../../../../services/scoreAPI";

function StageCompletion() {
  const [showHeart, setShowHeartVisibility] = useState(false);
  const [showFillStar, setShowFillStarVisibility] = useState(false);
  const [showCoins, setCoinsVisibility] = useState(false);
  const [showContinueSec, setContinueSec] = useState(false);
  const [showEmptyStar, setShowEmptyStarVisibility] = useState(false);
  const [checkImg, setCheckImg] = useState(false);
  const navigate = useNavigate();
  const [stageData, setStageData] = useState(null);
  const [tenseEraData, setTenseEraData] = useState(null);
  const [error, setError] = useState(null);

  const stageCompleteContext = useContext(stageContext);
  const completedStageData = stageCompleteContext.completeStage;

  setTimeout(() => {
    setCheckImg(true);
  }, 0);

  const recentStageScore = async () => {
    setError(null);
    setTenseEraData(null);
    setStageData(null);

    reTryStagePaylod.userId = completedStageData["userId"];
    reTryStagePaylod.sessionId = completedStageData["sessionId"];
    reTryStagePaylod.stageId = completedStageData["stageId"];
    reTryStagePaylod.tenseEraId = completedStageData["tenseEraId"];

    const scoreData = await recentCompletedStageScore(reTryStagePaylod);

    console.log(completedStageData);

    if (scoreData["success"] === true) {
      setTenseEraData(scoreData["data"][0]["tenseEra"]);
      setStageData(scoreData["data"][0]["tenseEra"][0]["stage"][0]);
    }
    if (scoreData["success"] === false) {
      setError(scoreData);
    }
  };

  useEffect(() => {
    if (
      completedStageData !== null &&
      completedStageData !== "null" &&
      completedStageData !== ""
    ) {
      recentStageScore();
      setVisibility(setShowEmptyStarVisibility, true, 1000);
      setVisibility(setShowFillStarVisibility, true, 2000);
      setVisibility(setShowHeartVisibility, true, 3000);
      setVisibility(setCoinsVisibility, true, 4000);
      setVisibility(setContinueSec, true, 5000);
    } else {
      navigate("/");
    }
  }, []);

  function setVisibility(functionName, value, timing) {
    setTimeout(() => {
      functionName(value);
      // setCheckImg(false);
    }, timing);
  }

  const handleGame = async (action) => {
    if (
      completedStageData !== null &&
      completedStageData !== "null" &&
      completedStageData !== ""
    ) {
      switch (action) {
        case "retryStage":
          const reTryStageRes = await reTryStage(reTryStagePaylod);
          eraseStageContext();

          if (reTryStageRes["success"] === true) {
            navigate(
              `/question/${completedStageData["tenseEraId"]}/${completedStageData["stageId"]}`
            );
          } else {
            navigate("/");
          }
          return;
        case "nextStage":
          eraseStageContext();
          navigate(`/choose-stage/${completedStageData["tenseEraId"]}`);
          return;
        default:
          navigate(`/`);
          return;
      }
    } else {
      navigate(`/`);
    }
  };

  const eraseStageContext = () => {
    stageCompleteContext.setStageInfo(null);
  };

  return (
    <div>
      {error && <div className="score-page">Some thing went wrong</div>}
      {!error && (
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
                <span>{stageData["lives"]}</span>
              </div>
            </div>
          )}
          <div className="completeion-image">
            {/* <img src={successImage} alt="successImage" /> */}
          </div>
          {showEmptyStar && (
            <p>
              {stageData["stageTitle"]} <br /> Completed!
            </p>
          )}

          {showEmptyStar && !showFillStar && (
            <div className="complete-stage-star-block">
              {Array(3)
                .fill("")
                .map((itm, index) => {
                  return (
                    <img
                      key={index}
                      src={emptyStarImage}
                      alt="emptyStarImage"
                    />
                  );
                })}
            </div>
          )}

          {showFillStar && (
            <div className="complete-stage-star-block">
              {Array(stageData["earnStars"])
                .fill("")
                .map((itm, index) => {
                  return (
                    <img
                      key={index}
                      src={filledStarImage}
                      alt="filledStarImage"
                    />
                  );
                })}
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
                  <div className="coinTxt">
                    {stageData["earnGerms"] + stageData["defaultGerms"]}
                  </div>
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
                onClick={() => handleGame("nextStage")}
              >
                <div className="continue-txt">Continue</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StageCompletion;
