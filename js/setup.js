// TODO - make alert/notification popup for form validation


const languageInput = document.getElementById('language-select');
const difficultyInput = document.getElementById('difficulty-select');
const wordLengthInput = document.getElementById('word-length-select');
const amountWordsInput = document.getElementById('number-words-select');
const usernameInput = document.getElementById('setup__name__input');
const startBtn = document.getElementById('setup__start-btn');

let inputValues;

const setInputValues = () => {
  inputValues = {
    setupLanguage: languageInput.value,
    setupDifficulty: difficultyInput.value,
    setupAmountWords: amountWordsInput.value,
    setupWordLength: wordLengthInput.value,
    setupUsername: usernameInput.value,
  }
}

const storeInputValues = () => {
  localStorage.setItem('inputValues', JSON.stringify(inputValues));
}

startBtn.addEventListener('click', () => {
  if (usernameInput.value === '') {
    showNotification();
    return;
  }
  setInputValues()
  storeInputValues();
  window.location.href = '../html/app.html';
})

const showNotification = () => {
  const setupNotification = document.getElementById('setup-notification');
  setupNotification.classList.add('show');
  setTimeout(() => setupNotification.classList.remove('show'), 2200);
}