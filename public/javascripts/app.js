import { handleErrors } from "./utils.js";
import { fetchTask, fetchComments, postComment } from "./task-comments.js";


export const fetchTasks = async () => {
    const res = await fetch("/tasks")

    if (res.status === 401) {
        window.location.href = "/log-in";
        return;
      }

    const { tasks, user } = await res.json();

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
  const res = await fetch(`/tasks/task/${id.id}`)
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
      <label for=${id} class="task-check-box" id=${id}>${description}</label>
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
      e.stopPropagation();
      const taskId = e.target.id;

      // let stateObj = { id: "100" }
      // window.history.replaceState(stateObj, "Task", `/tasks/#${taskId}`)

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
    const title = formData.get("title");
    let isCompleted;

    console.log(title)

    //convert checkbox to boolean value
    if (checkStatus === 'on') {
        isCompleted = true;
    } else {
        isCompleted = false;
    }



    const body = { description, dueDate, isCompleted, givenTo, title }

    try {
        const res = await fetch("/tasks", {
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

// switch between your tasks and your contact's tasks
const contacts = document.querySelector('.contact-list-sidebar')

contacts.addEventListener("click", async (e) => {
  const target = e.target;
  console.log(target)
  fetchContactTasks(target)
})


// delete a contact

const deleteContact = document.querySelector('.contact-list-sidebar')

deleteContact.addEventListener("click", async (e) => {
  e.stopPropagation();
  e.preventDefault();
  if(e.target.innerText === '-'){
    const targetRemoval = e.target.parentNode.parentNode
    const deleteContactId = e.target.id;
    targetRemoval.remove();

    await fetchTasks();

    try {

      await fetch(`http://localhost:8080/contacts/${deleteContactId}`, {
        method: "DELETE",
      })



    } catch (err) {
      handleErrors(err)
    }
  }

})

const deleteList = document.querySelector('.list-list-sidebar')

deleteList.addEventListener("click", async (e) => {
  e.stopPropagation();
  e.preventDefault();
  const deleteListId = e.target.id;
  if (e.target.innerText === '-') {
    const targetRemoval = e.target.parentNode.parentNode
    targetRemoval.remove();
    try {

      await fetch(`http://localhost:8080/lists/${deleteListId}`, {
        method: "DELETE",
      })

    } catch (err) {
      handleErrors(err)
    }
  } else if (e.target.className === 'list-lists') {
    const listId = e.target.id;
    const listForm = document.querySelector('.updateList');
    const listTitle = await fetch(`http://localhost:8080/lists/${listId}`, {
      method: "GET",
    })
    const { listName } = await listTitle.json();
    console.log(listName);
    listForm.innerHTML = `
    <h2>Edit List Name</h2>
    <div id='list-edit'>
      <form class='list-edit-form'>
      <input type='text' class='list-edit' id='title' name='title' placeholder=${listName.title}>
      <label for='title' class='list-label'${listName.title} </label>
      <button class='submitButton'>Submit</button>
      </form>
    </div>
      `
      const listUpdate = document.querySelector('.list-edit-form')
      listUpdate.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const formData = new FormData(listUpdate);
        const title = formData.get('title')
        const body = { title }
        await fetch(`http://localhost:8080/lists/${listId}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      })
  }
})


const logoutButton = document.querySelector("#logout");

window.addEventListener('DOMContentLoaded', async () => {
  // console.log("event listener loaded!!!")
  const settings = document.querySelector('#settings');

  settings.addEventListener('click', event => {
    // console.log("settings clicked!!!")
    event.stopPropagation();
    document.querySelector('.settingGroup').classList.remove('settingHide');
  });

  window.addEventListener('click', () => {
    // console.log("outside of settings clicked!!!")
    document.querySelector('.settingGroup').classList.add('settingHide');

    // const editForm = document.querySelector('.edit-form');
    // const form = document.querySelector('.edit-task');
    // editForm.removeChild(form);
    // const editTaskButt = document.querySelector('.edit-task-butt');
    // editTaskButt.disabled = false;
  });

})



const signOutButton = document.querySelector("#signOut");

signOutButton.addEventListener("click", async (e) => {
  console.log('hello')
  e.preventDefault();
  try {
    await fetch("/users/logout", {
      method: "POST"
    })

    window.location.href = "/";
  } catch (err) {
    handleErrors(err)
  }

})
