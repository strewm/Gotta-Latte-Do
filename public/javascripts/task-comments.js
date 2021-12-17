import { handleErrors, dateFormatter, commentDateFormatter } from "./utils.js";
import { fetchTasks } from './app.js';


const deleteTask = async (taskId) => {

    // await deleteAllComments(taskId);

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
        await fetchTasks();
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
        await fetchTask(taskId);
        await fetchComments(taskId);
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
    const taskHtml = `
        <div class='task-${task.id} task-container'>
            <div class='task-info-buttons'>
                <button id="task-info-x" class="task-butts">x</button>
                <div class='task-edit-delete-butts'>
                    <button id='edit-task-button-${task.id}' class="task-butts edit-task-button">Edit Task</button>
                    <button id='delete-task-button-${task.id}' class="task-butts">Delete Task</button>
                </div>
            </div>

            <div class='task-information-${task.id} task-information-container'>
                <p class='task-info-header'>${task.description}</p>
                <div class='task-completed-container'>
                    <label for="completedTask" class='task-completed-label'>Task Completed? </label>
                    <input type="checkbox" class="completedTask completed-task-${task.id}" name="completedTask">
                </div>
                <div class='due-container'>
                    <p class='due-container-label'>Due: </p>
                    <p class='due-container-content'>${due}</p>
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

    check.addEventListener('change', async(e) => {
        if (check.checked) {
            const res = await fetch(`/tasks/${task.id}`, {
                method: "PATCH",
                body: JSON.stringify({ "isCompleted": "true" }),
                headers: {
                    "Content-Type": "application/json",
                }
            })
        } else {
            const res = await fetch(`/tasks/${task.id}`, {
                method: "PATCH",
                body: JSON.stringify({ "isCompleted": "false" }),
                headers: {
                    "Content-Type": "application/json",
                }
            })
        }
    })




    const hideTaskInfoButt = document.querySelector('#task-info-x');
    const editTaskButt = document.querySelector(`.edit-task-button`);
    const editForm = document.querySelector('.edit-form');

    hideTaskInfoButt.addEventListener('click', async (e) => {
        taskInfo.hidden = true;
        editForm.hidden = true;

        // let stateObj = { id: "100" }
        // window.history.replaceState(stateObj, "Task", `/app`)
    })

    const deleteTaskButt = document.querySelector(`#delete-task-button-${task.id}`);

    deleteTaskButt.addEventListener('click', async(e) => {
        e.preventDefault();

        deleteTask(task.id);
        const taskInfo = document.querySelector(`.task-${task.id}`);
        taskInfo.hidden = true;
        editForm.hidden = true;

        const tasksDue = document.querySelector('.tasksDueValue');
        tasksDue.innerText = (Number(tasksDue.innerText) - 1).toString()

    })


    const form = document.createElement('form');
    form.setAttribute('class', 'edit-task');
    form.innerHTML = `
        <label for='description' class="task-label-headers">Edit Task</label>
        <input type='text' placeholder='${task.description}' id='description-task-${task.id}' class='description-task modal-input' name='description' required></input>
        <label for='dueDate' class="task-label-headers">Due Date</label>
        <input type='date' id='dueDate' class="modal-input" name='dueDate' required></input>
        <div>
        <label for='isCompleted' class="task-label-headers">Completed?</label>
        <input type='checkbox' id='checkbox' name='isCompleted'>
        </div>
        <div>
        <button class='editTaskButton button-modal' type='submit'>Edit Task
        </div>
    `

    const editFormHide = document.createElement('button');
    editFormHide.setAttribute('class', 'task-butts task-bottom');
    editFormHide.innerText = 'x'

    if (!editForm.children.length) {
        editForm.appendChild(editFormHide);
        editForm.appendChild(form);
        editForm.hidden = true;
    }

    const editTaskSubmit = document.querySelector('.editTaskButton');

    editFormHide.addEventListener('click', async(e) => {
        e.preventDefault();
        e.stopPropagation();
        editForm.hidden = true;
    })

    editTaskButt.addEventListener('click', async(e) => {
        e.preventDefault();
        e.stopPropagation();
        const editFormPlaceholder = document.querySelector(`.description-task`);
        editFormPlaceholder.placeholder = task.description;
        editForm.hidden = false;


            editTaskSubmit.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const formData = new FormData(document.querySelector('.edit-task'));
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
                    await editTask(taskId, body);
                    editForm.hidden = true;

                } catch (e) {
                    console.error(e);
                }
            })
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
            <span id='comment-${comment.id}' class='comment-user-message'>
                <span id='comment-${comment.id}-userId' class='comment-user'>
                    ${comment.User.username}
                </span>
                <span id='comment-${comment.id}-message' class='comment-message'>${comment.message}</span>
            </span>
            <div class='updatedAt-${comment.id} updated-At'>
                <div class='comment-date'>${commentDateFormatter(comment.updatedAt)}</div>
                <div class='comment-buttons-${comment.id} comment-buttons userId-${comment.userId}-${comment.id}'>
                    <div class="comment-buttons-dot comment-butts">•</div>
                    <button class='edit-comment-butt comment-butts' id='${comment.id}'>Edit</button>
                    <div class="comment-buttons-dot comment-butts">•</div>
                    <button class='delete-comment-butt comment-butts' id='${comment.id}'>Delete</button>
                </div>
            </div>
        </div>
    `
    )

    commentsDiv.innerHTML = commentsHtml.join("");

    // TODO: only show edit/delete if userId of comment matches logged in user

    const userRes = await fetch('/users/current')
    const { user } = await userRes.json();

    comments.forEach((comment) => {
        const editDeleteButtons = document.querySelector(`.userId-${comment.userId}-${comment.id}`);

        if (user.id === comment.userId) {
            editDeleteButtons.style.display="flex";
        } else {
            editDeleteButtons.style.display="none";
        }
    })

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
            const commentDate = document.querySelector(`.updatedAt-${commentId}`);
            comment.remove();
            commentDate.remove();
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
                    <input class='edit-comment-field' name='message' type='text' placeholder='${currMessage}'></input>
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
                <div class='updatedAt-${comment.id}'>
                    <span>${commentDateFormatter(comment.updatedAt)}</span>
                    <span class='comment-buttons-${comment.id}'>
                        <button class='edit-comment-butt' id='${comment.id}'>Edit
                        <button class='delete-comment-butt' id='${comment.id}'>Delete</button>
                    </span>
                </div>
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
