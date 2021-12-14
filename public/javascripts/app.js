import { handleErrors } from "./utils.js";

const fetchTasks = async () => {
    const tasks = await Task.findAll({
        where: {
            userId: res.locals.userId
        }
    })
}

const form = document.querySelector(".create-task");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const description = formData.get("description")
    const dueDate = formData.get("dueDate")
    const checkStatus = formData.get("isCompleted")
    const givenTo = formData.get("givenTo")
    let isCompleted;
    let csrf;

    //convert checkbox to boolean value
    if (checkStatus === 'on') {
       isCompleted = true;
    } else {
        isCompleted = false;
    }

    if(document.cookie) {
        let allCookies = document.cookie.split('; ');
        let csurf = allCookies.find(cookie => cookie.includes('_csrf'));
        let [name, value] = csurf.split("=");

        csrf = value;
    }

    const body = { description, dueDate, isCompleted, givenTo }

    try {
        const res = await fetch("http://localhost:8080/tasks", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                'X-CSRF-TOKEN': csrf
            }
        })

        if (res.status === 401) {
            window.location.href = "/log-in";
            return;
          }
        if (!res.ok) {
            throw res;
          }
    } catch (err) {
        handleErrors(err)
    }
})
