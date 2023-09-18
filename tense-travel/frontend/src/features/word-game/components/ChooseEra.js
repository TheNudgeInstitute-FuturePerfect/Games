import React, { useEffect, useState } from "react";
// import "../../../css/styles.css";
import "../../../sass/styles.scss"
import { useNavigate } from "react-router-dom";

function ChooseEra() {
  const navigate = useNavigate();
  const [eraData, setEraData] = useState([]);

  const navigateStage = (eraId) => {
    navigate(`/choose-stage/${eraId}`);
  };

  const getTenseEra = async () => {
    const tenseEraData = await fetch(
      `${process.env.REACT_APP_API_URL}/era/all-eras`
    );

    const tenseEraParsed = await tenseEraData.json();
    setEraData(tenseEraParsed["data"]);
  };

  useEffect(() => {
    getTenseEra();
  }, []);

  return (
    <>
      <div className="container">
        <div className="second-step">
          {eraData.length > 0 &&
            eraData.map((era, index) => {
              return (
                <button
                  key={index}
                  onClick={() => navigateStage(era._id)}
                  className="default-blue-btn"
                >
                  {era.title}
                </button>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default ChooseEra;
