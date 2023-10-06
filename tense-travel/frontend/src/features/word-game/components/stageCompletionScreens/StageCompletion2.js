import React, { useState } from "react";
import "../../common/stageCompletion/completionpage.scss";
// import successImage from "../../../../assets/images/Check Mark.png";
import successImage from "../../../../assets/stageCmpletionImages/check-mark.svg";

function StageCompletion2() {
  const [checkImg, setCheckImg] = useState(false);

  setTimeout(() => {
    setCheckImg(true);
  }, 9000);
  return (
    <>
      <div>
        <div className="score-page">
          <div className="success-image">
            <img src={successImage} alt="successImage" className={checkImg? 'move-up':''} />
          </div>
        </div>
      </div>
    </>
  );
}

export default StageCompletion2;
