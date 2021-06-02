import { createElement } from './helper';
import {
    getTaskFromLocalStorage,
    addTaskInLocalStorage,
    updateColor,
    removeTaskFromLocalStorage,
    updateTaskInLocalStorage,
} from './storage';

const taskInput = document.querySelector('#task-input');
const taskContainer = document.querySelector('#task-container');
const colorPalette = ['#e56b6f', '#ffe66d', '#06d6a0', '#8ecae6', '#ffb5a7'];
let taskID = 1;

window.addEventListener('DOMContentLoaded', () => {
    // Render all tasks on loaded
    const tasks = getTaskFromLocalStorage();
    tasks.forEach((task) => {
        createTask(task.task, task.color, taskContainer);
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (e.target.value.trim()) {
                addTaskInLocalStorage(e.target.value);
                createTask(e.target.value, '#e4c1f9', taskContainer);
                e.target.value = '';
            } else {
                alert('Invalid Input Field');
                e.target.value = '';
            }
        }
    });
});

// Create task with input value
function createTask(inputValue, color, parent) {
    let column = createElement({ class: 'col-md-4' });
    let taskField = createElement({ class: 'task d-flex' });
    taskField.style.background = color;

    // <span class="task-number" >{taskID}</span>
    let taskNumber = createElement('span', { class: 'task-number' });
    taskNumber.innerHTML = taskID++;
    taskField.appendChild(taskNumber);

    // <p>{inputValue}</p>
    let taskText = createElement('p');
    taskText.innerHTML = inputValue.trim();
    taskField.appendChild(taskText);

    // <i class="far fa-times-circle ms-auto" ></i>
    let taskDelete = createElement('i', {
        class: 'far fa-times-circle ms-auto',
    });
    taskDelete.addEventListener('click', () => {
        removeTaskFromLocalStorage(taskNumber.innerText);
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
            updateColor(task, color);
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
                    updateTaskInLocalStorage(task);
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
