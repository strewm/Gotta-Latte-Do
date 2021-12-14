import { handleErrors } from "./utils.js";

export const fetchTask = async (taskId) => {
    const res = await fetch(`/tasks/${taskId}`);

    if (res.status === 401) {
        window.location.href = '/log-in';
        return;
    }

    const { task } = await res.json();
    const taskInfo = document.querySelector('.fiona');
    if (!task.givenTo) task.givenTo = '';
    const taskHtml = `
        <div id='task-${task.id}' style="margin-left: 300px">
            <p>${task.description}</p>
            <p>Task Completed? ${task.isCompleted}</p>
            <p>Due: ${task.dueDate}</p>
            <p>${task.givenTo}</p>

            <p>Comments</p>
            <form class='create-comment'>
                <label for='message'></label>
                <input name='message' type='text' placeholder='Add a comment...'></input>
                <input type='hidden' name='taskId' id='${task.id}' value=${task.id}></input>
                <button type='submit' role='button'>Add Comment</button>
            </form>
            <div id='comments-${task.id}'></div>
        </div>
    `

    taskInfo.innerHTML = taskHtml;
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
        <div class="comment-container-${id}">
            <p id='comment-${id}'>
                ${userId}:
                <span>${message}</span>
            <span class='comment-buttons'>
                <button class='edit-comment-butt' id='${id}'>Edit
                <button class='delete-comment-butt' id='${id}'>Delete</button>
            </span>
            </p>
        </div>
    `
    )

    commentsDiv.innerHTML = commentsHtml.join("");

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
