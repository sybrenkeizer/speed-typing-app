// TODO - setup: start on key press enter (kc 14)



import { http } from './http.js';

const wordEL = document.getElementById('game__word');
const inputEl = document.getElementById('word-input');

let language;
let difficulty;
let totalWordsNumber;
let username;

let currentWordNumber = 1;
let currentTimeSeconds = 10;
let totalTimeSec = 0;

let addTime;
let wordLength;

let wordsArray;



// ====================== //
// ===== Set Values ===== //
// ====================== //
const getSetupValues = () => {
  const setupValues = JSON.parse(localStorage.getItem('inputValues'));
  language = setupValues.setupLanguage;
  difficulty = setupValues.setupDifficulty;
  wordLength = setupValues.setupWordLength;
  totalWordsNumber = setupValues.setupAmountWords;
  username = setupValues.setupUsername;
};

const setDifficulty = (difficulty) => {
  switch(difficulty) {
    case 'easy': addTime = 5; break;
    case 'medium': addTime = 4; break;
    case 'hard': addTime = 3; break;
    case 'insane': addTime = 2; break;
  };
};


const getWords = () => {
  http
    .get(`https://random-word-api.herokuapp.com/word?lang=${language}&number=${totalWordsNumber}&length=${Number(wordLength)}`)
    .then(data => wordsArray = data)
    .catch(error => console.error(error));
};

const setWord = () => wordEL.textContent = wordsArray[currentWordNumber - 1].toLowerCase();



// =============== //
// ===== HUD ===== //
// =============== //
const setProgressText = () => {
  const progressTextEl = document.getElementById('progress-text');
  progressTextEl.textContent = `${currentWordNumber}/${totalWordsNumber}`;
};

const setProgressBar = () => {
  const progressBarEl = document.getElementById('progress-bar-inner');
  progressBarEl.style.width = `${currentWordNumber / totalWordsNumber * 100}%`;
};

const setAverageTime = () => {
  const averageTimeEl = document.getElementById('hud__avTime');
  averageTimeEl.textContent = `${calcAverageTime()}s`;
};



// ================= //
// ===== Timer ===== //
// ================= //
const setTimer = () => {
  const timerEl = document.getElementById('timer');
  const padTo2Digits = (num) => num.toString().padStart(2, '0');
  const min = Math.floor(currentTimeSeconds / 60);
  const sec = Math.floor(currentTimeSeconds % 60);
  timerEl.textContent = `${padTo2Digits(min)}:${padTo2Digits(sec)}`;
};

const countdown = () => {
  const interval = setInterval(() => {
    currentTimeSeconds--;
    setTimer();
    if (currentWordNumber === Number(totalWordsNumber)) {
      clearInterval(interval);
    };
    if (currentTimeSeconds === 0) {
      clearInterval(interval);
      endGameModal('lose');
    };
  }, 1000);
};


// ================= //
// ===== Input ===== //
// ================= //
const verifyInput = () => {
  if (inputEl.value === wordEL.textContent) {
    currentWordNumber++;
    currentTimeSeconds += addTime;
    inputEl.value = '';
    setTimer();
    setAverageTime();
    setWord();
    setProgressText();
    setProgressBar();
    checkProgress();
  };
};

const checkProgress = () => {
  currentWordNumber === Number(totalWordsNumber) && endGameModal('win');
};



// ================= //
// ===== Time ===== //
// ================= //
const trackTime = () => {
  const interval = setInterval(() => totalTimeSec++, 1000);
  currentWordNumber === Number(totalWordsNumber) && clearInterval(interval);
};

const calcAverageTime = () => (totalTimeSec / currentWordNumber).toFixed(2);



// ================== //
// ===== Modals ===== //
// ================== //
const startGameModal = () => {
  const startGameModalWrapper = document.querySelector('.start-game-modal-wrapper');
  const countdownText = document.getElementById('start-game-modal__countdown');
  let countdownValue = 5;
  countdownText.textContent = countdownValue;
  const interval = setInterval(() => {
    countdownValue--
    countdownText.textContent = countdownValue;
    if (countdownValue === 0) {
      clearInterval(interval);
      startGameModalWrapper.classList.remove('show');
    };
  }, 1000);
};

const endGameModal = (status) => {
  removeInputValuesFromLS();
  const endGameModalTitle = document.getElementById('end-game-modal__title');
  const endGameModalText = document.getElementById('end-game-modal__text');
  if (status === 'win') {
    endGameModalTitle.textContent = 'You have finished!';
    endGameModalText.textContent = `
      Congratulations ${username}! You've typed ${totalWordsNumber} questions in ${totalTimeSec} seconds: an average of ${calcAverageTime()} seconds per word.
    `
    storeResultInLS();
  } else if (status === 'lose') {
    endGameModalTitle.textContent = 'You lose!';
    endGameModalText.textContent = `
      To bad ${username}, you were not typing fast enough. Keep practicing!
    `
  };
  const endGameModalWrapper = document.querySelector('.end-game-modal-wrapper');
  endGameModalWrapper.classList.add('show');
};



// ======================== //
// ===== Notification ===== //
// ======================== //
const showNotification = () => {
  const notification = document.getElementById('exit-notification');
  notification.classList.add('show');
  notification.addEventListener('click', (e) => {
    if (e.target.dataset.btn === 'deny') {
      notification.classList.remove('show');
    } else if (e.target.dataset.btn === 'agree') {
      notification.classList.remove('show');
      window.location.href = '../index.html';
      removeInputValuesFromLS();
    }
  })
}



// ========================= //
// ===== Local Storage ===== //
// ========================= //
const getDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${day}/${month + 1}/${year}`;
}

const getSessionData = () => {
  const sessionData = {
    username: username,
    language: language,
    difficulty: difficulty,
    numberOfWords: totalWordsNumber,
    wordLength: wordLength,
    totalTime: totalTimeSec,
    averageTime: calcAverageTime(),
    date: getDate(),
  }
  return sessionData
}

const storeResultInLS = () => {
  localStorage.setItem('sessionData', JSON.stringify(getSessionData()));
}

const removeInputValuesFromLS = () => localStorage.removeItem('inputValues');

// const removeSessionDataFromLS = () => localStorage.removeItem('sessionData');


// ====================== //
// ===== Initialize ===== //
// ====================== //
const init = () => {
  getSetupValues();
  setDifficulty(difficulty);
  getWords();
  startGameModal();
};

const startGame = () => {
  setProgressText();
  setProgressBar();
  setAverageTime();
  setTimer();
  trackTime();
  countdown();
  setWord();
};

setTimeout(() => startGame(), 5000);



// =========================== //
// ===== Event Listeners ===== //
// =========================== //
inputEl.addEventListener('input', verifyInput);
window.addEventListener('DOMContentLoaded', init);
document.getElementById('hud__exit').addEventListener('click', showNotification);

