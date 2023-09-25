import React, { useEffect, useRef, useState } from "react";
// import "../../../css/styles.css";
import "../../../sass/styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStageQuestion,
  reTryStagePaylod,
  userAnswerSubmitPayload,
  userSubmitAnswerResponse,
} from "../../../utils/payload";
import { userIds } from "../../../utils/constants";
import reTryStage from "../../../services/stageRetryAPI";
import CommonModal from "../common/CommonModal";

let questionsParsed, questionsData, currentQuestionIndex;
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

  const navigateStage = () => {
    navigate(`/choose-stage/${eraId}`);
  };

  const getStageQuestions = async () => {
    getStageQuestion["sessionId"] = userIds.sessionId;
    getStageQuestion.userId = userIds.userId;
    getStageQuestion.tenseEraId = eraId;
    getStageQuestion.stageId = stageId;

    questionsData = await fetch(
      `${process.env.REACT_APP_API_URL}/question/get-random-question-byunlock-stage`,
      {
        method: "POST",
        body: JSON.stringify(getStageQuestion),
        headers: { "Content-Type": "application/json" },
      }
    );

    questionsParsed = await questionsData.json();
    if (questionsParsed["data"]["questions"].length === 0) {
      userSubmitAnswerResponse = {
        ...questionsParsed["data"],
        message: questionsParsed["data"]["message"],
      };

      answerRWPopup(userSubmitAnswerResponse); //answerRightWrongPopup
    } else {
      setLives(questionsParsed["data"]["heartLive"]);
      questionsParsed["data"] = questionsParsed["data"]["questions"];
      setQuestions(questionsParsed["data"]);

      filterCurrentQuestion(null);
    }
  };

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
    setUserAnswer(event.target.value);
  };

  const handleSubmitAnswer = async (event) => {
    event.preventDefault();
    await checkAnswer();
  };

  const checkAnswer = async () => {
    const currentQues = questionsParsed["data"][currentQuestionIndex];

    userAnswerSubmitPayload.sessionId = userIds.sessionId;
    userAnswerSubmitPayload.userId = userIds.userId;
    userAnswerSubmitPayload.questionId = currentQues?._id;
    userAnswerSubmitPayload.tenseEraId = currentQues?.tenseEraId;
    userAnswerSubmitPayload.stageId = currentQues?.stageId;
    userAnswerSubmitPayload.question = currentQues?.question;
    userAnswerSubmitPayload.userAnswer = userAnswer;
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
  };

  const handleNextQuestion = () => {
    setIsCorrectAns(null);
    setUserAnswer("");
    inputRef.current.focus();
    filterCurrentQuestion(currentQuestionIndex);

    if (userSubmitAnswerResponse["isGameOver"] === true) {
      inputRef.current.blur();
      setPurchaseDialogShow(true);
      setUserAnswer("");
      setIsCorrectAns(null);
    }

    if (userSubmitAnswerResponse["completedStage"] === true) {
      inputRef.current.blur();
      setPurchaseDialogShow(true);
      setRetryMsg(userSubmitAnswerResponse["message"]);
    }
  };

  const answerRWPopup = (userSubmitAnswerResponse) => {
    if (userSubmitAnswerResponse["completedStage"] === true) {
      inputRef.current.blur();
      setPurchaseDialogShow(true);
      setRetryMsg("Stage has already been completed");
      return;
    }

    if (userSubmitAnswerResponse["isGameOver"] === true) {
      inputRef.current.blur();
      setPurchaseDialogShow(true);
      setRetryMsg(userSubmitAnswerResponse["message"]);
      return;
    }
    setIsCorrectAns(userSubmitAnswerResponse["isCorrect"]);
  };

  const retryGame = async () => {
    setPurchaseDialogShow(false);
    setUserAnswer("");

    reTryStagePaylod.sessionId = userIds.sessionId;
    reTryStagePaylod.userId = userIds.userId;
    reTryStagePaylod.tenseEraId = eraId;
    reTryStagePaylod.stageId = stageId;
    const reTryStageRes = await reTryStage(reTryStagePaylod);

    let reTryStageParsed = await reTryStageRes.json();
    inputRef.current.focus();
    if (reTryStageParsed["success"] === true) {
      await getStageQuestions();
    }
  };

  const buyHeart = () => {
    navigate(`/choose-stage/${eraId}`);
  };

  useEffect(() => {
    getStageQuestions();
  }, []);

  return (
    <>
      <div className="container">
        <div className="fourth-step">
          <div className="question-block">
            <div className="question-slide-line">
              <div className="flex">
                <button onClick={navigateStage} className="close"></button>
                <ul>
                  {questions.length > 0 &&
                    questions.map((ques, index) => {
                      return (
                        <li
                          key={index}
                          className={ques?.isCorrect !== null ? "active" : ""}
                        ></li>
                      );
                    })}
                </ul>
                <div className="count-question">{lives}</div>
              </div>
            </div>
            <h1>{questions && questions[queSequence]?.stageTitle}</h1>
            <strong>Word: {questions && questions[queSequence]?.word}</strong>
            <div className="input-question">
              <label>{questions[queSequence]?.question.split("__")[0]}</label>{" "}
              <input
                style={{
                  width: "70px",
                  backgroundColor: "transparent",
                  color: "white",
                  outline: "none",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "800",
                }}
                type="text"
                onChange={(event) => onChange(event, queSequence)}
                value={userAnswer}
                autoFocus
                ref={inputRef}
                placeholder="_________"
              />{" "}
              <label htmlFor="">
                {questions[queSequence]?.question.split("__")[1]}
              </label>
            </div>
          </div>
          <button
            className={`blue-btn ${userAnswer.length > 0 ? "" : "disbaled"}`}
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
                  Explanation: {currentQuestion && currentQuestion?.explanation}
                </strong>
              </div>
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

        {/* purchase modal */}
        {purchaseDialogShow && (
          <div className="purchase-coins-modal active">
            <div className="flex">
              {/* <div className="icon"></div> */}
              <div className="ques-ans-info">
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
                <button className="" onClick={buyHeart}>
                  Ok
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Question;
