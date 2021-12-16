import { handleErrors } from "./utils.js";

const demoButton = document.querySelector('.demo-user');
demoButton.addEventListener('click', async(e) => {
  e.preventDefault();
  console.log('CLICK')
  try {
    await fetch('/users/demo', {
      method: "POST"
    })

    window.location.href = '/app';
  } catch (err) {
    handleErrors(err)
  }
})
