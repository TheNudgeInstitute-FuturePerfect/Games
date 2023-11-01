import smileyEmoji from "../assets/images/smiley-emoji.svg";
import astronaut from "../assets/images/astronaut-what-now.png";
import astronautOhNo from "../assets/images/astrotnaut-oh-no.svg";
import astronautThink from "../assets/images/astronaut-think.png";
import astronautOk from "../assets/images/astronaut-ok.png";
import astronautGreatJob from "../assets/images/astronaut-great-job.png";
import wordPopupUpArrow from "../assets/images/word-popup-up-arrow.svg";
import answerBoxPopupUpArrow from "../assets/images/answer-box-popup-up-arrow .svg";
import greatJobPopupUpArrow from "../assets/images/great-job-popup-up-arrow.svg";

const stepsJson = [
  {
    step: 1,
    text: `Oh no!! The Chandrayaan broke down
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="23"
      viewBox="0 0 26 23"
      fill="none"
    >
      <path
        d="M13.2079 23C19.9873 23 25.4832 17.8513 25.4832 11.5C25.4832 5.14873 19.9873 0 13.2079 0C6.42845 0 0.932617 5.14873 0.932617 11.5C0.932617 17.8513 6.42845 23 13.2079 23Z"
        fill="#FFDD67"
      />
      <path
        d="M8.5023 11.1165C9.63221 11.1165 10.5482 10.2584 10.5482 9.19987C10.5482 8.14132 9.63221 7.2832 8.5023 7.2832C7.37239 7.2832 6.45642 8.14132 6.45642 9.19987C6.45642 10.2584 7.37239 11.1165 8.5023 11.1165Z"
        fill="#664E27"
      />
      <path
        d="M17.9134 11.1165C19.0433 11.1165 19.9593 10.2584 19.9593 9.19987C19.9593 8.14132 19.0433 7.2832 17.9134 7.2832C16.7835 7.2832 15.8676 8.14132 15.8676 9.19987C15.8676 10.2584 16.7835 11.1165 17.9134 11.1165Z"
        fill="#664E27"
      />
      <path
        d="M18.8135 16.1C18.1997 14.72 16.7267 13.8 13.2078 13.8C9.68888 13.8 8.21585 14.72 7.60209 16.1C7.27474 16.8284 7.72484 17.6334 7.72484 17.6334C7.88851 18.0934 8.62503 18.4 13.2078 18.4C17.7497 18.4 18.4862 18.0934 18.6908 17.6334C18.6908 17.6334 19.1409 16.8284 18.8135 16.1Z"
        fill="#664E27"
      />
      <path
        d="M17.2996 15.7167C17.3405 15.6017 17.2996 15.4867 17.2178 15.41C17.2178 15.41 16.3176 14.5667 13.2078 14.5667C10.139 14.5667 9.19792 15.41 9.19792 15.41C9.11609 15.4483 9.11609 15.6017 9.11609 15.7167L9.19792 15.9466C9.23884 16.0616 9.32068 16.1383 9.44343 16.1383H16.9723C17.0541 16.1383 17.1769 16.0616 17.2178 15.9466L17.2996 15.7167Z"
        fill="white"
      />
    </svg> <br /><br />
   3 pieces of the rocket went to 3 dimensions - past, present, and
    future`,
    img: astronautOhNo,
    imgDimension: {
      height: "281px",
      width: "234px",
    },
    style: {
      imgStyle: { position: "absolute", bottom: 0, right: "0px" },
      // "z-index": 2,
    },
    buttonText: "Now whats?",
    routePath: "",
    screenName: "",
  },
  {
    step: 2,
    text: `We have to go and collect all the 3 pieces-`,
    img: astronautThink,
    imgDimension: {
      height: "281px",
      width: "234px",
    },
    style: {
      imgStyle: { position: "absolute", bottom: 0, right: "0px" },
      // "z-index": 2,
    },
    buttonText: "Ok, lets go",
    routePath: "",
    screenName: "",
  },
  {
    step: 3,
    text: `Let’s start with present for now.`,
    img: astronaut,
    imgDimension: {
      height: "281px",
      width: "234px",
    },
    style: {
      imgStyle: { position: "absolute", bottom: 0, right: "0px" },
      tourGuideBody: {
        position: "relative",
        width: "calc(100% - 177px)",
        flexShrink: "0",
        left: "70px",
        // right: "50px",
        background: "#000",
        color: "#FFF",
        textAlign: "center",
        fontFamily: "Schoolbell",
        fontSize: "24px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        marginTop: "15px",
      },
    },
    buttonText: "",
    // routePath: "/choose-era",
    routePath: "",
    screenName: "choose-era",
  },
  {
    step: 4,
    text: `And let’s try Simple Tense`,
    img: astronaut,
    imgDimension: {
      height: "281px",
      width: "234px",
    },
    style: {
      imgStyle: { position: "absolute", bottom: 0, right: "0px" },
      tourGuideBody: {
        position: "relative",
        width: "calc(100% - 94px)",
        flexShrink: "0",
        left: "20px",
        background: "#000",
        color: "#FFF",
        textAlign: "center",
        fontFamily: "Schoolbell",
        fontSize: "24px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        top: "87px",
      },
    },
    buttonText: "",
    // routePath: "/choose-era",
    routePath: "",
    screenName: "",
  },
  {
    step: 5,
    text: `Fill in the blanks with the given word. Remember to follow the tense rules when you answer!`,
    img: astronautOk,
    imgDimension: {
      width: " 281px",
    },
    style: {
      imgStyle: { position: "absolute", bottom: "0px", right: "", left: "0px" },
      tourGuideBody: {
        position: "relative",
        width: "86%",
        flexShrink: "0",
        left: "20px",
        background: "#000",
        color: "#FFF",
        textAlign: "center",
        fontFamily: "Schoolbell",
        fontSize: "24px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        bottom: "116px",
      },
    },
    buttonText: "Ok",
    routePath: "",
    screenName: "",
    arrowImg: {
      arrowImg: wordPopupUpArrow,
      style: {
        position: "absolute",
        top: "16%",
        right: "16%",
      },
    },
  },
  {
    step: 6,
    text: `Click here to type your answer!`,
    img: astronaut,
    imgDimension: {
      height: "281px",
      width: "234px",
    },
    style: {
      imgStyle: { position: "absolute", bottom: 0, right: "0px" },
      tourGuideBody: {
        position: "relative",
        width: "calc(100% - 117px)",
        flexShrink: "0",
        left: "20px",
        background: "#000",
        color: "#FFF",
        textAlign: "center",
        fontFamily: "Schoolbell",
        fontSize: "24px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        bottom: "0px",
        top: "-50px",
      },
    },
    buttonText: "",
    // routePath: "/choose-era",
    routePath: "",
    screenName: "",
    arrowImg: {
      arrowImg: answerBoxPopupUpArrow,
      style: {
        position: "absolute",
        top: "33.5%",
        right: "48%",
      },
    },
  },
  {
    step: 7,
    text: `Great job! Answer 10 questions to finish this level!`,
    img: astronautGreatJob,
    imgDimension: {
      width: "100%",
      height: "100%",
    },
    style: {
      imgStyle: { position: "absolute", bottom: 0, right: "0px" },
      tourGuideBody: {
        position: "relative",
        width: "calc(100% - 72px)",
        flexShrink: "0",
        left: "20px",
        background: "#000",
        color: "#FFF",
        textAlign: "center",
        fontFamily: "Schoolbell",
        fontSize: "24px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        bottom: "185px",
        top: "",
      },
    },
    buttonText: "Ok",
    // routePath: "/choose-era",
    routePath: "",
    screenName: "",
    arrowImg: {
      arrowImg: greatJobPopupUpArrow,
      style: {
        position: "absolute",
        top: "8%",
        right: "12%",
      },
    },
  },
  {
    step: 8,
    text: `Good try! Answer 10 questions to finish this level!`,
    img: astronautThink,
    imgDimension: {
      width: "100%",
      height: "100%",
    },
    style: {
      imgStyle: { position: "absolute", bottom: 0, right: "0px" },
      tourGuideBody: {
        position: "relative",
        width: "calc(100% - 72px)",
        flexShrink: "0",
        left: "20px",
        background: "#000",
        color: "#FFF",
        textAlign: "center",
        fontFamily: "Schoolbell",
        fontSize: "24px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        bottom: "185px",
        top: "",
      },
    },
    buttonText: "Ok",
    routePath: "",
    screenName: "",
    arrowImg: {
      arrowImg: greatJobPopupUpArrow,
      style: {
        position: "absolute",
        top: "8%",
        right: "12%",
      },
    },
  },
  {
    step: 9,
    text: `Awesome, You got the hang of it now. Keep playing and I will see you later!`,
    img: astronautGreatJob,
    imgDimension: {
      width: "100%",
      height: "100%",
    },
    style: {
      imgStyle: { position: "absolute", bottom: 0, right: "0px" },
      tourGuideBody: {
        position: "relative",
        width: '95%',
        flexShrink: "0",
        left: "auto",
        right:'auto',
        background: "#000",
        color: "#FFF",
        textAlign: "center",
        fontFamily: "Schoolbell",
        fontSize: "24px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        bottom: "185px",
        top: "",
      },
    },
    buttonText: "continue",
    routePath: "",
    screenName: "",
    arrowImg: {
      arrowImg: "",
      style: {},
    },
  },
];

const stepsFilter = (step) => {
  const filteredStep = stepsJson.filter((stp, index) => {
    let intoJson = stp?.step === step;
    return intoJson;
  });
  return filteredStep[0];
};

export { stepsFilter };
