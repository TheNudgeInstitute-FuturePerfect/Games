import React, { useEffect, useRef, useState } from "react";
// import "../../../css/styles.css";
import "../../../sass/styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStageQuestion,
  userAnswerSubmitPayload,
} from "../../../utils/payload";
import { userIds } from "../../../utils/constants";

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
    if (questionsParsed["data"].length === 0) {
      questionsParsed = questionsParsed["message"];
      navigate(`/choose-stage/${eraId}`);
    } else {
      setLives(questionsParsed["data"]["heartLive"]);
      questionsParsed["data"] = questionsParsed["data"]["questions"];
      setQuestions(questionsParsed["data"]);

      filterCurrentQuestion(null);
    }

    if (
      questionsParsed["answerResponseFormat"] &&
      questionsParsed["answerResponseFormat"]?.completedStage === true
    ) {
      alert("you have completed the stage ");
      navigate(`/choose-stage/${eraId}`);
    }
  };

  const filterCurrentQuestion = (index) => {
    if (index !== null && index !== undefined && index !== "") {
      currentQuestionIndex = parseInt(index);
      currentQuestionIndex++;
      // console.log(currentQuestionIndex)

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
          // console.log(currentQuestionIndex)
          break;
        }
      }
    }
  };

  const onChange = (event, index) => {
    setUserAnswer(event.target.value);
    // currentQuestionIndex = index;
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
    submitAnswerParsed = submitAnswerParsed["data"]["answerResponseFormat"];
    setLives(submitAnswerParsed["heartLive"]);
    setIsCorrectAns(submitAnswerParsed["isCorrect"]);
    if (submitAnswerParsed["completedStage"] === true) {
      alert(message);
      navigate(`/choose-stage/${eraId}`);
    }

    if (submitAnswerParsed["heartLive"] === 0) {
      alert(message);
      navigate(`/choose-stage/${eraId}`);
    }

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
      </div>
    </>
  );
}

export default Question;
