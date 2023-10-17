import { tourGuideSteps } from "../../../../utils/constants";

const updateTourGuideStep = (step) => {
  sessionStorage.setItem("step", step);
};

const showTourGuidePopup = (show = false) => {
  tourGuideSteps.show = show;
};

export { updateTourGuideStep, showTourGuidePopup };
