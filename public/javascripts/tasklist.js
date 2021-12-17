const listLists = document.querySelectorAll('.list-lists');

listLists.forEach((list) => {
  list.addEventListener('click', async(e) => {
    e.stopPropagation();
    const listId = e.target.id;

    const res = await fetch(`/lists/${listId}/tasks`);

    const { tasks } = await res.json();

    const tasksContainer = document.querySelector('.task-list');

    const listTitle = `
      <h2 class="task-list-header">${tasks[0].List.title}</h2>
    `

    const tasksHtml = tasks.map((task) => `
      <div class="task-info">
        <input type="checkbox" class="task-check-box" id=${task.Task.id} name=${task.Task.id}>
        <label for=${task.Task.id} id=${task.Task.id} class="task-check-box">${task.Task.description}</label>
      </div>
    `)

    tasksContainer.innerHTML = listTitle + tasksHtml.join('');
  })
})
