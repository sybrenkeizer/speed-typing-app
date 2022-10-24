const instructionsModalWrapper = document.querySelector('.instructions-modal-wrapper');
const openInstructionsBtn = document.getElementById('menu__instructions-btn');
const closeInstructionsBtn = document.getElementById('instructions-modal__exit');

const openInstructions = () => instructionsModalWrapper.classList.add('show');
const closeInstructions = () => {
  instructionsModalWrapper.classList.remove('show'); 
  document.querySelector('.modal-content').scrollTo(0,0);
}

openInstructionsBtn.addEventListener('click', openInstructions);
closeInstructionsBtn.addEventListener('click', closeInstructions);
