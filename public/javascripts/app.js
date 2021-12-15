import { handleErrors } from "./utils.js";
import { fetchTask, fetchComments, postComment } from "./task-comments.js";


const fetchTasks = async () => {
    const res = await fetch("http://localhost:8080/tasks")

    if (res.status === 401) {
        window.location.href = "/log-in";
        return;
      }

    const { tasks } = await res.json();
    const tasksListContainer = document.querySelector(".task-list");
    const tasksHtml = tasks.map(({ id, description }) => `
    <div class="task-info">
        <input type="checkbox" class="task-check-box" id=${id} name=${id}>
        <label for=${id} id=${id} class="task-check-box">${description}</label>
    </div>
    `)

    tasksListContainer.innerHTML = tasksHtml.join("");
}

const fetchContactTasks = async (id) => {
  console.log(id.id)
  const res = await fetch(`http://localhost:8080/tasks/task/${id.id}`)
  console.log(id.id)
  if (res.status === 401) {
      window.location.href = "/log-in";
      return;
    }

  const { tasks } = await res.json();
  const tasksListContainer = document.querySelector(".task-list");
  const tasksHtml = tasks.map(({ id, description }) => `
  <div>
      <input type="checkbox" class="task-check-box" id=${id} name=${id}>
      <label for=${id} class="task-check-box">${description}</label>
  </div>
  `)

  tasksListContainer.innerHTML = tasksHtml.join("");
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
      await fetchTasks();
    } catch (e) {
      console.error(e);
    }

    const tasksListContainer = document.querySelector(".task-list");
    tasksListContainer.addEventListener("click", async(e) => {
      const taskId = e.target.id;

      try {
        await fetchTask(taskId);

        const createComment = document.querySelector('.create-comment');

        createComment.addEventListener('submit', async (event) => {
          event.stopPropagation();
          event.preventDefault();
          const commentData = new FormData(createComment);
          const message = commentData.get("message");
          const taskId = commentData.get("taskId");

          const body = { message };

          postComment(taskId, body);

        })

      } catch (e) {
        console.error(e);
      }

      try {
        await fetchComments(taskId);
      } catch (e) {
        console.error(e);
      }

    })

  }
  );



const form = document.querySelector(".create-task");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const description = formData.get("description")
    const dueDate = formData.get("dueDate")
    const checkStatus = formData.get("isCompleted")
    const givenTo = formData.get("givenTo")
    let isCompleted;


    //convert checkbox to boolean value
    if (checkStatus === 'on') {
        isCompleted = true;
    } else {
        isCompleted = false;
    }



    const body = { description, dueDate, isCompleted, givenTo }

    try {
        const res = await fetch("http://localhost:8080/tasks", {
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
            throw res;
          }

        form.reset();
        await fetchTasks();
    } catch (err) {
        handleErrors(err)
    }
})


const contacts = document.querySelector('.contact-list-sidebar')

contacts.addEventListener("click", async (e) => {
  const target = e.target;
  console.log(target)
  fetchContactTasks(target)
})

const logoutButton = document.querySelector("#logout");

window.addEventListener('DOMContentLoaded', async () => {
  console.log("event listener loaded!!!")
  const settings = document.querySelector('#settings');

  settings.addEventListener('click', event => {
    console.log("settings clicked!!!")
    event.stopPropagation();
    document.querySelector('.settingGroup').classList.remove('settingHide');
  });

  window.addEventListener('click', () => {
    console.log("outside of settings clicked!!!")
    document.querySelector('.settingGroup').classList.add('settingHide');
  });

})



const signOutButton = document.querySelector("#signOut");

signOutButton.addEventListener("click", async (e) => {
  console.log('hello')
  e.preventDefault();
  try {
    await fetch("http://localhost:8080/users/logout", {
      method: "POST"
    })

    window.location.href = "/";
  } catch (err) {
    handleErrors(err)
  }

})
