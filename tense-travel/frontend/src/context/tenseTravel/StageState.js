import { useState } from "react";
import stageContext from "./StageContext";

const StageState = (props) => {
  const [completeStage, setCompleteStage] = useState(null);
  const state = {
    name: "name",
  };

  const setStageInfo = (stageInfo)=>{
    setCompleteStage(stageInfo);
  }

  return (
    <stageContext.Provider value={{ completeStage, setStageInfo }}>
      {props.children}
    </stageContext.Provider>
  );
};

export default StageState;
