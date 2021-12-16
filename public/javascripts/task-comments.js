import { handleErrors, dateFormatter } from "./utils.js";
import { fetchTasks } from './app.js';

const deleteAllComments = async (taskId) => {
    const commentsDiv = document.querySelector(`#comments-${taskId}`);
    const commentsDivChildren = commentsDiv.children;

    for (let i = 0; i < commentsDivChildren.length; i++) {
        let commentId = commentsDivChildren[i].children[0].id;
        let arr = commentId.split('-');
        let id = arr[arr.length - 1];

        try {
            const res = await fetch(`/comments/${id}`, {
                method: "DELETE",
            })

            if (res.status === 401) {
                window.location.href = "/log-in";
                return;
              }
            if (!res.ok) {
                throw res;
              }
            } catch (err) {
                handleErrors(err)
            }
    }

    return;

}

const deleteTask = async (taskId) => {

    await deleteAllComments(taskId);

    try {
        const res = await fetch(`/tasks/${taskId}`, {
            method: "DELETE",
        })

        if (res.status === 401) {
            window.location.href = "/log-in";
            return;
          }
        if (!res.ok) {
            throw res;
          }
          await fetchTasks(taskId);
          return;
        } catch (err) {
            handleErrors(err)
        }
}

const editTask = async (taskId, body) => {
    try {
        const res = await fetch(`/tasks/${taskId}`, {
            method: "PUT",
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
          await fetchTasks();
        } catch (err) {
            handleErrors(err)
        }
}




export const fetchTask = async (taskId) => {
    const res = await fetch(`/tasks/${taskId}`);

    if (res.status === 401) {
        window.location.href = '/log-in';
        return;
    }

    const { task } = await res.json();

    const due = dateFormatter(task);

    let checked;

    if (task.isCompleted) {
        checked = "on";
    } else {
        checked = "off";
    }

    const taskInfo = document.querySelector('.fiona');
    // if (!task.givenTo) task.givenTo = '';
    const taskHtml = `
        <div class='task-${task.id} task-container'>
            <div class='task-info-buttons'>
                <button id="task-info-x" class="task-butts">x</button>
                <div class='task-edit-delete-butts'>
                    <button id='edit-task-button-${task.id}' class="task-butts">Edit Task</button>
                    <button id='delete-task-button-${task.id}' class="task-butts">Delete Task</button>
                </div>
            </div>

            <div class='task-information-${task.id} task-information-container'>
                <p class='task-info-header'>${task.description}</p>
                <div class='task-completed-container'>
                    <label for="completedTask" class='task-completed-label'>Task Completed? </label>
                    <input type="checkbox" class="completedTask" name="completedTask">
                </div>
                <div class='due-container'>
                    <p>Due: </p>
                    <p>${due}</p>
                </div>
            </div>

            <div class='comment-container-${task.id}'>
                <p class='comment-header'>Comments:</p>
                <form class='create-comment'>
                    <label for='message'></label>
                    <input name='message' type='text' placeholder='Add a comment...' class='add-comment-field'></input>
                    <input type='hidden' name='taskId' id='${task.id}' value=${task.id}></input>
                    <button type='submit' role='button' class='add-comment-butt'>Add Comment</button>
                </form>
            </div>

            <div id='comments-${task.id}'></div>
        </div>
    `

    taskInfo.innerHTML = taskHtml;
    taskInfo.hidden = false;

    const check = document.querySelector('.completedTask');

    if (task.isCompleted) {
        check.checked = true;
    } else {
        check.checked = false;
    }

    const hideTaskInfoButt = document.querySelector('#task-info-x');

    hideTaskInfoButt.addEventListener('click', async (e) => {
        taskInfo.hidden = true;

        // let stateObj = { id: "100" }
        // window.history.replaceState(stateObj, "Task", `/app`)
    })

    const deleteTaskButt = document.querySelector(`#delete-task-button-${task.id}`);

    deleteTaskButt.addEventListener('click', async(e) => {
        e.preventDefault();

        deleteTask(task.id);
        const taskInfo = document.querySelector(`.task-${task.id}`);
        taskInfo.hidden = true;
    })

    const editTaskButt = document.querySelector(`#edit-task-button-${task.id}`);

    editTaskButt.addEventListener('click', async(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('EDIT CLICK')
        editTaskButt.disabled = true;

        try {

            const editForm = document.querySelector('.edit-form');

            const form = document.createElement('form');
            form.setAttribute('class', 'edit-task');
            form.innerHTML = `
                <label for='description'></label>
                <input type='text' placeholder='${task.message}' id='description' name='description' required></input>
                <label for='dueDate'>Due Date</label>
                <input type='date' id='dueDate' name='dueDate' required></input>
                <label for='isCompleted'>Completed?</label>
                <input type='checkbox' id='checkbox' name='isComplicated'>
                <button class='editTaskButton' type='submit'>Edit Task</button>
            `
            editForm.appendChild(form);

            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const formData = new FormData(form);
                const description = formData.get('description');
                const dueDate = formData.get('dueDate');
                const checkStatus = formData.get('isCompleted');
                let isCompleted;

                if (checkStatus === 'on') {
                    isCompleted = true;
                } else {
                    isCompleted = false;
                }

                const body = { description, dueDate, isCompleted };

                try {
                    editTask(taskId, body);
                    editForm.removeChild(form);
                    editTaskButt.disabled = false;

                } catch (e) {
                    console.error(e);
                }
            })


        } catch (e) {
            console.error(e);
        }
    })

}

export const fetchComments = async (taskId) => {
    const res = await fetch(`/tasks/${taskId}/comments`);
    if (res.status === 401) {
        window.location.href = '/log-in';
        return;
    }

    const { comments } = await res.json();

    const commentsDiv = document.querySelector(`#comments-${taskId}`);
    const commentsHtml = comments.map((comment) => `
        <div class="comment-container-${comment.id} comment-container">
            <span id='comment-${comment.id}'>
                <span id='comment-${comment.id}-userId' class='comment-user'>
                    ${comment.User.username}:
                </span>
                <span id='comment-${comment.id}-message' class='comment-message'>${comment.message}</span>
            </span>
            <span class='comment-buttons-${comment.id} comment-buttons'>
                <button class='edit-comment-butt comment-butts' id='${comment.id}'>Edit</button>
                <button class='delete-comment-butt comment-butts' id='${comment.id}'>Delete</button>
            </span>
        </div>
        <div class='createdAt'>${comment.createdAt}</div>
    `
    )

    commentsDiv.innerHTML = commentsHtml.join("");

    // TODO: only show edit/delete if userId of comment matches logged in user



    const deleteComments = document.querySelectorAll('.delete-comment-butt');

    for (let i = 0; i < deleteComments.length; i++) {
        const deleteButton = deleteComments[i];
        deleteButton.addEventListener('click', async(e) => {
            e.preventDefault();
            const commentId = e.target.id;
            const res = await fetch(`/comments/${commentId}`, {
                method: 'DELETE'
            })

            const comment = document.querySelector(`.comment-container-${commentId}`);
            comment.remove();
        })
    }

    const editComments = document.querySelectorAll('.edit-comment-butt');

    for (let i = 0; i < editComments.length; i++) {
        const editButton = editComments[i];
        editButton.addEventListener('click', async(e) => {
            e.preventDefault();
            const commentId = e.target.id;
            const messageSpan = document.querySelector(`#comment-${commentId}-message`);

            const currMessage = messageSpan.innerText;

            messageSpan.innerHTML = `
                <form class='edit-comment'>
                    <label for='message'></label>
                    <input type='hidden' name='taskId' id='${taskId}' value=${taskId}></input>
                    <input name='message' type='text' placeholder='${currMessage}'></input>
                    <button type='submit' class='submit-edit-comment-butt' id='${commentId}'>Edit Comment
                </form>
            `

            const commentButtons = document.querySelector(`.comment-buttons-${commentId}`);
            commentButtons.innerHTML = `
                <span class='comment-buttons-${commentId}'>
                </span>
            `

            const submitEdit = document.querySelector(`.submit-edit-comment-butt`);

            submitEdit.addEventListener('click', async(e) => {
                e.preventDefault();
                e.stopPropagation();
                const newMessageForm = new FormData(document.querySelector('.edit-comment'));
                const message = newMessageForm.get("message");
                const taskId = newMessageForm.get("taskId");
                console.log(taskId)

                const body = { message };

                const res = await fetch(`/comments/${commentId}`, {
                    method: "PUT",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                const { comment } = await res.json();


                const commentContainer = document.querySelector(`.comment-container-${comment.id}`);
                // const userId = document.querySelector(`#comment-${comment.id}-userId`).innerText
                commentContainer.innerHTML = `
                <span id='comment-${comment.id}'>
                    ${comment.User.id}
                    <span id='comment-${comment.id}-message'>${comment.message}</span>
                </span>
                <span class='comment-buttons-${comment.id}'>
                    <button class='edit-comment-butt' id='${comment.id}'>Edit
                    <button class='delete-comment-butt' id='${comment.id}'>Delete</button>
                </span>
                `
                await fetchComments(taskId);
            })
        })
    }
}


export const postComment = async (taskId, body) => {

    const createComment = document.querySelector('.create-comment');

    try {
        const res = await fetch(`/tasks/${taskId}/comments`, {
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
          createComment.reset();
          await fetchComments(taskId);
        } catch (err) {
            handleErrors(err)
        }
}


export const deleteComment = async (commentId) => {
    try {
        const res = await fetch(`/comments/${commentId}`, {
            method: "DELETE",
        })

        if (res.status === 401) {
            window.location.href = "/log-in";
            return;
          }
        if (!res.ok) {
            throw res;
          }
          await fetchComments(taskId);
        } catch (err) {
            handleErrors(err)
        }
}

export const editComment = async (commentId, body) => {
    try {
        const res = await fetch(`/comments/${commentId}`, {
            method: "PUT",
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
          await fetchComments(taskId);
        } catch (err) {
            handleErrors(err)
        }

    }
