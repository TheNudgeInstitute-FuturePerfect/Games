import React, { useEffect, useState } from "react";
// import "../../../css/styles.css";
import "../../../sass/styles.scss";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { getUserCurrentEra } from "../../../utils/payload";
import { userIds } from "../../../utils/constants";

function ChooseStage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState({});
  const [defaultStars, setDefaultStars] = useState(3);

  const navigateQuestion = (params) => {
    navigate(`/question/${eraId}/${params["stageId"]}`);
  };
  let defaultStar = 3;

  const { eraId } = useParams();

  const getStageOfEra = async () => {
    getUserCurrentEra["sessionId"] = userIds.sessionId;
    getUserCurrentEra.userId = userIds.userId;
    getUserCurrentEra.tenseEraId = eraId;

    const tenseStageData = await fetch(
      `${process.env.REACT_APP_API_URL}/userEra/get-user-current-era`,
      {
        method: "POST",
        body: JSON.stringify(getUserCurrentEra),
        headers: { "Content-Type": "application/json" },
      }
    );

    const tenseStageDataParsed = await tenseStageData.json();
    setStage(tenseStageDataParsed["data"]["stage"]);
  };

  useEffect(() => {
    getStageOfEra();
  }, []);

  return (
    <>
      <div className="container">
        <div className="moon-bg">
          <div className="third-step">
            <Link to={"/choose-era"} className="back-arr">
              Change Era
            </Link>
            <ul className="step-list">
              <li className="line1">
                <div className="flex">
                  {/* <div className="image-block"> </div> */}
                  {stage && !stage[3]?.isLocked ? (
                    <div
                      onClick={() => navigateQuestion(stage[3])}
                      className="image-block active"
                    >
                      {" "}
                    </div>
                  ) : (
                    <div className="image-block"> </div>
                  )}
                  <div className="text-block">
                    <strong>{stage && stage[3]?.stageTitle}</strong>
                    <div className="star-block">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </li>
              <li className="line2">
                <div className="flex">
                  <div className="text-block">
                    <strong>
                      {stage && stage[2]?.stageTitle.split(" ")[1]} <br /> Tense
                    </strong>
                    <div className="star-block">
                      {stage &&
                        Array(stage[2]?.earnStars)
                          .fill("")
                          .map((itm, index) => {
                            defaultStar = defaultStar - 1;
                            return <span className="active"></span>;
                          })}
                      {stage &&
                        Array(defaultStar)
                          .fill("")
                          .map((itm, index) => {
                            return <span className=""></span>;
                          })}
                    </div>
                  </div>
                  {/* <div className="image-block"> </div> */}
                  {stage && !stage[2]?.isLocked ? (
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
                  {stage && !stage[1]?.isLocked ? (
                    <div
                      onClick={() => navigateQuestion(stage[1])}
                      className="image-block active"
                    >
                      {" "}
                    </div>
                  ) : (
                    <div className="image-block"> </div>
                  )}
                  {/* <div className="image-block"> </div> */}
                  <div className="text-block">
                    <strong>
                      {stage && stage[1]?.stageTitle.split(" ")[1]} <br />
                      Tense
                    </strong>
                    <div className="star-block">
                      {stage &&
                        Array(stage[1]?.earnStars)
                          .fill("")
                          .map((itm, index) => {
                            defaultStar = defaultStar - 1;
                            return <span className="active"></span>;
                          })}
                      {stage &&
                        Array(defaultStar)
                          .fill("")
                          .map((itm, index) => {
                            return <span className=""></span>;
                          })}
                    </div>
                  </div>
                </div>
              </li>

              <li className="line4">
                <div className="flex">
                  <div className="text-block">
                    <strong>
                      {stage && stage[0]?.stageTitle.split(" ")[1]} <br />
                      Tense
                    </strong>
                    <div className="star-block">
                      {stage &&
                        Array(stage[0]?.earnStars)
                          .fill("")
                          .map((itm, index) => {
                            defaultStar = defaultStar - 1;
                            return <span className="active"></span>;
                          })}
                      {stage &&
                        Array(defaultStar)
                          .fill("")
                          .map((itm, index) => {
                            return <span className=""></span>;
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
