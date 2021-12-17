import { fetchTask, fetchComments, postComment } from "./task-comments.js";
import { fetchLists } from "./app.js"

export const handleErrors = async (err) => {
    if (err.status >= 400 && err.status < 600) {
      const errorJSON = await err.json();
      const errorsContainer = document.querySelector(".errors-container");
      let errorsHtml = [
        `
          <div class="alert alert-danger">
              Something went wrong. Please try again.
          </div>
        `,
      ];
      const { errors } = errorJSON;
      if (errors && Array.isArray(errors)) {
        errorsHtml = errors.map(
          (message) => `
            <div class="alert alert-danger">
                ${message}
            </div>
          `
        );
      }
      errorsContainer.innerHTML = errorsHtml.join("");
    } else {
      alert(
        "Something went wrong. Please check your internet connection and try again!"
      );
    }
  };

export const editListEventListener = async () => {
  const editListTitle = document.querySelector(".edit-list-button");
        editListTitle.addEventListener('click', async(e) => {
          let listId = e.target.id;

          const listToUpdate = await fetch(`/lists/${listId}`);

          const { listName } = await listToUpdate.json();

          const listTitle = document.querySelector('.list-title');
          listTitle.innerHTML = `
            <h2>Edit List Name</h2>
            <div id='list-edit'>
              <form class='list-edit-form'>
              <input type='text' class='list-edit' id='title' name='title' placeholder=${listName.title}>
              <label for='title' class='list-label'${listName.title} </label>
              <div>
              <button class='submitButton' id='${listId}'>Submit</button>
              </div>
              <div>
              <button class='editCancelButton' id='${listId}'>Cancel</button>
              </div>
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
            const updatedList = await fetch(`/lists/${listId}`, {
              method: 'PATCH',
              body: JSON.stringify(body),
              headers: {
                'Content-Type': 'application/json'
              }
            })

            const { list } = await updatedList.json();

            listTitle.innerHTML = `
              <div class="list-title" id="${listId}">
                <h2 class="task-list-header">${list.title}</h2>
                <button class="edit-list-button" id="${listId}">Edit List</button>
              </div>
            `;
            await fetchLists();
          })


        const cancelButton = document.querySelector('.editCancelButton');
        cancelButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          listTitle.innerHTML = `
            <div class="list-title" id="${listId}">
              <h2 class="task-list-header">${listName.title}</h2>
              <button class="edit-list-button" id="${listId}">Edit List</button>
            </div>
          `;
        })
      })
}



// This function checks the dueDate selected for the task
// If the task is due today, it changes the task info "due" text to "Today", same for "Tomorrow"
// If the task is due in the past, it changes it to "OVERDUE!"
// Otherwise, it writes the due date as a date in yyyy-mm-dd format.

export const dateFormatter = (task) => {

  let today = new Date();
  let tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1)

  let ddToday = String(today.getDate()).padStart(2, '0');
  let mmToday = String(today.getMonth() + 1).padStart(2, '0');
  let yyyyToday = today.getFullYear();

  let ddTom = String(tomorrow.getDate()).padStart(2, '0');
  let mmTom = String(tomorrow.getMonth() + 1).padStart(2, '0');
  let yyyyTom = tomorrow.getFullYear();

  today = yyyyToday + '-' + mmToday + '-' + ddToday;
  tomorrow = yyyyTom + '-' + mmTom + '-' + ddTom;

  let selectedDate = task.dueDate.slice(0,10).replace(/-/g, '/');
  selectedDate = new Date(selectedDate);
  let diff = new Date().getTime() - selectedDate.getTime();

  let due = task.dueDate.slice(0,10);


  if (due === today) {
      return due = 'Today';
  }

  if (due === tomorrow) {
      return due = 'Tomorrow';
  }

  if (diff > 0) {
      return due = 'OVERDUE!'
  }

  return due;
}



// Formats the createdAt date and time of a comment to a nice format, e.g. 'Dec 14 01:28'
export const commentDateFormatter = (createdAt) => {
  let createdAtDate = createdAt.slice(0,10).replace(/-/g, '/');
  createdAtDate = new Date(createdAt);
  createdAtDate = createdAtDate.toDateString();
  createdAtDate = createdAtDate.slice(4, 10);

  let createdAtTime = createdAt.slice(11, 16);

  return `${createdAtDate} ${createdAtTime}`

}



export const addTaskInfoListeners = async () => {

  const taskInfoContainer = document.querySelectorAll('.task-info');

  taskInfoContainer.forEach( (task) => {
    task.addEventListener('click', async(e) => {
      e.stopPropagation();
      const taskId = task.id;

      const editForm = document.querySelector('.edit-form');
      editForm.hidden = true;

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
  })


}
