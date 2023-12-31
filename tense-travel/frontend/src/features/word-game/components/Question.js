import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../sass/styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import {
  buyLivesPaylod,
  getStageQuestion,
  reTryStagePaylod,
  shareGameSessionDetailPayload,
  userAnswerSubmitPayload,
  userSubmitAnswerResponse,
} from "../../../utils/payload";
import { tourGuideSteps, userIds, userInfo } from "../../../utils/constants";
import {
  buyLives,
  exitGoBackResetStage,
  reTryStage,
  resetUserRecentStage,
  shareGameSessionDetail,
  shareGameSessionUpdateDetail,
  updateExplanationInAnsweredQuestion,
} from "../../../services/questionAPI";
import CommonModal from "../common/CommonModal";
import { actionType, popupTypes } from "../../../utils/commonFunction";
import stageContext from "../../../context/tenseTravel/StageContext";
import ExitStageConfirmPopup from "../common/CommonModal/ExitStageConfirmPopup";
import TourGuideIndex from "../common/TourGuide";
import {
  showTourGuidePopup,
  updateTourGuideStep,
} from "../common/TourGuide/UpdateTourGuideSteps";
import {
  updateUserTourStatus,
  userTourStatus,
} from "../../../services/userAPI";
import { shareGameSessionDetailPayloadReset } from "../../../utils/resetPaload";
import { setStorage } from "../../../utils/manageStorage";
import { hotjar } from "../../../hotjar/HotjarIntegration";

let questionsParsed, questionsData, currentQuestionIndex, userTourData;
function Question() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  const { eraId, stageId } = useParams();
  const inputRef = useRef(null);

  const [userAnswer, setUserAnswer] = useState("");
  const [queSequence, setQueSequence] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [lives, setLives] = useState(0);
  const [isCorrectAns, setIsCorrectAns] = useState(null);
  const [purchaseDialogShow, setPurchaseDialogShow] = useState(false);
  const [retryMsg, setRetryMsg] = useState(null);
  const [showModal, setShow] = useState(false); //buy lives modal
  const [modalParams, setModalParams] = useState({});
  const [goldenHeart, setGoldenHeart] = useState(false);
  const stageCompleteContext = useContext(stageContext);
  const [exitPopupShow, setExitPopupShow] = useState(false);
  // const [remainingQuestions, setRemainingQuestions] = useState(0);
  let remainingQuestions = 0;
  const [showAnswerBox, setShowAnswerBox] = useState(false);
  const [showWord, setShowWord] = useState();
  const [progressBarZIndex, setProgressBarZIndex] = useState();
  const [showTourGuide, setShowTourGuide] = useState(false);
  const [tourStatusData, setTourStatusData] = useState();
  const [questionExplanation, setQuestionExplanation] = useState("");
  const [showCheckButton, setShowCheckButton] = useState(false);
  let recentStageData;
  let storageData = userInfo();
  const [previousQuestion, setPreviousQuestion] = useState();

  /*fill in the blank input style*/
  const [inputStyle, setInputStyle] = useState({
    backgroundColor: "transparent",
    color: "white",
    outline: "none",
    border: "none",
    fontSize: "16px",
    fontWeight: "800",
    maxWidth: "100%",
    width: "20%",
  });

  //reset stage data when user clicks go back in purchase popup
  const resetStage = async () => {
    const requestPayload = {
      userId: storageData["userId"],
      tenseEraId: eraId,
      stageId: stageId,
      sessionId: storageData["sessionId"],
    };
    const resetResult = await exitGoBackResetStage(requestPayload);
    const payload = {
      userId: requestPayload["userId"],
      sessionId: requestPayload["sessionId"],
      tourGuideStep: 5,
      tourGuide: true,
    };
    await updateUserTourStatus(payload);
  };

  const handleBuyCoinPopupClose = () => {
    resetStage();
    setShow(false); //purchase modal
    navigate(`/choose-stage/${eraId}`);
  };

  const handleExplanationPopupClose = () => {
    setShow(false);
  };

  /*-------------------------purchase popup show---------------------*/
  const handleBuyCoinPopupShow = (popupType, action = "") => {
    const popup = actionType(popupType);
    const modalParams = { modalName: popup };
    setModalParams(modalParams);
    setShow(true); //sshow purchase modal
    if (popupType === "PURCHASE_LIVES") {
      buyHeart();
    }
    if (popupType === "RETRY_GAME_POPUP" && action === "retryGame") {
      retryGame();
    }
    return;
  }; /*-------------------------purchase popup show end---------------------*/

  const handleExitStage = (status) => {
    // navigate(`/choose-stage/${eraId}`);
    if (status === true) setExitPopupShow(true);
    if (status === false) {
      setExitPopupShow(false);
      inputRef.current.focus();
    }
  };

  const resetRecentStage = async () => {
    getStageQuestion.userId = userIds.userId;
    getStageQuestion.tenseEraId = eraId;
    getStageQuestion.stageId = stageId;
    getStageQuestion["sessionId"] = "";

    const resetRecentStage = await resetUserRecentStage(getStageQuestion);
    if (resetRecentStage["success"] === true) {
      recentStageData = resetRecentStage["data"];
      getStageQuestion["sessionId"] = resetRecentStage["data"]?.sessionId;
    }
    return getStageQuestion["sessionId"];
  };

  /*------------------------get stage questions-------------------------------*/
  const getStageQuestions = async () => {
    // getStageQuestion["sessionId"] = userIds.sessionId;
    getStageQuestion.userId = userIds.userId;
    getStageQuestion.tenseEraId = eraId;
    getStageQuestion.stageId = stageId;
    let sessionId = await resetRecentStage();

    if (sessionId === null || sessionId === "") {
      setPurchaseDialogShow(true);
      setRetryMsg("Something went wrong");
      return;
    }
    const session = { sessionId };
    setStorage(session);
    shareGameSessionInfo();

    setPurchaseDialogShow(false);
    setRetryMsg("Something went wrong");

    questionsData = await fetch(
      `${process.env.REACT_APP_API_URL}/question/get-random-question-byunlock-stage`,
      {
        method: "POST",
        body: JSON.stringify(getStageQuestion),
        headers: { "Content-Type": "application/json" },
      }
    );

    questionsParsed = await questionsData.json();
    setGoldenHeart(
      questionsParsed["data"]["isLivePurchased"] === true ? true : false
    );

    if (questionsParsed["data"]["questions"].length === 0) {
      userSubmitAnswerResponse = {
        ...questionsParsed["data"],
        message: questionsParsed["data"]["message"],
      };

      answerRWPopup(userSubmitAnswerResponse); //answerRightWrongPopup
    } else {
      inputRef.current.focus();
      setLives(questionsParsed["data"]["heartLive"]);
      questionsParsed["data"] = questionsParsed["data"]["questions"];
      setQuestions(questionsParsed["data"]);

      filterCurrentQuestion(null);
    }

    if (questionsParsed["data"].length > 0) {
      //checking user tour guide completed
      if (!userTourData["data"]?.tourGuide) showTourPopup();
    }
  }; /*------------------------get stage questions end---------------------------*/

  const filterCurrentQuestion = (index) => {
    if (index !== null && index !== undefined && index !== "") {
      currentQuestionIndex = parseInt(index);
      currentQuestionIndex++;

      if (currentQuestionIndex <= 9) {
        setCurrentQuestion({
          ...questionsParsed["data"][index],
          index: currentQuestionIndex,
        });
        setQueSequence(currentQuestionIndex);
      }
    } else {
      for (let item in questionsParsed["data"]) {
        if (questionsParsed["data"][item]?.isCorrect === null) {
          setCurrentQuestion({ ...questionsParsed["data"][item], index: item });
          currentQuestionIndex = item;
          setQueSequence(currentQuestionIndex);
          break;
        }
      }
    }
  };

  const onChange = (event, index) => {
    setShowCheckButton(event.target.value.length > 0 ? true : false);
    setUserAnswer(event.target.value);

    event.preventDefault();
    setInputStyle({
      backgroundColor: "transparent",
      color: "white",
      outline: "none",
      border: "none",
      fontSize: "16px",
      fontWeight: "800",
      maxWidth: "100%",
      minWidth: "20%",
      width: (event.target.value.length + 1) * 10 + "px",
    });
  };

  const handleSubmitAnswer = async (event) => {
    // navigate("/complete-stage");
    // return;

    event.preventDefault();
    // handleBuyCoinPopupShow(popupTypes[3]);
    // return;
    await checkAnswer();
  };

  /*--------------------------------check answer----------------------------*/
  const checkAnswer = async () => {
    // setUserAnswer("");
    setShowCheckButton(false);
    const currentQues = questionsParsed["data"][currentQuestionIndex];

    // userAnswerSubmitPayload.sessionId = userIds.sessionId;
    userAnswerSubmitPayload.sessionId = getStageQuestion["sessionId"];
    userAnswerSubmitPayload.userId = userIds.userId;
    userAnswerSubmitPayload.questionId = currentQues?._id;
    userAnswerSubmitPayload.tenseEraId = currentQues?.tenseEraId;
    userAnswerSubmitPayload.stageId = currentQues?.stageId;
    userAnswerSubmitPayload.question = currentQues?.question;
    userAnswerSubmitPayload.userAnswer = userAnswer;
    setPreviousQuestion(userAnswerSubmitPayload);
    inputRef.current.focus();

    inputRef.current.blur();
    const submitAnswer = await fetch(
      `${process.env.REACT_APP_API_URL}/userEra/user-attending-question`,
      {
        method: "POST",
        body: JSON.stringify(userAnswerSubmitPayload),
        headers: { "Content-Type": "application/json" },
      }
    );

    setCurrentQuestion(questionsParsed["data"][currentQuestionIndex]);

    let submitAnswerParsed = await submitAnswer.json();
    const message = submitAnswerParsed["message"];
    setRetryMsg(message);

    userSubmitAnswerResponse = {
      ...submitAnswerParsed["data"]["answerResponseFormat"],
      message,
    };

    answerRWPopup(userSubmitAnswerResponse); //answerRightWrongPopup

    submitAnswerParsed = submitAnswerParsed["data"]["answerResponseFormat"];
    setLives(submitAnswerParsed["heartLive"]);

    // updating anwered question isCorrect
    let updatedQues = questionsParsed["data"];
    for (let index in updatedQues) {
      if (parseInt(currentQuestionIndex) == index) {
        updatedQues[currentQuestionIndex]["isCorrect"] =
          submitAnswerParsed["isCorrect"];
        break;
      }
    }

    setQuestions(updatedQues);
  }; /*--------------------------------check answer end-----------------------*/

  /*-------------------------handle next question----------------------------*/
  const handleNextQuestion = (explanation = "") => {
    if (explanation === "hideExplanationPopup") setShow(false);

    setIsCorrectAns(null);
    setUserAnswer("");
    inputRef.current.focus();
    filterCurrentQuestion(currentQuestionIndex);

    if (userSubmitAnswerResponse["isGameOver"] === true) {
      inputRef.current.blur();
      // setPurchaseDialogShow(true);
      handleBuyCoinPopupShow(popupTypes[0]);
      setUserAnswer("");
      setIsCorrectAns(null);
    }

    //checking stage is completed
    if (userSubmitAnswerResponse["completedStage"] === true) {
      inputRef.current.blur();

      shareGameSessionInfo(userSubmitAnswerResponse);
      // setPurchaseDialogShow(true);
      // setRetryMsg(userSubmitAnswerResponse["message"]);
      stageCompleteContext.setStageInfo({
        userId: userIds.userId,
        // sessionId: userIds.sessionId,
        sessionId: getStageQuestion["sessionId"],
        stageId: stageId,
        tenseEraId: eraId,
      });

      if (!userTourData["data"]?.tourGuide) {
        if (parseInt(tourGuideSteps.steps) === 7) {
          tourGuideSteps.steps++;
        }
        tourGuideSteps.steps++;
        // updateTourGuideStep(tourGuideSteps.steps);
        showTourGuidePopup(true);
        setShowTourGuide(tourGuideSteps.show);
        showTourPopup();
      } else {
        navigate("/complete-stage");
      }
    }

    //checking user tour guide completed
    if (!userTourData["data"]?.tourGuide) showTourPopup();
    // else navigate("/complete-stage");
  }; /*----------------------handle next question end-------------------*/

  /*----------------------Right, wrong answer popup--------------*/
  const answerRWPopup = (userSubmitAnswerResponse) => {
    //answerRWPopup=answerRightWrongPopup
    if (
      userSubmitAnswerResponse["completedStage"] === true &&
      userSubmitAnswerResponse["isCorrect"] !== null
    ) {
      inputRef.current.blur();
      setIsCorrectAns(userSubmitAnswerResponse["isCorrect"]);
      return;
    } else if (userSubmitAnswerResponse["completedStage"] === true) {
      inputRef.current.blur();
      setPurchaseDialogShow(true);
      setRetryMsg("Stage has already been completed");
      return;
    }

    if (
      userSubmitAnswerResponse["isGameOver"] === true &&
      userSubmitAnswerResponse["isLivePurchased"] === true
    ) {
      inputRef.current.blur();
      handleBuyCoinPopupShow(popupTypes[3]);
      return;
    }

    if (userSubmitAnswerResponse["isGameOver"] === true) {
      inputRef.current.blur();
      if (
        userSubmitAnswerResponse["isGameOver"] === true &&
        userSubmitAnswerResponse["isCorrect"] === null &&
        userSubmitAnswerResponse["isLivePurchased"] === false
      ) {
        handleBuyCoinPopupShow(popupTypes[0]);
      } else {
        setIsCorrectAns(userSubmitAnswerResponse["isCorrect"]);
      }
      return;
    }
    setIsCorrectAns(userSubmitAnswerResponse["isCorrect"]);
  }; /*----------------------Right, wrong answer popup end--------------*/

  /*-------------------retry game------------------------------*/
  const retryGame = async () => {
    setPurchaseDialogShow(false);
    setUserAnswer("");

    // reTryStagePaylod.sessionId = userIds.sessionId;
    reTryStagePaylod.sessionId = getStageQuestion["sessionId"];
    reTryStagePaylod.userId = userIds.userId;
    reTryStagePaylod.tenseEraId = eraId;
    reTryStagePaylod.stageId = stageId;
    const reTryStageRes = await reTryStage(reTryStagePaylod);

    if (reTryStageRes["success"] === true) {
      setShow(false); //show purchase modal
      await getStageQuestions();
    }
  }; /*-------------------retry game end------------------------------*/

  /*----------------------buy heart---------------------------------*/
  const buyHeart = async () => {
    setUserAnswer("");
    // buyLivesPaylod.sessionId = userIds.sessionId;
    buyLivesPaylod.sessionId = getStageQuestion["sessionId"];
    buyLivesPaylod.userId = userIds.userId;
    buyLivesPaylod.stageId = stageId;
    buyLivesPaylod.tenseEraId = eraId;
    const buyLiveRes = await buyLives(buyLivesPaylod);

    if (buyLiveRes["success"] === true) {
      setShow(false); //show purchase modal
      await getStageQuestions();
      setGoldenHeart(true);
    }
  }; /*----------------------buy heart end---------------------------------*/

  const gameCompleted = () => {
    navigate(`/choose-stage/${eraId}`);
  };

  /*---------------------getting user tour detail----------------*/
  const userTourStaus = async () => {
    const userId = userIds.userId;
    userTourData = await userTourStatus(userId);
    setTourStatusData(userTourData);
    if (userTourData) getStageQuestions();
  }; /*---------------------getting user tour detail end----------------*/

  /*-------------------------share game session detail--------------------------- */
  const shareGameSessionInfo = async (stageSessionTime = "") => {
    shareGameSessionDetailPayloadReset();
    const userStorageDetail = userInfo();
    shareGameSessionDetailPayload.Mobile = userStorageDetail["mobile"];
    shareGameSessionDetailPayload.Type = "Game";
    shareGameSessionDetailPayload.SessionID = userStorageDetail["sessionId"];

    shareGameSessionDetailPayload.SessionComplete = "No";
    shareGameSessionDetailPayload.TimeSpent = "";

    if (stageSessionTime) {
      shareGameSessionDetailPayload.SessionEndTime =
        stageSessionTime["sessionEndTime"];

      shareGameSessionDetailPayload.SessionStartTime =
        stageSessionTime["sessionStartTime"];
      shareGameSessionDetailPayload.SessionComplete = "Yes";

      //calculate session spent time
      const timeDifferenceInMilliseconds =
        new Date(stageSessionTime["sessionEndTime"]) -
        new Date(stageSessionTime["sessionStartTime"]);

      const spentTime = Math.floor(
        (timeDifferenceInMilliseconds % (1000 * 60)) / 1000
      );
      shareGameSessionDetailPayload.TimeSpent = spentTime;

      const gameSessionDetail = await shareGameSessionUpdateDetail(
        shareGameSessionDetailPayload
      );
    } else {
      shareGameSessionDetailPayload.SessionEndTime = "";
      shareGameSessionDetailPayload.SessionStartTime =
        recentStageData["startTime"];
      shareGameSessionDetailPayload.TimeSpent = 0;

      const gameSessionDetail = await shareGameSessionDetail(
        shareGameSessionDetailPayload
      );
    }

    // const gameSessionDetail = await shareGameSessionDetail(
    //   shareGameSessionDetailPayload
    // );
  }; /*-------------------------share game session detail end--------------------------- */

  useEffect(() => {
    // getStageQuestions();
    userInfo();
    userTourStaus();

    hotjar.initialize();
    hotjar.initialized();
  }, []);

  //tour guide popup settings
  const tourGuideCallback = (params) => {
    if (tourGuideSteps.steps === 5) inputRef.current.blur();

    if (params["showAnswerBox"] === true) {
      const setShowAnswerBoxTimeOut = setTimeout(() => {
        setShowAnswerBox(true);
        clearTimeout(setShowAnswerBoxTimeOut);
      }, 500);
    }

    if (tourGuideSteps.steps === 7 || tourGuideSteps.steps === 8) {
      showTourGuidePopup(false);
      updateTourGuideStep(tourGuideSteps.steps);
      setShowTourGuide(tourGuideSteps.show);
      if (tourGuideSteps.steps === 7) {
        updateTourGuideStep(tourGuideSteps.steps);
      }
    }

    if (tourGuideSteps.steps === 9) {
      tourGuideSteps.steps = 9;
      navigate("/complete-stage");
      return;
    }
    // inputRef.current.focus();
  };

  const showTourPopup = () => {
    // tourGuideSteps.steps++;
    updateTourGuideStep(tourGuideSteps.steps);
    const showTourPopupSetTimeOut = setTimeout(() => {
      if (
        Number(sessionStorage.getItem("step")) &&
        Number(sessionStorage.getItem("step")) === 5
      ) {
        setShowWord({
          position: "relative",
          zIndex: 2,
        });
        showTourGuidePopup(true);
        setShowTourGuide(tourGuideSteps.show);
      }
      clearTimeout(showTourPopupSetTimeOut);
    }, 500);
    setShowTourGuide(tourGuideSteps.show);

    if (tourGuideSteps.steps === 6) {
      if (userSubmitAnswerResponse["isCorrect"]) {
        tourGuideSteps.steps++;
        showTourGuidePopup(true);
      } else if (!userSubmitAnswerResponse["isCorrect"]) {
        tourGuideSteps.steps = tourGuideSteps.steps + 2;
        showTourGuidePopup(true);
        // tourGuideSteps.steps = tourGuideSteps.steps - 1;
        // updateTourGuideStep(tourGuideSteps.steps);
      }
      setProgressBarZIndex({
        zIndex: 2,
      });
    }
    setShowTourGuide(tourGuideSteps.show);
  };

  const inputQuestionClick = (event) => {
    setShowWord();
    showTourGuidePopup(false);
    setShowTourGuide(tourGuideSteps.show);
    if (isCorrectAns !== null) {
      //If the user has submitted an answer and the answer popup is opened, the answer box is not editable.
      inputRef.current.blur();
    }
  };

  const handleGiveExplanation = async () => {
    setShow(true);
    handleBuyCoinPopupShow(popupTypes[4]);
    setQuestionExplanation(questions[queSequence]);
    let explanationPayload = previousQuestion;
    explanationPayload["isExplanation"] = true;
    delete explanationPayload["question"];
    delete explanationPayload["userAnswer"];
    await updateExplanationInAnsweredQuestion(explanationPayload);
  };

  return (
    <>
      <div className="container">
        {showModal && (
          <CommonModal
            modalParams={modalParams}
            handleBuyCoinPopupClose={handleBuyCoinPopupClose}
            handleBuyCoinPopupShow={handleBuyCoinPopupShow}
            handleNextQuestion={handleNextQuestion}
            questionExplanation={questionExplanation}
            handleExplanationPopupClose={handleExplanationPopupClose}
          />
        )}
        {showTourGuide && (
          <TourGuideIndex
            step={tourGuideSteps.steps}
            tourGuideCallback={tourGuideCallback}
          />
        )}
        <div className="fourth-step">
          <div className="question-block">
            <div className="question-slide-line">
              <div className="flex">
                <button
                  onClick={() => handleExitStage(true)}
                  className="close"
                ></button>
                <ul style={progressBarZIndex}>
                  {questions.length > 0 &&
                    questions.map((ques, index) => {
                      remainingQuestions =
                        ques?.isCorrect === null ? remainingQuestions + 1 : 0;
                      return (
                        <li
                          key={index}
                          className={ques?.isCorrect !== null ? "active" : ""}
                        ></li>
                      );
                    })}
                </ul>
                <div
                  className={
                    !goldenHeart ? "count-question" : "count-question-golden"
                  }
                  style={progressBarZIndex}
                >
                  {lives}
                </div>
              </div>
            </div>
            <div style={showWord}>
              <h1>{questions && questions[queSequence]?.stageTitle}</h1>
              <strong>
                Word:{" "}
                <label className="tense-word">
                  {questions && questions[queSequence]?.word}
                </label>
              </strong>
            </div>
            {/* <h1>{questions && questions[queSequence]?.stageTitle}</h1>
            <strong>Word: {questions && questions[queSequence]?.word}</strong> */}
            <div
              className={`input-question ${
                tourGuideSteps.steps === 6 ? "input-question-tour-guide" : ""
              }`}
            >
              <label>{questions[queSequence]?.question.split("__")[0]}</label>{" "}
              <input
                style={inputStyle}
                type="text"
                onChange={(event) => onChange(event, queSequence)}
                value={userAnswer}
                autoFocus
                ref={inputRef}
                placeholder={"_________"}
                onClick={(e) => inputQuestionClick()}
              />{" "}
              <label htmlFor="">
                {questions[queSequence]?.question.split("__")[1]}
              </label>
            </div>
          </div>
          <button
            className={`blue-btn fixedBtn ${showCheckButton ? "" : "disbaled"}`}
            onClick={handleSubmitAnswer}
          >
            Check
          </button>
        </div>

        {/* answer poup */}
        {isCorrectAns !== null && (
          <div
            className={
              isCorrectAns === true
                ? "right-answer-block active"
                : "right-answer-block wrong-answer active"
            }
          >
            <div className="flex">
              <div className="icon"></div>
              <div className="ques-ans-info">
                {currentQuestion && (
                  <strong>
                    Ans: {currentQuestion?.question.split("__")[0]}{" "}
                    {currentQuestion?.answer}{" "}
                    {currentQuestion?.question.split("__")[1]}
                  </strong>
                )}
                <strong>
                  {/* Explanation: {currentQuestion && currentQuestion?.explanation} */}
                </strong>
              </div>
            </div>
            <div className="align-center" style={{ marginBottom: "3px" }}>
              <button
                className="give-explanation-btn"
                onClick={handleGiveExplanation}
              >
                Give explanation
              </button>
            </div>
            <div className="align-center">
              <button
                className="blue-btn green-btn"
                onClick={handleNextQuestion}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ExitStageConfirmPopup */}
        {exitPopupShow && (
          <div className="question-exit-overlay">
            <ExitStageConfirmPopup
              exitPopup={exitPopupShow}
              remainingQuestions={remainingQuestions}
              tenseEra={eraId}
              handleExitStage={handleExitStage}
            />
          </div>
        )}

        {/* purchase modal */}
        {purchaseDialogShow && (
          <div className="purchase-coins-modal active">
            <div className="flex">
              {/* <div className="icon"></div> */}
              <div className="ques-ans-info" style={{ margin: "auto" }}>
                <strong>{retryMsg && retryMsg}</strong>
                {/* <strong>Explanation: He eats his food</strong> */}
              </div>
            </div>
            {userSubmitAnswerResponse.isGameOver && (
              <div
                className="align-center"
                style={{ display: "flex", justifyContent: "space-evenly" }}
              >
                <button onClick={retryGame} className="">
                  Retry
                </button>
                <button className="" onClick={buyHeart}>
                  Buy Hearts
                </button>
              </div>
            )}
            {userSubmitAnswerResponse.completedStage && (
              <div
                className="align-center"
                style={{ display: "flex", justifyContent: "space-evenly" }}
              >
                <button className="" onClick={gameCompleted}>
                  Ok
                </button>
              </div>
            )}
            <div
              style={{
                margin: "auto",
                left: "10%",
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                right: "10%",
              }}
            >
              <button className="" onClick={gameCompleted}>
                Ok
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Question;
