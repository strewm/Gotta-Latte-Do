import { fetchTasks } from './fetch-tasks.js';
import { fetchComments } from './comments.js';
import { updateOverDueValue, dueDateFormatter, dateFormatter, updateTotalTaskValue, updateTasksCompletedValue, updateTaskListContainer } from './utils.js';
import { handleErrors } from './utils.js';

// Edit a task
export const editTask = async (taskId, body) => {
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



// Delete a task and updates task container list, as well as the overdue task value on the page
export const deleteTask = async (taskId) => {
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



// Fetch specific task container
export const fetchTask = async (taskId) => {
    const res = await fetch(`/tasks/${taskId}`);

    if (res.status === 401) {
        window.location.href = '/log-in';
        return;
    }

    const { task } = await res.json();

    let givenToUserText = '';
    if (task.givenTo) {
        const givenToUserRes = await fetch(`/tasks/${task.givenTo}/given-to`);
        const { givenToUser } = await givenToUserRes.json();
        givenToUserText = givenToUser.username;
    }

    const currUser = await fetch('/users/current');
    const { user } = await currUser.json();


    let givenByUserText = '';
    if (user.id !== task.userId) {
        const givenToUserRes = await fetch(`/tasks/${task.userId}/given-to`);
        const { givenToUser } = await givenToUserRes.json();
        givenByUserText = givenToUser.username;
    }

    const due = dueDateFormatter(task);

    // Return checked checkbox if the task is completed
    let checked;
    if (task.isCompleted) {
        checked = "on";
    } else {
        checked = "off";
    }



    // Task container contains Edit/Delete buttons, task message, task due date, task completion status, and a comment container
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
                <div class='due-completed-container'>
                    <div class='due-container'>
                        <p class='due-container-label'>Due: </p>
                        <p class='due-container-content'>${due}</p>
                    </div>
                    <div class='task-completed-container'>
                        <label for="completedTask" class='task-completed-label'>Task Completed? </label>
                        <input type="checkbox" class="completedTask completed-task-${task.id}" name="completedTask">
                    </div>
                </div>
                <div class='given-to-container' style='display: none' hidden>
                </div>
            </div>

            <div class='comment-container-${task.id}'>
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

    if (givenToUserText) {
        const givenToUserDiv = document.querySelector('.given-to-container');
        givenToUserDiv.innerHTML = `
            <p class='given-to-label'>Given To </p>
            <p class='given-to-username'>${givenToUserText}</p>
        `
        givenToUserDiv.style.display = 'flex';
        givenToUserDiv.hidden = false;
    }

    if (givenByUserText) {
        const givenToUserDiv = document.querySelector('.given-to-container');
        givenToUserDiv.innerHTML = `
            <p class='given-to-label'>Given By </p>
            <p class='given-to-username'>${givenByUserText}</p>
        `
        givenToUserDiv.style.display = 'flex';
        givenToUserDiv.hidden = false;
    }


    taskInfo.hidden = false;

    // If the task is overdue, style due date section to reflect overdue status
    const displayedDue = document.querySelector('.due-container-content');
    if (displayedDue.innerText === 'OVERDUE') {
        displayedDue.style.color = 'red';
        displayedDue.innerText = dateFormatter(task.dueDate)
        const dueLabel = document.querySelector('.due-container-label');
        dueLabel.innerText = 'A LITTLE LATTE'

    }


    // Updates the completed status of the task with a checkbox
    const check = document.querySelector('.completedTask');
    if (task.isCompleted) {
        check.checked = true;
    } else {
        check.checked = false;
    }

    check.addEventListener('change', async (e) => {
        if (check.checked) {
            await fetch(`/tasks/${task.id}`, {
                method: "PATCH",
                body: JSON.stringify({ "isCompleted": "true" }),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            await updateOverDueValue();
            await updateTotalTaskValue();
            await updateTasksCompletedValue();

        } else {
            const res = await fetch(`/tasks/${task.id}`, {
                method: "PATCH",
                body: JSON.stringify({ "isCompleted": "false" }),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            await updateOverDueValue();
            await updateTotalTaskValue();
            await updateTasksCompletedValue();
        }
    })


    // Add functionality to task info container buttons
    const hideTaskInfoButt = document.querySelector('#task-info-x');
    const editTaskButt = document.querySelector(`.edit-task-button`);
    const editForm = document.querySelector('.edit-form');

    // Hides the task info container and removes animation class so it can be applied to next opened task
    hideTaskInfoButt.addEventListener('click', async (e) => {

        // editForm.hidden = true;
        // editForm.style.display = 'none';
        taskInfo.hidden = true;
        taskInfo.classList.remove('task-information-animation')


    })

    // Deleting a task hides the container
    const deleteTaskButt = document.querySelector(`#delete-task-button-${task.id}`);
    deleteTaskButt.addEventListener('click', async (e) => {
        e.preventDefault();

        deleteTask(task.id);
        const taskInfo = document.querySelector(`.task-${task.id}`);
        taskInfo.hidden = true;

        const fionaDiv = document.querySelector('.fiona');
        fionaDiv.classList.remove('task-information-animation');
    })

    // Create the form to edit the task
    editForm.innerHTML = `
            <label for='description' class="task-label-headers modal-header">Edit Task</label>
            <input type='text' value='${task.description}' id='description-task-${task.id}' class='description-task modal-input' name='description' required></input>
            <label for='dueDate' class="task-label-headers">Due Date</label>
            <input type='datetime-local' id='dueDate' class="modal-input" name='dueDate' value='${task.dueDate.slice(0, 16)}' required></input>
            <label for='isCompleted' class="task-label-headers">Completed?</label>
            <input type='checkbox' id='checkbox' name='isCompleted'>
            <button class='editTaskButton button-modal' type='submit'>Edit Task
    `

    const editFormHide = document.createElement('button');
    editFormHide.classList.add('button-modal');
    editFormHide.setAttribute('id', 'edit-task-hide')
    const cancelText = document.createTextNode('Cancel');
    editFormHide.appendChild(cancelText);

    // Prevents more than one edit form hide button being appended to the document
    if (!editForm.children[0].length) {
        editForm.appendChild(editFormHide);
        editForm.hidden = true;
    }

    // Functionality to edit task button(s)
    const editTaskSubmit = document.querySelector('.editTaskButton');

    editFormHide.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        editForm.hidden = true;
        editForm.style.display = "none";
        const cloud = document.querySelector('.cloud');
        cloud.hidden = true;
    })

    editTaskButt.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const editFormPlaceholder = document.querySelector(`.description-task`);
        editFormPlaceholder.value = task.description;
        editForm.hidden = false;
        editForm.style.display = 'block';
        const cloud = document.querySelector('.cloud');
        cloud.hidden = false;

        // Submission of an edited task
        editTaskSubmit.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const formData = new FormData(document.querySelector('.edit-form'));
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
                editForm.style.display = 'none'
                cloud.hidden = true;

            } catch (e) {
                console.error(e);
            }
        })
    })

}
