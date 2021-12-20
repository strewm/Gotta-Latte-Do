import { fetchUser } from './user.js';
import { dateFormatter } from './utils.js';
import { handleErrors } from './utils.js';


// Fetch all comments for a task
export const fetchComments = async (taskId) => {
    const res = await fetch(`/tasks/${taskId}/comments`);
    if (res.status === 401) {
        window.location.href = '/log-in';
        return;
    }

    const { comments } = await res.json();

    // Each comment contains the username of the user who created the comment,
    // the date and time the comment was updated, and edit/delete buttons
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
                <div class='comment-date'>${dateFormatter(comment.updatedAt)}</div>
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

    // Only show edit/delete buttons for comments made by the logged in user
    const user = await fetchUser();

    comments.forEach((comment) => {
        const editDeleteButtons = document.querySelector(`.userId-${comment.userId}-${comment.id}`);

        if (user.id === comment.userId) {
            editDeleteButtons.style.display = "flex";
        } else {
            editDeleteButtons.style.display = "none";
        }
    })

    // Add delete functionality to the delete comment button
    const deleteComments = document.querySelectorAll('.delete-comment-butt');

    for (let i = 0; i < deleteComments.length; i++) {
        const deleteButton = deleteComments[i];
        deleteButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const commentId = e.target.id;
            await fetch(`/comments/${commentId}`, {
                method: 'DELETE'
            })

            const comment = document.querySelector(`.comment-container-${commentId}`);
            const commentDate = document.querySelector(`.updatedAt-${commentId}`);
            comment.remove();
            commentDate.remove();
        })
    }

    // Add edit functionality to the edit comment button
    const editComments = document.querySelectorAll('.edit-comment-butt');

    for (let i = 0; i < editComments.length; i++) {
        const editButton = editComments[i];
        editButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const commentId = e.target.id;
            const messageSpan = document.querySelector(`#comment-${commentId}-message`);

            const currMessage = messageSpan.innerText;

            messageSpan.innerHTML = `
                <form class='edit-comment'>
                    <label for='message'></label>
                    <input type='hidden' name='taskId' id='${taskId}' value=${taskId}></input>
                    <input class='edit-comment-field' name='message' type='text' value='${currMessage}'></input>
                    <button type='submit' class='submit-edit-comment-butt' id='${commentId}'>Edit Comment
                </form>
            `

            const commentButtons = document.querySelector(`.comment-buttons-${commentId}`);
            commentButtons.innerHTML = `
                <span class='comment-buttons-${commentId}'>
                </span>
            `

            // Add submit functionality for the edited comment
            const submitEdit = document.querySelector(`.submit-edit-comment-butt`);

            submitEdit.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const newMessageForm = new FormData(document.querySelector('.edit-comment'));
                const message = newMessageForm.get("message");
                const taskId = newMessageForm.get("taskId");

                const body = { message };

                const comment = await editComment(commentId, body);

                // Update comment message
                const commentContainer = document.querySelector(`.comment-container-${comment.id}`);
                commentContainer.innerHTML = `
                <span id='comment-${comment.id}'>
                    ${comment.User.id}
                    <span id='comment-${comment.id}-message'>${comment.message}</span>
                </span>
                <div class='updatedAt-${comment.id}'>
                    <span>${dateFormatter(comment.updatedAt)}</span>
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


// Post a new comment on a task
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


// Delete a comment on a task
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


// Edit a comment on a task
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

        const { comment } = await res.json();
        return comment;

    } catch (err) {
        handleErrors(err)
    }

}
