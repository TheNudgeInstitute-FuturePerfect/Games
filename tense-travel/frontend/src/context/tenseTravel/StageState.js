import { useState } from "react";
import stageContext from "./StageContext";

const StageState = (props) => {
  const [completeStage, setCompleteStage] = useState(null);
  // const [completeStage, setCompleteStage] = useState({
  //   userId: "6512d743574d4522062e3f87",
  //   sessionId: "b00aadcb-0d22-4707-910e-e8826d591330",
  //   tenseEraId: "650139b8e09d909e795e2526",
  //   stageId: "650139b8e09d909e795e2515",
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
