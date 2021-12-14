

export const fetchTask = async (taskId) => {
    const res = await fetch(`/tasks/${taskId}`);

    if (res.status === 401) {
        window.location.href = '/log-in';
        return;
    }

    const { task } = await res.json();
    const taskInfo = document.querySelector('.fiona');
    console.log('TASK', task, task.description);
    if (!task.givenTo) task.givenTo = '';
    const taskHtml = `
        <div id='task-${task.id}' style="margin-left: 300px">
            <p>${task.description}</p>
            <p>Task Completed? ${task.isCompleted}</p>
            <p>Due: ${task.dueDate}</p>
            <p>${task.givenTo}</p>

            <p>Comments</p>
            <button type='submit' role='button'>Add Comment</button>
            <div id='comments-${task.id}'>
            </div>
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

    const { comments } = await res.json;

    const commentsDiv = document.querySelector(`comments-${taskId}`);
    const commentsHtml = comments.map(({ id, userId, message }) => `
        <div class="comment-info">
            <p id='comment-${id}'>
                ${userId}:
                <span>${message}</span>
            </p>
        </div>
    `
    )

    commentsDiv.innerHTML = commentsHtml.join("");

}
