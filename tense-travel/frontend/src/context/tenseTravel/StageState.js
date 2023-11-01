import { useState } from "react";
import stageContext from "./StageContext";

const StageState = (props) => {
  const [completeStage, setCompleteStage] = useState(null);
  // const [completeStage, setCompleteStage] = useState({
  //   userId: "6540927574c7bfee81f952aa",
  //   sessionId: "b07d843b-3de5-4313-bf52-d4f388d5103d",
  //   tenseEraId: "650139b8e09d909e795e2527",
  //   stageId: "650139b8e09d909e795e251b",
  // });

  const setStageInfo = (stageInfo) => {
    setCompleteStage(stageInfo);
  };

  return (
    <stageContext.Provider value={{ completeStage, setStageInfo }}>
      {props.children}
    </stageContext.Provider>
  );
};

export default StageState;
