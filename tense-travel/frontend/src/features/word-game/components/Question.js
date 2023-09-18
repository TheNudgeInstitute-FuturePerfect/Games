import React, { useEffect, useRef, useState } from "react";
// import "../../../css/styles.css";
import "../../../sass/styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStageQuestion,
  userAnswerSubmitPayload,
} from "../../../utils/payload";

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

  const navigateStage = () => {
    navigate("/choose-stage");
  };

  const getStageQuestions = async () => {
    getStageQuestion["sessionId"] = "7694ffb1-09c8-48da-b7d1-819c79c4891c";
    getStageQuestion.userId = "64f583fe0de4f60ae6e05cc5";
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
    if (questionsParsed["data"].length === 0) {
      questionsParsed = questionsParsed['message'];
      navigate(`/choose-stage/${eraId}`);
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
          setQueSequence(item);
          currentQuestionIndex = item;
          break;
        }
      }
    }
  };

  const onChange = (event, index) => {
    setUserAnswer(event.target.value);
    console.log(index);
    // currentQuestionIndex = index;
  };

  const handleSubmitAnswer = async (event) => {
    event.preventDefault();
    // filterCurrentQuestion(currentQuestionIndex);

    await checkAnswer();
  };

  const checkAnswer = async () => {
    userAnswerSubmitPayload.sessionId = "7694ffb1-09c8-48da-b7d1-819c79c4891c";
    userAnswerSubmitPayload.userId = "64f583fe0de4f60ae6e05cc5";
    userAnswerSubmitPayload.questionId = currentQuestion?._id;
    userAnswerSubmitPayload.tenseEraId = currentQuestion?.tenseEraId;
    userAnswerSubmitPayload.stageId = currentQuestion?.stageId;
    userAnswerSubmitPayload.question = currentQuestion?.question;
    userAnswerSubmitPayload.userAnswer = userAnswer;
    console.log(userAnswerSubmitPayload);
    inputRef.current.focus();

    setUserAnswer("");
    const submitAnswer = await fetch(
      `${process.env.REACT_APP_API_URL}/userEra/user-attending-question`,
      {
        method: "POST",
        body: JSON.stringify(userAnswerSubmitPayload),
        headers: { "Content-Type": "application/json" },
      }
    );

    let submitAnswerParsed = await submitAnswer.json();
    submitAnswerParsed = submitAnswerParsed["data"]["answerResponseFormat"];
    setLives(submitAnswerParsed["heartLive"]);
    setIsCorrectAns(submitAnswerParsed["isCorrect"]);
    console.log(submitAnswerParsed["isCorrect"]);
  };

  const handleNextQuestion = () => {
    console.log("handleNextQuestion");
    setIsCorrectAns(null);
    filterCurrentQuestion(currentQuestionIndex);
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
          {/* <button
            className={`blue-btn ${userAnswer.length > 0 ? "" : "disbaled"}`}
          >
            Check
          </button> */}
          <button
            className={`blue-btn ${userAnswer.length > 0 ? "" : "disbaled"}`}
            onClick={handleSubmitAnswer}
          >
            Check
          </button>
        </div>

        {/* <div className={"right-answer-block" isCorrectAns={}}> */}
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
                <strong>Ans: He eats his food</strong>
                <strong>Explanation: He eats his food</strong>
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
        {/* <div
          className={
            isCorrectAns === true
              ? "right-answer-block active"
              : "right-answer-block wrong-answer-block active"
          }
        >
          <div className="flex">
            <div className="icon"></div>
            <div className="ques-ans-info">
              <strong>Ans: He eats his food</strong>
              <strong>Explanation: He eats his food</strong>
            </div>
          </div>
          <div className="align-center">
            <button className="blue-btn green-btn" onClick={handleNextQuestion}>Next</button>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default Question;
