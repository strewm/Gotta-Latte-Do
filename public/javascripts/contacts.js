import { addTaskInfoListeners, updateTaskListContainer } from "./utils.js";


// shows tasks that user assigns to their contacts
export const fetchContactTasks = async (id) => {
    const res = await fetch(`/tasks/task/${id.id}`)
    if (res.status === 401) {
        window.location.href = "/log-in";
        return;
      }

    const { tasks, user, isContact } = await res.json();

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
    await updateTaskListContainer(tasks, listName);

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
