

export const fetchTask = async (taskId) => {
    const res = await fetch(`/tasks/${taskId}`);

    if (res.status === 401) {
        window.location.href = '/log-in';
        return;
    }

    const { task } = await res.json();
    const taskInfo = document.querySelector('.fiona');
    console.log('TASK', task, task.description);
    const taskHtml = `
        <div>
            <p>${task.description}</p>
            <p>${task.isCompleted}</p>
            <p>${task.dueDate}</p>
            <p>${task.givenTo}</p>
        </div>
    `

    taskInfo.innerHTML = taskHtml;
}
