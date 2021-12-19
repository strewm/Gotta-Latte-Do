import { addTaskInfoListeners } from "./utils.js";

// fetch user's tasks (all)
export const fetchTasks = async () => {
  const res = await fetch("/tasks")

  if (res.status === 401) {
    window.location.href = "/log-in";
    return;
  }

  const { tasks, user } = await res.json();

  const tasksListContainer = document.querySelector(".task-list");
  const listName = `
  <h2 class="task-list-header">All of <strong>${user.username}'s</strong> self-assigned tasks.</h2>
  `
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


// fetch assigned tasks
export const fetchAssignTasks = async () => {
  const res = await fetch("/tasks/assigned")

  if (res.status === 401) {
    window.location.href = "/log-in";
    return;
  }

  const { tasks } = await res.json();

  const assignedTaskContainer = document.querySelector(".assigned-list");
  if (tasks) {
    const listName = `
      <h2 class="task-list-header">All tasks assigned to <strong></strong> by others.</h2>
      `
    const tasksHtml = tasks.map(({ id, description, User }) => `
      <div class="assigned-grid">
      <div class="task-info" id=${id}>
          <input type="checkbox" class="task-check-box" id=${id} name=${id}>
          <label for=${id} id=${id} class="task-check-box">${description}</label>
      </div>
      <div>
        <strong>Assigned by: ${User.username}</strong>
      </div>
      </div>
      `)

    assignedTaskContainer.innerHTML = listName + tasksHtml.join("")

    await addTaskInfoListeners();
  }

}


// fetch user's incomplete tasks
export const fetchIncompleteTasks = async () => {
  const res = await fetch("/tasks/incomplete")

  if (res.status === 401) {
    window.location.href = "/log-in";
    return;
  }

  const { tasks, user } = await res.json();

  const tasksListContainer = document.querySelector(".task-list");
  const listName = `
    <h2 class="task-list-header"><strong>${user.username}'s</strong> incomplete tasks.</h2>
    `
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


// fetch user's completed tasks
export const fetchCompletedTasks = async () => {
  const res = await fetch("/tasks/complete")

  if (res.status === 401) {
    window.location.href = "/log-in";
    return;
  }

  const { tasks, user } = await res.json();

  const tasksListContainer = document.querySelector(".task-list");
  const listName = `
    <h2 class="task-list-header"><strong>${user.username}'s</strong> completed tasks.</h2>
    `
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
