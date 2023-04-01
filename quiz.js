const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const nextButton = document.getElementById('next');
const submitButton = document.getElementById('submit');
const scoreboard = document.getElementById('scoreboard');
const totalQuestions = 177;
const numberOfQuestionsToAnswer = 75;
let currentQuestionIndex = 0;
let numCorrect = 0;

const questions = [
  {
    question: "웹 프로그래밍 언어는?",
    answers: {
      a: "Python",
      b: "JavaScript",
      c: "Ruby"
    },
    correctAnswers: ["b", "c"] // 배열 형태로 변경
  },
  {
    question: "웹 2프로그래밍 언어는?",
    answers: {
      a: "Pytho2n",
      b: "JavaS2cript",
      c: "Rub2y"
    },
    correctAnswers: ["b", "c"] // 배열 형태로 변경
  },
  {
    question: "웹 프로3그래밍 언어는?",
    answers: {
      a: "Pytho3n",
      b: "Ja3vaScript",
      c: "R3uby"
    },
    correctAnswers: ["b", "c"] // 배열 형태로 변경
  }
];

function getRandomQuestions() {
  const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
  return shuffledQuestions.slice(0, numberOfQuestionsToAnswer);
}

const randomQuestions = getRandomQuestions();

function buildQuiz() {
  const currentQuestion = randomQuestions[currentQuestionIndex];

  const answers = [];

  for (const letter in currentQuestion.answers) {
    answers.push(
      `<label>
        <input type="checkbox" name="question${currentQuestionIndex}" value="${letter}">
        ${letter} :
        ${currentQuestion.answers[letter]}
        <br>
      </label>`
    );
  }

  quizContainer.innerHTML = `
    <div class="question">${currentQuestion.question}</div>
    <div class="answers">${answers.join('')}</div>
    <button class="check-answer">정답 확인</button>
  `;
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
  if (userAnswers.sort().toString() === currentQuestion.correctAnswers.sort().toString()) {
    answerContainer.style.color = "green";
    numCorrect++;
  } else {
    answerContainer.style.color = "red";
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

buildQuiz();
updateScoreboard();
