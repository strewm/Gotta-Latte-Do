import { handleErrors } from "./utils.js";

const form = document.querySelector(".list-form");

const throwError = () => {
    const formError = document.querySelector(".form_error")
    formError.innerHTML = `
            <p>There was an error. Please try adding your list again.</p>
            `
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const title = formData.get("title")

    const body = { title }

    try {
        const res = await fetch("/lists", {
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
