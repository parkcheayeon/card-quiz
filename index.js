import data from "./quiz.json";

const quizInfo = document.querySelector(".quiz-info");
const startButton = quizInfo.querySelector(".start-button");
const quizStart = document.querySelector(".quiz-start");
const quizQuestion = quizStart.querySelector(".quiz-question");
const scoreInfo = quizStart.querySelector(".score-info");
const quizSelection = quizStart.querySelector(".quiz-selection");
const remainsDisplay = scoreInfo.querySelector(".remains");
const scoreDisplay = scoreInfo.querySelector(".score");
const quizResult = document.querySelector(".quiz-result")
const nextButton = quizResult.querySelector(".next-button");
const markDisplay = quizResult.querySelector(".mark");
const timeDisplay = quizResult.querySelector(".time");
const quizRestart = document.querySelector(".quiz-restart")
const scoreline = quizRestart.querySelector(".scoreline");
const restartButton = quizRestart.querySelector(".restart-button");

const CLICK = "click";

const STYLE = {
  HIDDEN: "hidden",
  SELECT: "select",
  EXAMPLE: "example",
  CHECK: "check"
};

const QUIZ = {
  INDEX: 0,
  SCORE: 0,
  REMAINS: 19,
  TIME: 5
};

const MESSAGES = {
  CORRECT_ANSWER: "정답입니다!",
  INCORRECT_ANSWER: "오답입니다. 정답을 확인해주세요.",
  TIME_OVER: "시간초과..! 정답을 확인해주세요."
};

let quizIndex = QUIZ.INDEX;
let score = QUIZ.SCORE;
let remains = QUIZ.REMAINS;
let time = QUIZ.TIME;
let isPlaying = false;
let timeInterval;

function countDown() {
  time > 0 ? time-- : isPlaying = false;
  timeDisplay.textContent = `남은시간 : ${time}`;

  if (!isPlaying) {
    clearInterval(timeInterval);
  } else if (!time) {
    paintQuizAnswer(MESSAGES.TIME_OVER);
  }
}

function paintQuizAnswer(text) {
  const quizChoices = quizSelection.children;
  const currentAnswer = data[quizIndex].correctAnswer;
  quizChoices[currentAnswer].classList.add(STYLE.CHECK);
  paintQuizResult(text);
}

function initializeQuiz() {
  clearInterval(timeInterval);
  time = QUIZ.TIME;
  timeDisplay.textContent = `남은시간 : ${time}`;
  timeInterval = setInterval(countDown, 1000);
  nextButton.classList.add(STYLE.HIDDEN);
  markDisplay.classList.add(STYLE.HIDDEN);
  paintQuizScore();
  makeQuizQuestion();
  quizSelection.innerHTML = "";
  makeQuizChoices();
  const quizExample = document.querySelector(".example");

  if (quizExample) {
    quizExample.remove();
  }
  makeQuizExample();
}

function handleRestartButtonClick() {
  isPlaying = true;
  quizIndex = QUIZ.INDEX;
  remains = QUIZ.REMAINS;
  score = QUIZ.SCORE;
  initializeQuiz();
  quizRestart.classList.add(STYLE.HIDDEN);
  quizStart.classList.remove(STYLE.HIDDEN);
  quizResult.classList.remove(STYLE.HIDDEN);
}

function handleNextButtonClick() {

  if (remains) {
    isPlaying = true;
    remains--;
    quizIndex++;
    initializeQuiz();
  } else {
    quizStart.classList.add(STYLE.HIDDEN);
    quizResult.classList.add(STYLE.HIDDEN);
    quizRestart.classList.remove(STYLE.HIDDEN);
    scoreline.textContent = `${score}점 입니다!`;
  }
}

function paintQuizScore() {
  scoreDisplay.textContent = score;
  remainsDisplay.textContent = remains;
}

function paintQuizResult(text) {
  nextButton.classList.remove(STYLE.HIDDEN);
  markDisplay.classList.remove(STYLE.HIDDEN);
  markDisplay.textContent = text;
}

function handleAnswerClick(event) {

  if (!isPlaying || event.target.className !== STYLE.SELECT) {

    return;
  }
  isPlaying = false;
  const currentChoices = data[quizIndex].choices;
  const currentAnswer = data[quizIndex].correctAnswer;

  if (event.target.textContent === currentChoices[currentAnswer]) {
    score += 5;
    paintQuizResult(MESSAGES.CORRECT_ANSWER);
  } else {
    paintQuizAnswer(MESSAGES.INCORRECT_ANSWER);
  }
}

function makeQuizExample() {
  const currentExample = data[quizIndex].code;

  if (currentExample) {
    const quizExample = document.createElement("div");
    scoreInfo.after(quizExample);
    quizExample.classList.add(STYLE.EXAMPLE);
    quizExample.textContent = currentExample;
  }
}

function makeQuizChoices() {
  data[quizIndex].choices.forEach((choice) => {
    const quizChoice = document.createElement("div");
    quizSelection.appendChild(quizChoice);
    quizChoice.classList.add(STYLE.SELECT);
    quizChoice.textContent = choice;
  });
}

function makeQuizQuestion() {
  quizQuestion.textContent = data[quizIndex].question;
}

function startGame() {
  isPlaying = true;
  timeDisplay.textContent = `남은시간 : ${time}`;
  timeInterval = setInterval(countDown, 1000);
  quizInfo.classList.add(STYLE.HIDDEN);
  quizStart.classList.remove(STYLE.HIDDEN);
  makeQuizQuestion();
  makeQuizChoices();
  makeQuizExample();
  paintQuizScore();
}

function init() {
  startButton.addEventListener(CLICK, startGame);
  quizSelection.addEventListener(CLICK, handleAnswerClick);
  nextButton.addEventListener(CLICK, handleNextButtonClick);
  restartButton.addEventListener(CLICK, handleRestartButtonClick);
}

init();
