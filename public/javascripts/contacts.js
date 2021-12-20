import { addTaskInfoListeners } from "./utils.js";


// shows tasks that user assigns to their contacts
export const fetchContactTasks = async (id) => {
    const res = await fetch(`/tasks/task/${id.id}`)
    if (res.status === 401) {
        window.location.href = "/log-in";
        return;
      }

    const { tasks, user, isContact } = await res.json();
    const tasksListContainer = document.querySelector(".task-list");
    let listName = ``;
    if(!isContact) {
      listName = `
      <h2 class="task-list-header">All of <strong>${user.username}'s</strong> self-assigned tasks.</h2>
      `
      //await fetchAssignTasks();
    } else {
      listName = `
    <h2 class="task-list-header">Tasks you've given to <strong>${user.username}</strong></h2>
    `
    const clearAssignedList = document.querySelector('.assigned-list')
    clearAssignedList.innerHTML = ``;
    }
    const tasksHtml = tasks.map(({ id, description, isCompleted }) => {
      if (isCompleted === true) {
        return `
        <div class='task-info' id=${id}>
            <input type="checkbox" class="task-check-box" id=${id} name=${id} checked>
            <label for=${id} id=${id} class="task-check-box">${description}</label>
        </div>
        `
      } else {
      return `<div class='task-info' id=${id}>
                <input type="checkbox" class="task-check-box" id=${id} name=${id}>
                <label for=${id} id=${id} class="task-check-box">${description}</label>
            </div>
        `
    }
  })

    tasksListContainer.innerHTML = listName + tasksHtml.join("");

    await addTaskInfoListeners();

  }



//dynamically add new contact to the sidebar
export const addNewContact = async (id) => {
    const res = await fetch(`/users/${id}`, {
      method: "GET"
    })

    if (res.status === 401) {
      window.location.href = "/log-in";
      return;
    }

    const { userInfo } = await res.json();
    const addNewContact = `
    <div class="list-grid">
      <div>
          <li class="contact-list" id=${userInfo.id}>${userInfo.username}</li>
      </div>
      <div>
          <a class="delete-contact" id=${userInfo.id}>-</a>
      </div>
    </div>
    `
    const contactContainer = document.querySelector('.contact-list-sidebar');
    const node = document.createElement("div")
    node.innerHTML = addNewContact;
    contactContainer.appendChild(node);
  }
