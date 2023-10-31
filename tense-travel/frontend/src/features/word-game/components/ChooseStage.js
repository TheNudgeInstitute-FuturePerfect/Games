import React, { useEffect, useState } from "react";
import "../../../sass/styles.scss";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { getUserCurrentEra } from "../../../utils/payload";
import { userIds, userInfo } from "../../../utils/constants";
import { coins } from "../../../utils/constants";
import TourGuideIndex from "../common/TourGuide";
import { tourGuideSteps } from "../../../utils/constants";
import { updateTourGuideStep } from "../common/TourGuide/UpdateTourGuideSteps";
import CommingSoonToolTip from "../common/popups/CommingSoonToolTip";
import { API_END_POINT } from "../../../utils/endpoints";
import { getStorage } from "../../../utils/manageStorage";

function ChooseStage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState([]);
  const [showSimpleTense, setShowSimpleTense] = useState();
  const sessionMobile = getStorage()["mobile"];
  const userDetail = userInfo();

  const navigateQuestion = (params) => {
    tourGuideSteps.steps++;
    navigate(`/question/${eraId}/${params["stageId"]}`);
  };
  let defaultStar = coins.defaultStars.stars;

  const { eraId } = useParams();

  const getStageOfEra = async () => {
    getUserCurrentEra["sessionId"] = "";
    getUserCurrentEra.userId = "";
    getUserCurrentEra.tenseEraId = "";
    // getUserCurrentEra["sessionId"] = userIds.sessionId;
    delete getUserCurrentEra["sessionId"];
    getUserCurrentEra.userId = userDetail["userId"];
    getUserCurrentEra.tenseEraId = eraId;

    const tenseStageData = await fetch(
      // `${process.env.REACT_APP_API_URL}/userEra/get-user-current-era`,
      `${process.env.REACT_APP_API_URL}/${API_END_POINT.HIGHEST_STARS_STAGE_OF_ERA}`,
      {
        method: "POST",
        body: JSON.stringify(getUserCurrentEra),
        headers: { "Content-Type": "application/json" },
      }
    );

    const tenseStageDataParsed = await tenseStageData.json();
    setStage(tenseStageDataParsed["data"]["stage"]);

    if (
      sessionStorage.getItem("step") &&
      parseInt(sessionStorage.getItem("step")) === 4
    ) {
      console.log('---------------------')
      setShowSimpleTense({
        position: "relative",
        zIndex: 2,
      });
    }
  };

  useEffect(() => {
    getStageOfEra();
  }, []);

  const tourGuideCallback = (params) => {
    // console.log("params", params);
  };

  return (
    <>
      <div className="container">
        <TourGuideIndex
          step={tourGuideSteps.steps}
          tourGuideCallback={tourGuideCallback}
        />
        <div className="moon-bg">
          <div className="third-step">
            <Link to={"/?mobile=" + sessionMobile} className="back-arr">
              Change Era
            </Link>
            <ul className="step-list">
              <li className="line1">
                <CommingSoonToolTip />
                <div className="flex">
                  {/* <div className="image-block"> </div> */}
                  {stage.length > 0 && !stage[3]?.isLocked ? (
                    <div
                      // onClick={() => navigateQuestion(stage[3])}
                      className="image-block"
                    >
                      {" "}
                    </div>
                  ) : (
                    <div className="image-block"></div>
                  )}
                  <div className="text-block">
                    <strong>{stage.length > 0 && stage[3]?.stageTitle}</strong>
                    <div className="star-block">
                      {stage.length > 0 &&
                        Array(stage[3]?.earnStars)
                          .fill("")
                          .map((itm, index) => {
                            defaultStar = coins.defaultStars.stars;
                            defaultStar = defaultStar - (index + 1);
                            return <span key={index} className=""></span>;
                          })}
                      {stage.length > 0 &&
                        Array(coins.defaultStars.stars)
                          .fill("")
                          .map((itm, index) => {
                            defaultStar = coins.defaultStars.stars;
                            return <span key={index} className=""></span>;
                          })}
                    </div>
                  </div>
                </div>
              </li>

              <li className="line2">
                <div className="flex">
                  <div className="text-block">
                    <strong>
                      {stage.length > 0 && stage[2]?.stageTitle.split(" ")[1]}{" "}
                      <br /> Tense
                    </strong>
                    <div className="star-block">
                      {stage.length > 0 &&
                        Array(stage[2]?.earnStars)
                          .fill("")
                          .map((itm, index) => {
                            defaultStar = coins.defaultStars.stars;
                            defaultStar = defaultStar - (index + 1);
                            return <span key={index} className="active"></span>;
                          })}
                      {stage.length > 0 &&
                        Array(defaultStar)
                          .fill("")
                          .map((itm, index) => {
                            defaultStar = coins.defaultStars.stars;
                            return <span key={index} className=""></span>;
                          })}
                    </div>
                  </div>
                  {stage.length > 0 && !stage[2]?.isLocked ? (
                    <div
                      onClick={() => navigateQuestion(stage[2])}
                      className="image-block active"
                    >
                      {" "}
                    </div>
                  ) : (
                    <div className="image-block"> </div>
                  )}
                </div>
              </li>

              <li className="line3">
                <div className="flex">
                  {stage.length > 0 && !stage[1]?.isLocked ? (
                    <div
                      onClick={() => navigateQuestion(stage[1])}
                      className="image-block active"
                    >
                      {" "}
                    </div>
                  ) : (
                    <div className="image-block"> </div>
                  )}
                  <div className="text-block">
                    <strong>
                      {stage.length > 0 && stage[1]?.stageTitle.split(" ")[1]}{" "}
                      <br />
                      Tense
                    </strong>
                    <div className="star-block">
                      {stage.length > 0 &&
                        Array(stage[1]?.earnStars)
                          .fill("")
                          .map((itm, index) => {
                            defaultStar = coins.defaultStars.stars;
                            defaultStar = defaultStar - (index + 1);
                            return <span key={index} className="active"></span>;
                          })}
                      {stage.length > 0 &&
                        Array(defaultStar)
                          .fill("")
                          .map((itm, index) => {
                            defaultStar = coins.defaultStars.stars;
                            return <span key={index} className=""></span>;
                          })}
                    </div>
                  </div>
                </div>
              </li>

              <li className="line4" style={showSimpleTense}>
                <div className="flex">
                  <div className="text-block">
                    <strong>
                      {stage.length > 0 && stage[0]?.stageTitle.split(" ")[1]}{" "}
                      <br />
                      Tense
                    </strong>
                    <div className="star-block">
                      {stage.length > 0 &&
                        Array(stage[0]["earnStars"])
                          .fill("")
                          .map((itm, index) => {
                            defaultStar = coins.defaultStars.stars;
                            defaultStar = defaultStar - (index + 1);
                            return <span key={index} className="active"></span>;
                          })}
                      {stage.length > 0 &&
                        Array(defaultStar)
                          .fill("")
                          .map((star, i) => {
                            defaultStar = coins.defaultStars.stars;
                            return <span key={i} className=""></span>;
                          })}
                    </div>
                  </div>
                  <div
                    onClick={() => navigateQuestion(stage[0])}
                    className="image-block active"
                  >
                    {" "}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChooseStage;
