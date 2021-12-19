import { addTaskInfoListeners } from "./utils.js";
import { handleErrors } from './utils.js';

// fetch user's search query

export const search = async (searchValue) => {

    const res = await fetch(`/search/${searchValue}`, {
      method: "GET"
    })

    const { results } = await res.json();
    if (res.status === 401) {
      window.location.href = "/log-in";
      return;
    }


  const tasksListContainer = document.querySelector(".task-list");
  const listName = `
  <h2 class="task-list-header">Search Results</h2>
  `
  const tasksHtml = results.map(({ id, description, isCompleted, Lists }) => {
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
