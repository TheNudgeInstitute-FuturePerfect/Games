import React from "react";
import "./popup.scss";
import commingSoonTooltip from "../../../../assets/images/comming-soon-tooltip.svg";

function CommingSoonToolTip() {
  return (
    <>
      <div className="comming-soon">
        <span className="text-wrapper">Comming soon!</span>
        <img
          src={commingSoonTooltip}
          alt=""
          style={{ width: "187px", height: "46.533px" }}
        />
      </div>
    </>
  );
}

export default CommingSoonToolTip;
