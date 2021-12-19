import { fetchTasks } from './fetch-tasks.js';
import { fetchComments } from './comments.js';
import { dateFormatter } from './utils.js';
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



// Delete Task

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

        editForm.hidden = true;
        editForm.style.display = 'none';
        taskInfo.hidden = true;
        taskInfo.classList.remove('task-information-animation')

        await fetchTasks();

    })

    const deleteTaskButt = document.querySelector(`#delete-task-button-${task.id}`);

    deleteTaskButt.addEventListener('click', async(e) => {
        e.preventDefault();

        deleteTask(task.id);
        const taskInfo = document.querySelector(`.task-${task.id}`);
        taskInfo.hidden = true;
        editForm.hidden = true;
        editForm.style.display = 'none';

        const tasksDue = document.querySelector('.tasksDueValue');
        tasksDue.innerText = (Number(tasksDue.innerText) - 1).toString()

        const fionaDiv = document.querySelector('.fiona');
        fionaDiv.classList.remove('task-information-animation');


    })


    // const form = document.createElement('form');
    // form.setAttribute('class', 'edit-task');
    // const form = document.querySelector('.edit-form')
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


    if (!editForm.children[0].length) {
        editForm.appendChild(editFormHide);

        editForm.hidden = true;
    }

    const editTaskSubmit = document.querySelector('.editTaskButton');

    editFormHide.addEventListener('click', async(e) => {
        e.preventDefault();
        e.stopPropagation();
        editForm.hidden = true;
        editForm.style.display = "none";
        const cloud = document.querySelector('.cloud');
        cloud.hidden = true;
    })

    editTaskButt.addEventListener('click', async(e) => {
        e.preventDefault();
        e.stopPropagation();
        const editFormPlaceholder = document.querySelector(`.description-task`);
        editFormPlaceholder.value = task.description;
        editForm.hidden = false;
        editForm.style.display = 'block';
        const cloud = document.querySelector('.cloud');
        cloud.hidden = false;

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
