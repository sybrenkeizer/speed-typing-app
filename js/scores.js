const sessionData = JSON.parse(localStorage.getItem('sessionData'));
const clearBtn = document.getElementById('scores__header__clear');
const scoresList = document.getElementById('scores__list');

console.log(sessionData);
const addSessionData = () => {
  const li = document.createElement('li');
  li.innerHTML = `
    <span></span>
    <span>${sessionData.username}</span>
    <span>${sessionData.date}</span>
    <span>${sessionData.averageTime}</span>
  ` 
  scoresList.appendChild(li);
}

const clearScoreList = () => {
  if (confirm('Do you want to clear the list?')) {
    (scoresList.innerHTML = '');
    clearScoresLS();
  }
}

const clearScoresLS = () => localStorage.removeItem('sessionData');

clearBtn.addEventListener('click', clearScoreList);
window.addEventListener('DOMContentLoaded', addSessionData);