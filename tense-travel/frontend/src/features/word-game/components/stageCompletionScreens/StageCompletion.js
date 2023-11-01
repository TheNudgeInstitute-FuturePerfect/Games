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
import {
  reTryStagePaylod,
  updateUserTourStatusPayload,
} from "../../../../utils/payload";
import { reTryStage } from "../../../../services/questionAPI";
import { recentCompletedStageScore } from "../../../../services/scoreAPI";
import { coins, tourGuideSteps } from "../../../../utils/constants";
import celebrateGiphy from "../../../../assets/images/celebrate.gif";
import {
  updateUserTourStatus,
  userTourStatus,
} from "../../../../services/userAPI";
import { removeTourGuideStep } from "../../common/TourGuide/UpdateTourGuideSteps";

let heartCount = 0;
let defaultCoins = 0;
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
  const [moveHeart, setMoveHeart] = useState(false);
  const [hearts, setHearts] = useState(0);
  let [totalEarnGerms, setTotalEarnGerms] = useState(0);
  let defaultStar = coins.defaultStars;
  let scoreData = null;
  const [heartCounter, setHeartCounter] = useState(0);

  const stageCompleteContext = useContext(stageContext);
  const completedStageData = stageCompleteContext.completeStage;
  let celebrateGif = null;
  let userTourData;
  let isLivePurchased = false;

  setTimeout(() => {
    // setCheckImg(true);
  }, 0);

  const recentStageScore = async () => {
    setError(null);
    setTenseEraData(null);
    setStageData(null);

    reTryStagePaylod.userId = completedStageData["userId"];
    reTryStagePaylod.sessionId = completedStageData["sessionId"];
    reTryStagePaylod.stageId = completedStageData["stageId"];
    reTryStagePaylod.tenseEraId = completedStageData["tenseEraId"];

    scoreData = await recentCompletedStageScore(reTryStagePaylod);

    if (scoreData["success"] === true) {
      setTenseEraData(scoreData["data"][0]["tenseEra"]);
      setStageData(scoreData["data"][0]["tenseEra"][0]["stage"][0]);
      heartCount = scoreData["data"][0]["tenseEra"][0]["stage"][0]["lives"];
      isLivePurchased =
        scoreData["data"][0]["tenseEra"][0]["stage"][0]?.isLivePurchased;
      setHearts(heartCount);
      setHeartCounter(heartCount);
      setTotalEarnGerms(
        scoreData["data"][0]["tenseEra"][0]["stage"][0]["defaultGerms"]
      );
      defaultCoins =
        scoreData["data"][0]["tenseEra"][0]["stage"][0]["defaultGerms"];
      setCheckImg(true);

      setVisibility(setShowEmptyStarVisibility, true, 1400);
      setVisibility(setShowFillStarVisibility, true, 2000);
      setVisibility(setShowHeartVisibility, true, 3000);
      setVisibility(setCoinsVisibility, true, 4000);
      setVisibility(setContinueSec, true, 5000);

      celebrateGif = document.getElementById("celebrateGif");
      setTimeout(() => {
        celebrateGif.style.display = "block";
      }, 1000);
    }
    if (scoreData["success"] === false) {
      setError(scoreData);
    }
  };

  /* heart move animation */
  const animateHeart = () => {
    let heartAnimMove = document.getElementById("heartAnimMove");
    let heartAnimStatic = document.getElementById("heartAnimStatic");
    let heartTxtAnimMove = document.getElementById("heartTxtAnimMove");

    let top = 34;
    let right = 16;

    // const animateHeartInterval = setInterval(frame, 0.5);
    const animateHeartInterval = setInterval(0.5);
    const animateHeartInterval1 = setInterval(() => {
      if (heartCount > 0) {
        if (heartCount > 0 && !isLivePurchased) {
          heartCount--;
          setHeartCounter(heartCount);
          defaultCoins = defaultCoins + 5;
          setTotalEarnGerms(defaultCoins);
        }
      }
      if (heartCount === 0) clearInterval(animateHeartInterval1);
    }, 1000);

    // if (heartCount === 0) {
    //   clearInterval(animateHeartInterval);
    // }

    function frame() {
      if (heartCount === 0) {
        clearInterval(animateHeartInterval);
        heartAnimMove.style.display = "none";
        heartTxtAnimMove.style.display = "none";
      } else {
        if (top < 470) {
          top++;
          heartAnimMove.style.top = top + "px";

          heartTxtAnimMove.style.top = top + "px";
        }
        if (right < 190) {
          right = right + 0.395;
          heartAnimMove.style.right = right + "px";
          heartTxtAnimMove.style.right = right + 27 + "px";
        }
        if (top === 470 && Math.ceil(right) === 190) {
          heartCount--;
          top = 34;
          right = 16;
          setHearts(heartCount);
          defaultCoins = defaultCoins + 5;
          setTotalEarnGerms(defaultCoins);
        }
      }
    }
  };
  /* heart move animation end */

  const userTourStaus = async () => {
    userTourData = await userTourStatus(completedStageData["userId"]);
    if (!userTourData["data"]?.tourGuide) {
      updateUserTourStatusPayload.sessionId = completedStageData["sessionId"];
      updateUserTourStatusPayload.userId = completedStageData["userId"];
      updateUserTourStatusPayload.tourGuideStep = tourGuideSteps.steps;
      updateUserTourStatusPayload.tourGuide = true;

      await updateUserTourStatus(updateUserTourStatusPayload);
      tourGuideSteps.steps = 0;
      tourGuideSteps.show = false;
      removeTourGuideStep("step");
    }
  };

  useEffect(() => {
    if (
      completedStageData !== null &&
      completedStageData !== "null" &&
      completedStageData !== ""
    ) {
      recentStageScore();
    } else {
      navigate("/");
    }
    userTourStaus();
  }, []);

  function setVisibility(functionName, value, timing) {
    setTimeout(() => {
      functionName(value);
      if (timing === 5000) {
        setMoveHeart(true);
        animateHeart();
        celebrateGif.style.display = "none";
      } else setMoveHeart(false);
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
          <img
            id="celebrateGif"
            src={celebrateGiphy}
            alt=""
            className="celebrate-gif"
          />

          {showHeart && stageData["isLivePurchased"] === false && (
            <div className="heart-section">
              <div className="heart-img-txt" style={{ "--coinCount": hearts }}>
                <img
                  // className="heart-img"
                  src={heart}
                  align="right"
                  alt="heart-img"
                  id="heartAnimMove"
                />
                <span
                  className=""
                  id="heartTxtAnimMove"
                  // style={{ "--coinCount": hearts }}
                >
                  {heartCounter}
                </span>
              </div>

              <img
                className="heart-img-fixed"
                src={heart}
                align="right"
                alt="heart-img"
                id="heartAnimStatic"
              />
              <div className="heart-img-fixed-txt">
                <span>{heartCounter}</span>
              </div>
            </div>
          )}
          <div className="completeion-image">
            {/* <img src={successImage} alt="successImage" /> */}
          </div>
          {showEmptyStar && (
            <p>
              {stageData["stageTitle"].charAt(0).toUpperCase() +
                stageData["stageTitle"].slice(1)}{" "}
              <br /> Completed!
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
                  defaultStar = coins.defaultStars.stars;
                  defaultStar = defaultStar - (index + 1);
                  return (
                    <img
                      key={index}
                      src={filledStarImage}
                      alt="filledStarImage"
                    />
                  );
                })}
              {Array(defaultStar)
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

          {showCoins && (
            <div className="score-section">
              <div className="coins-section">
                <div className="coin-txt">Coins</div>
                <div className="coin-count">
                  <div className="coin-logo">
                    <img src={coinImage} alt="coinImage" />
                  </div>
                  <div className="coinTxt">{totalEarnGerms}</div>
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
