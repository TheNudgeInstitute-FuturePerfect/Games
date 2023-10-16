const updateTourGuideStep = (step) => {
  sessionStorage.setItem("step", step);
};

const showTourGuidePopup = (show = false) => {
  return show;
};

export { updateTourGuideStep, showTourGuidePopup };
