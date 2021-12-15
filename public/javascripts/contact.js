import { handleErrors } from "./utils.js";

const form = document.querySelector(".contacts-form");

const throwError = () => {
    const formError = document.querySelector(".form_error")
    formError.innerHTML = `
            <p>You entered an invalid email address, or this email is currently in your contacts.</p>
            `
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const email = formData.get("email")

    const body = { email }

    try {
        const res = await fetch("http://localhost:8080/add-contacts", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",

            }
        })

        if (res.status === 401) {
            window.location.href = "/log-in";
            return;
          }
        if (!res.ok) {

            throw throwError();
          }

        form.reset();
        window.location.href = "/app";
    } catch (err) {
        handleErrors(err)
    }
})
