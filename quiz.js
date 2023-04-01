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
  if (!randomQuestions || randomQuestions.length === 0) {
    console.error("randomQuestions 배열이 비어 있습니다.");
    return;
  }
  
  if (currentQuestionIndex < 0 || currentQuestionIndex >= randomQuestions.length) {
    console.error("currentQuestionIndex가 올바르지 않습니다.");
    return;
  }

  const currentQuestion = randomQuestions[currentQuestionIndex];

  const questionContainer = document.getElementById('question-container');
  questionContainer.innerHTML = `
    <div class="question">${currentQuestionIndex + 1}. ${currentQuestion.question}</div>
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
    answerLabel.innerHTML += ` ${letter} : ${currentQuestion.answers[letter]}`;

    answerCardBody.appendChild(answerLabel);
    answerCard.appendChild(answerCardBody);
    answerContainer.appendChild(answerCard);
  }

  const checkAnswerButton = document.createElement("button");
  checkAnswerButton.className = "check-answer btn btn-info mt-3";
  checkAnswerButton.innerHTML = "정답 확인";
  checkAnswerButton.onclick = checkAnswer;
  answerContainer.appendChild(checkAnswerButton);

    const checkboxes = answerContainer.querySelectorAll(`input[type=checkbox]`);
  limitCheckboxSelection(checkboxes, currentQuestion.correctAnswers.length);

  // 첫 번째 문제에서 정답 확인 버튼과 다음 버튼을 동시에 보여줍니다.
  if (currentQuestionIndex === 0) {
    checkAnswerButton.style.display = 'inline-block';
    nextButton.style.display = 'inline-block';
  } else if (currentQuestionIndex < numberOfQuestionsToAnswer - 1) {
    nextButton.style.display = 'block';
    checkAnswerButton.style.display = 'none';
  } else {
    submitButton.style.display = 'block';
    nextButton.style.display = 'none';
  }

}

function checkAnswer() {
  const answerContainer = document.getElementById('answer-container');
  const checkboxes = answerContainer.querySelectorAll(`input[type=checkbox]`);
  const checkAnswerButton = document.querySelector('.check-answer');
  checkAnswerButton.style.display = 'none';

  let userAnswers = [];
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      userAnswers.push(checkbox.value);
    }
  });

  const currentQuestion = randomQuestions[currentQuestionIndex];

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

    checkbox.disabled = true;
  });

  const correct = userAnswers.sort().toString() === currentQuestion.correctAnswers.sort().toString();

  if (correct) {
    numCorrect++;
  }
  updateScoreboard();

  // 정답 확인 버튼 대신 다음 버튼을 보여줍니다.
  if (currentQuestionIndex < numberOfQuestionsToAnswer - 1) {
    nextButton.style.display = 'block';
    checkAnswerButton.style.display = 'none';
  } else {
    submitButton.style.display = 'block';
    nextButton.style.display = 'none';
  }
}

function showNextQuestion() {
  if (currentQuestionIndex < numberOfQuestionsToAnswer - 1) {
    currentQuestionIndex++;
    buildQuiz();
  } else {
    console.error("더 이상 표시할 문제가 없습니다.");
  }
}

function updateScoreboard() {
  scoreboard.innerHTML = `맞은 문제 수: ${numCorrect} / ${numberOfQuestionsToAnswer}`;
}

function showResults() {
  // 문제와 보기를 숨깁니다.
  questionContainer.style.display = 'none';
  answerContainer.style.display = 'none';
  nextButton.style.display = 'none';
  submitButton.style.display = 'none';

  // 결과를 화면 가운데 표시합니다.
  resultsContainer.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'vh-100');
  resultsContainer.innerHTML = `
    <div>
      <h3 class="text-center">총 점수: ${numCorrect} / ${numberOfQuestionsToAnswer}</h3>
      <button class="retry btn btn-primary mt-3 d-block mx-auto">다시하기</button>
    </div>
  `;

  const retryButton = resultsContainer.querySelector('.retry');
  retryButton.addEventListener('click', () => {
    // 다시하기 버튼을 누르면 문제와 보기를 다시 표시합니다.
    questionContainer.style.display = '';
    answerContainer.style.display = '';
    resultsContainer.classList.remove('d-flex', 'align-items-center', 'justify-content-center', 'vh-100');

    currentQuestionIndex = 0;
    numCorrect = 0;
    randomQuestions = getRandomQuestions();
    buildQuiz();
    updateScoreboard();
    resultsContainer.innerHTML = '';
  });
}

function limitCheckboxSelection(checkboxes, maxSelection) {
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
      if (checkedCheckboxes.length > maxSelection) {
        checkbox.checked = false;
      }
    });
  });
}

nextButton.addEventListener('click', () => {
  checkAnswer();
  showNextQuestion();
});
submitButton.addEventListener('click', showResults);

init();
