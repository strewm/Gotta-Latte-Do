import { handleErrors } from './utils.js';

// Add functionality to demo user button to log in as a demo user
const demoButton = document.querySelector('.demo-user');
demoButton.addEventListener('click', async(e) => {
  e.preventDefault();
  try {
    await fetch('/users/demo', {
      method: "POST"
    })

    window.location.href = '/app';
  } catch (err) {
    handleErrors(err)
  }
})
