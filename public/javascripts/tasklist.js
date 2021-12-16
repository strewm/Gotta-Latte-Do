
const listContainer = document.querySelector('.lists-grid-container');

listContainer.addEventListener('click', async (e) => {
  e.stopPropagation();
  const listId = e.target.id;

  const res = await fetch(`/lists/${listId}/tasks`);

  const { tasks } = res.json();

  const tasksContainer = document.querySelector('.tanner');

  const listTitle = `
  <h2 class="task-list-header">${tasks[0].List.title}</h2>
  `

  const tasksHtml = tasks.map(({ id, description }) => `
    <div class="task-info">
      <input type="checkbox" class="task-check-box" id=${id} name=${id}>
      <label for=${id} id=${id} class="task-check-box">${description}</label>
    </div>
  `)

  tasksContainer.innerHTML = listTitle + tasksHtml.join('');

})
