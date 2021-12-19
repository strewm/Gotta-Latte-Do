import { fetchTask } from "./task-info-container.js";
import { fetchLists } from "./lists.js"
import { fetchComments, postComment } from "./comments.js";


// Error handler
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
      return due = 'A Little Latte'
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


// Adds all of the event listeners back to each task, intended to be called after
// each time the task list is updated (add/edit/delete task)
export const addTaskInfoListeners = async () => {

  const taskInfoContainer = document.querySelectorAll('.task-info');

  taskInfoContainer.forEach( (task) => {
    task.addEventListener('click', async(e) => {
      e.stopPropagation();
      const taskId = task.id;

      const editForm = document.querySelector('.edit-form');
      editForm.hidden = true;
      editForm.style.display = 'none';
      const taskInfo = document.querySelector('.fiona');


      try {
        await fetchTask(taskId);

        if (taskInfo.classList.contains('task-information-animation') && e.target.id !== taskId) {
          taskInfo.classList.remove('task-information-animation');
        } else {
          taskInfo.hidden = false;
          setTimeout(() => {
            taskInfo.classList.add('task-information-animation');
          }, 0)
        }

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


// Adds all of the event listeners back to each list item, intended to be called after
// each time the list is updated (edit/add/delete list)
export const editListEventListener = async () => {
  const editListTitle = document.querySelector(".edit-list-button");
        editListTitle.addEventListener('click', async(e) => {
          let listId = e.target.id;

          const listToUpdate = await fetch(`/lists/${listId}`);

          const { listName } = await listToUpdate.json();

          const listForm = document.querySelector('.updateList');
          listForm.innerHTML = `
          <div class="cloud"></div>
          <div class="edit-list-pop">
            <h2 class="modal-header">Edit List Name</h2>
            <div id='list-edit'>
              <form class='list-edit-form modal-form'>
              <input type='text' class='list-edit modal-input' id='title' name='title' placeholder=${listName.title}>
              <label for='title' class='list-label'${listName.title} </label>
              <div>
              <button class='submitButton button-modal' id='${listId}'>Submit</button>

              <button class='editCancelButton button-modal' id='${listId}'>Cancel</button>
              </div>
              </form>
            </div>
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

            const listHeader = document.querySelector('.task-list-header');
            listHeader.innerText = list.title;

            listForm.innerHTML = '';
            await fetchLists();
          })


        const cancelButton = document.querySelector('.editCancelButton');
        cancelButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          listForm.innerHTML = '';
        })
      })
}
