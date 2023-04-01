const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const nextButton = document.getElementById('next');
const submitButton = document.getElementById('submit');
const scoreboard = document.getElementById('scoreboard');
const totalQuestions = 177;
const numberOfQuestionsToAnswer = 75;
let currentQuestionIndex = 0;
let numCorrect = 0;

let questions = [];
let randomQuestions = [];

async function fetchQuizData() {
  const response = await fetch('qz.json');
  const data = await response.json();
  return data;
}

function getRandomQuestions() {
  const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
  return shuffledQuestions.slice(0, numberOfQuestionsToAnswer);
}

async function init() {
  questions = await fetchQuizData();
  randomQuestions = getRandomQuestions();
  buildQuiz();
  updateScoreboard();
}

function buildQuiz() {
  const currentQuestion = randomQuestions[currentQuestionIndex];

  const questionContainer = document.getElementById('question-container');
  questionContainer.innerHTML = `
    <div class="question">${currentQuestion.question}</div>
  `;

  const answerContainer = document.getElementById('answer-container');
  answerContainer.innerHTML = "";

  for (const letter in currentQuestion.answers) {
    const answerCard = document.createElement("div");
    answerCard.className = "card mb-2";

    const answerCardBody = document.createElement("div");
    answerCardBody.className = "card-body";

    const answerLabel = document.createElement("label");

    const answerInput = document.createElement("input");
    answerInput.type = "checkbox";
    answerInput.name = `question${currentQuestionIndex}`;
    answerInput.value = letter;

    answerLabel.appendChild(answerInput);
    answerLabel.innerHTML += ` ${letter} : ${currentQuestion.answers[letter]}<br>`;

    answerCardBody.appendChild(answerLabel);
    answerCard.appendChild(answerCardBody);
    answerContainer.appendChild(answerCard);
  }

  const checkAnswerButton = document.createElement("button");
  checkAnswerButton.className = "check-answer btn btn-info mt-3";
  checkAnswerButton.innerHTML = "정답 확인";
  checkAnswerButton.onclick = checkAnswer;
  answerContainer.appendChild(checkAnswerButton);
}


function checkAnswer() {
  const answerContainer = quizContainer.querySelector('.answers');
  const checkboxes = answerContainer.querySelectorAll(`input[type=checkbox]`);
  const checkAnswerButton = quizContainer.querySelector('.check-answer');

  let userAnswers = [];
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      userAnswers.push(checkbox.value);
    }
  });

  const currentQuestion = randomQuestions[currentQuestionIndex];

  // 정답 및 오답 표시를 해당 보기에만 적용합니다.
  checkboxes.forEach(checkbox => {
    const label = checkbox.parentElement;
    if (userAnswers.includes(checkbox.value)) {
      if (currentQuestion.correctAnswers.includes(checkbox.value)) {
        label.style.color = "green";
      } else {
        label.style.color = "red";
      }
    } else if (currentQuestion.correctAnswers.includes(checkbox.value)) {
      label.style.color = "green";
    }
  });

  const correct = userAnswers.sort().toString() === currentQuestion.correctAnswers.sort().toString();

  if (correct) {
    numCorrect++;
  }
  updateScoreboard();

  // 마지막 문제인 경우 정답 확인 버튼을 숨기고 제출 버튼을 표시합니다.
  if (currentQuestionIndex === numberOfQuestionsToAnswer - 1) {
    checkAnswerButton.style.display = 'none';
    submitButton.style.display = 'block';
  } else {
    // 정답 확인 버튼을 숨기고 다음 버튼을 표시합니다.
    checkAnswerButton.style.display = 'none';
    nextButton.style.display = 'block';
  }
}
function showResults() {
  resultsContainer.innerHTML = `총 점수: ${numCorrect} / ${numberOfQuestionsToAnswer}`;
}

function showNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= numberOfQuestionsToAnswer - 1) {
    nextButton.style.display = 'none';
    submitButton.style.display = 'block';
  }
  buildQuiz();

  // 다음 문제에는 다시 정답 확인 버튼이 표시되고 다음 버튼이 숨겨집니다.
  const checkAnswerButton = quizContainer.querySelector('.check-answer');
  checkAnswerButton.style.display = 'block';
  nextButton.style.display = 'none';
}

function updateScoreboard() {
  scoreboard.innerHTML = `맞은 문제 수: ${numCorrect} / ${numberOfQuestionsToAnswer}`;
}

nextButton.addEventListener('click', showNextQuestion);
submitButton.addEventListener('click', showResults);

quizContainer.addEventListener('click', (event) => {
  if (event.target.matches('.check-answer')) {
    checkAnswer();
  }
});

init();
