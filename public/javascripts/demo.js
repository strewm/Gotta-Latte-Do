import { handleErrors } from "./utils.js";

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
