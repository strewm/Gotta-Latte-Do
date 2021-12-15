import { handleErrors, dateFormatter } from "./utils.js";
import { fetchTasks } from './app.js';


const deleteTask = async (taskId) => {
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

    const taskInfo = document.querySelector('.fiona');
    if (!task.givenTo) task.givenTo = '';
    const taskHtml = `
        <div class='task-${task.id} task-info' style="margin-left: 300px">
            <div class='task-info-buttons'>
                <button id="task-info">X</button>
                <button id='edit-task-button-${task.id}'>Edit Task</button>
                <button id='delete-task-button-${task.id}'>Delete Task</button>
            </div>

            <div class='task-information-${task.id}'>
                <p>${task.description}</p>
                <p>Task Completed? ${task.isCompleted}</p>
                <p>Due: ${due}</p>
                <p>${task.givenTo}</p>
            </div>

            <div class='comment-container-${task.id}'>
                <p>Comments</p>
                <form class='create-comment'>
                    <label for='message'></label>
                    <input name='message' type='text' placeholder='Add a comment...'></input>
                    <input type='hidden' name='taskId' id='${task.id}' value=${task.id}></input>
                    <button type='submit' role='button'>Add Comment</button>
                </form>
            </div>

            <div id='comments-${task.id}'></div>
        </div>
    `

    taskInfo.innerHTML = taskHtml;
    taskInfo.hidden = false;

    const hideTaskInfoButt = document.querySelector('#task-info');

    hideTaskInfoButt.addEventListener('click', async (e) => {
        taskInfo.hidden = true;

        let stateObj = { id: "100" }
        window.history.replaceState(stateObj, "Task", `/app`)
    })

    const deleteTaskButt = document.querySelector(`#delete-task-button-${task.id}`);

    deleteTaskButt.addEventListener('click', async(e) => {
        e.preventDefault();

        deleteTask(task.id);
        const taskInfo = document.querySelector(`.task-${task.id}`);
        taskInfo.hidden = true;
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
    const commentsHtml = comments.map(({ id, userId, message }) => `
        <div class="comment-container-${id} comment-container">
            <span id='comment-${id}'>
                <span id='comment-${id}-userId' class='comment-user'>
                    ${userId}:
                </span>
                <span id='comment-${id}-message' class='comment-message'>${message}</span>
            </span>
            <span class='comment-buttons-${id} comment-buttons'>
                <button class='edit-comment-butt' id='${id}'>Edit
                <button class='delete-comment-butt' id='${id}'>Delete</button>
            </span>
        </div>
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


                const commentContainer = document.querySelector(`.comment-container-${commentId}`);
                const userId = document.querySelector(`#comment-${commentId}-userId`).innerText
                commentContainer.innerHTML = `
                <span id='comment-${commentId}'>
                    ${userId}
                    <span id='comment-${commentId}-message'>${message}</span>
                </span>
                <span class='comment-buttons-${commentId}'>
                    <button class='edit-comment-butt' id='${commentId}'>Edit
                    <button class='delete-comment-butt' id='${commentId}'>Delete</button>
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
