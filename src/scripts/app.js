import { createElement } from './helper';

const taskInput = document.querySelector('#task-input');
const taskContainer = document.querySelector('#task-container');
const colorPalette = ['#e56b6f', '#ffe66d', '#06d6a0', '#8ecae6', '#ffb5a7'];
const allTasks = JSON.parse(localStorage.getItem('_tasks_'));
const allColors = JSON.parse(localStorage.getItem('_colors_'));

window.addEventListener('DOMContentLoaded', () => {
    // if any old tasks exist in local storage then add them to task container
    if (allTasks && allColors) {
        allTasks.forEach((task) => {
            createTask(taskContainer, task);
        });
    }

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (e.target.value.trim()) {
                let newTask = saveTasks(e.target.value);
                let newColor = saveColors();
                createTask(taskContainer, newTask, newColor);
                e.target.value = '';
            } else {
                alert('Invalid Input Field');
                e.target.value = '';
            }
        }
    });
});

// Create task with input value
function createTask(parent, inputValue, color) {
    let column = createElement({ class: 'col-md-4' });
    let taskField = createElement({ class: 'task d-flex' });
    taskField.style.background = color;

    // <p>{inputValue}</p>
    let taskText = createElement('p');
    taskText.innerHTML = inputValue;
    taskField.appendChild(taskText);

    // <i class="far fa-times-circle ms-auto" ></i>
    let taskDelete = createElement('i', {
        class: 'far fa-times-circle ms-auto',
    });
    taskDelete.addEventListener('click', () => {
        parent.removeChild(column);
    });
    taskField.appendChild(taskDelete);

    let controlPanel = createTaskController(taskField);
    controlPanel.style.display = 'none';
    taskField.appendChild(controlPanel);

    // When mouseover in taskField, controlPanel Show
    taskField.addEventListener('mouseover', () => {
        controlPanel.style.display = 'flex';
    });

    // When mouseout from taskField, controlPanel Hide
    taskField.addEventListener('mouseout', () => {
        controlPanel.style.display = 'none';
    });

    column.appendChild(taskField);
    parent.appendChild(column);
}

// Create task controller for edit and change background-color of each task
function createTaskController(parent) {
    let controller = createElement({ class: 'control-panel' });

    // Create palette
    let colorPalette = createColorPalette(parent);
    controller.appendChild(colorPalette);

    // Edit button
    let editBtn = createEditBtn(parent);
    controller.appendChild(editBtn);

    return controller;
}

// Create color palette with some color circle
function createColorPalette(task) {
    let colorContainer = createElement({ class: 'color-palette' });

    colorPalette.forEach((color) => {
        let colorCircle = document.createElement('div');
        colorCircle.style.background = color;
        colorCircle.addEventListener('click', () => {
            task.style.background = color;
        });
        colorContainer.appendChild(colorCircle);
    });

    return colorContainer;
}

// Create edit button for each task
function createEditBtn(task) {
    let editBtn = createElement('i', { class: 'far fa-edit ms-auto' });

    editBtn.addEventListener('click', () => {
        let oldText = task.querySelector('p');
        let textArea = createElement('textarea', { class: 'edit-text' });

        textArea.style.width = task.offsetWidth + 'px';
        textArea.style.height = task.offsetHeight + 'px';
        textArea.innerHTML = oldText.innerHTML;

        textArea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (e.target.value.trim()) {
                    oldText.innerHTML = e.target.value;
                    task.removeChild(e.target);
                } else {
                    alert('Invalid edit field');
                    e.target.value = '';
                }
            }
        });

        task.appendChild(textArea);
    });

    return editBtn;
}

// Save task in local storage
function saveTasks(task) {
    let tasks;
    if (!localStorage.getItem('_tasks_')) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('_tasks_'));
    }
    tasks.push(task);
    localStorage.setItem('_tasks_', JSON.stringify(tasks));
    return task;
}

// Save color in local storage
function saveColors(color = '#e4c1f9') {
    let colors;
    if (!localStorage.getItem('_colors_')) {
        colors = [];
    } else {
        colors = JSON.parse(localStorage.getItem('_colors_'));
    }
    colors.push(color);
    localStorage.setItem('_colors_', JSON.stringify(colors));
    return color;
}
