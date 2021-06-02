// Get all tasks from local storage
function getTaskFromLocalStorage() {
    let tasks;
    if (!localStorage.getItem('_tasks_')) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('_tasks_'));
    }
    return tasks;
}

// Add new task in local storage
function addTaskInLocalStorage(task, color = '#e4c1f9') {
    const newTask = { task: task, color: color };

    const tasks = getTaskFromLocalStorage();

    tasks.push(newTask);
    localStorage.setItem('_tasks_', JSON.stringify(tasks));

    return newTask;
}

// Update color in Local storage
function updateColor(taskEl, color) {
    const taskIndex = +taskEl.querySelector('span').innerText - 1;
    const tasks = getTaskFromLocalStorage();
    tasks[taskIndex].color = color;
    localStorage.setItem('_tasks_', JSON.stringify(tasks));
}

// Remove specific task from local storage
function removeTaskFromLocalStorage(taskID) {
    const taskIndex = +taskID - 1;
    const tasks = getTaskFromLocalStorage();
    tasks.splice(taskIndex, 1);
    localStorage.setItem('_tasks_', JSON.stringify(tasks));
}

// Update task in local storage
function updateTaskInLocalStorage(taskEl) {
    const updateText = taskEl.querySelector('p').innerText;
    const updateIndex = +taskEl.querySelector('span').innerText - 1;
    const tasks = getTaskFromLocalStorage();
    tasks[updateIndex].task = updateText;
    localStorage.setItem('_tasks_', JSON.stringify(tasks));
}

export {
    getTaskFromLocalStorage,
    addTaskInLocalStorage,
    updateColor,
    removeTaskFromLocalStorage,
    updateTaskInLocalStorage,
};
