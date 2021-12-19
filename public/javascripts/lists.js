import { editListEventListener, addTaskInfoListeners, handleErrors } from "./utils.js";

// Fetch all lists and populate on left hand side
export const fetchLists = async () => {
  const res = await fetch('/lists')

  if (res.status === 401) {
    window.location.href = "/log-in";
    return;
  }

  const { allLists } = await res.json();

  const listContainer = document.querySelector(".lists-grid-container");
  const listHtml = allLists.map(({ id, title }) => `
    <div id="delete-hover-parent" class='list-grid'>
    <div class="list-info">
      <li class='list-lists' id=${id}>${title}</li>
    </div>
    <div class="delete-boxes"> <a class='delete-list' id=${id}> - </a> </div>
    </div>
    `)

  listContainer.innerHTML = listHtml.join("");

  const listLists = document.querySelectorAll('.list-lists');

  // Gives each list ability to populate tasks in main container
  listLists.forEach((list) => {
    list.addEventListener('click', async (e) => {
      e.stopPropagation();
      const listId = list.id;

      const res = await fetch(`/lists/${listId}/tasks`);

      const { tasks } = await res.json();

      const tasksContainer = document.querySelector('.task-list');

      const listTitle = `
          <div class="list-title" id="${listId}">
            <h2 class="task-list-header">${list.innerText}</h2>
            <button class="edit-list-button edit-button-modal button-modal" id="${listId}">Edit List</button>
          </div>
          `

      const tasksHtml = tasks.map((task) => {
        if (task.Task.isCompleted === true) {
          return `
                <div class="task-info" id=${task.Task.id}>
                  <input type="checkbox" class="task-check-box" id=${task.Task.id} name=${task.Task.id} checked>
                  <label for=${task.Task.id} id=${task.Task.id} class="task-check-box">${task.Task.description}</label>
                </div>
              `
        } else {

          return `
                <div class="task-info" id=${task.Task.id}>
                  <input type="checkbox" class="task-check-box" id=${task.Task.id} name=${task.Task.id}>
                  <label for=${task.Task.id} id=${task.Task.id} class="task-check-box">${task.Task.description}</label>
                </div>
            `
        }
      })

      tasksContainer.innerHTML = listTitle + tasksHtml.join('');

      await editListEventListener();
      await addTaskInfoListeners();
    })
  })
}
