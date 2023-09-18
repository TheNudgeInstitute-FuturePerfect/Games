import React, { useEffect, useState } from "react";
// import "../../../css/styles.css";
import "../../../sass/styles.scss";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { getUserCurrentEra } from "../../../utils/payload";

function ChooseStage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState({});

  const navigateQuestion = (params) => {
    navigate(`/question/${eraId}/${params["stageId"]}`);
  };

  const { eraId } = useParams();

  const getStageOfEra = async () => {
    console.log('getStageOfEra');
    getUserCurrentEra["sessionId"] = "7694ffb1-09c8-48da-b7d1-819c79c4891c";
    getUserCurrentEra.userId = "64f583fe0de4f60ae6e05cc5";
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
                  <div className="image-block"> </div>
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
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="image-block"> </div>
                </div>
              </li>
              <li className="line3">
                <div className="flex">
                  <div className="image-block"> </div>
                  <div className="text-block">
                    <strong>
                      {stage && stage[1]?.stageTitle.split(" ")[1]} <br />
                      Tense
                    </strong>
                    <div className="star-block">
                      <span></span>
                      <span></span>
                      <span></span>
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
                      <span className="active"></span>
                      <span className="active"></span>
                      <span></span>
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
