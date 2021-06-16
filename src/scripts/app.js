import { createElement } from './helper';

const BASE_URL = 'http://localhost:3000/todos';
const taskInput = document.querySelector('#task-input');
const taskContainer = document.querySelector('#task-container');
const colorPalette = ['#e56b6f', '#ffe66d', '#06d6a0', '#8ecae6', '#ffb5a7'];
window.addEventListener('DOMContentLoaded', () => {
    // GET todo
    fetch(BASE_URL)
        .then((res) => res.json())
        .then((todos) => {
            todos.forEach((todo) => {
                createTask(todo, taskContainer);
            });
        })
        .catch((e) => console.log(e.message));

    // POST todo
    taskInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            if (e.target.value.trim()) {
                let newTodo = {
                    todo: e.target.value.trim(),
                    color: '#e4c1f9',
                };
                try {
                    const res = await fetch(BASE_URL, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        },
                        body: JSON.stringify(newTodo),
                    });
                    const todo = await res.json();
                    createTask(todo, taskContainer);
                    e.target.value = '';
                } catch (e) {
                    console.log(e.message);
                }
            } else {
                alert('Invalid Input Field');
                e.target.value = '';
            }
        }
    });
});

// Create task with input value
function createTask(todo, parent) {
    let column = createElement({ class: 'col-md-4' });
    let taskField = createElement({ class: 'task d-flex' });
    taskField.style.background = todo.color;

    // <p>{inputValue}</p>
    let taskText = createElement('p');
    taskText.innerHTML = todo.todo;
    taskField.appendChild(taskText);

    // <i class="far fa-times-circle ms-auto" ></i>
    let taskDelete = createElement('i', {
        class: 'far fa-times-circle ms-auto',
    });
    taskDelete.addEventListener('click', () => {
        fetch(`${BASE_URL}/${todo.id}`, { method: 'DELETE' });
        parent.removeChild(column);
    });
    taskField.appendChild(taskDelete);

    let controlPanel = createTaskController(taskField, todo.id);
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
function createTaskController(parent, id) {
    let controller = createElement({ class: 'control-panel' });

    // Create palette
    let colorPalette = createColorPalette(parent, id);
    controller.appendChild(colorPalette);

    // Edit button
    let editBtn = createEditBtn(parent, id);
    controller.appendChild(editBtn);

    return controller;
}

// Create color palette with some color circle
function createColorPalette(task, id) {
    let colorContainer = createElement({ class: 'color-palette' });

    colorPalette.forEach((color) => {
        let colorCircle = document.createElement('div');
        colorCircle.style.background = color;

        colorCircle.addEventListener('click', async () => {
            let newTodo = await updateTodo(
                task.querySelector('p').innerText,
                color,
                id
            );
            task.style.background = newTodo.color;
        });

        colorContainer.appendChild(colorCircle);
    });

    return colorContainer;
}

// Create edit button for each task
function createEditBtn(task, id) {
    let editBtn = createElement('i', { class: 'far fa-edit ms-auto' });

    editBtn.addEventListener('click', () => {
        let oldText = task.querySelector('p');
        let textArea = createElement('textarea', { class: 'edit-text' });

        textArea.style.width = task.offsetWidth + 'px';
        textArea.style.height = task.offsetHeight + 'px';
        textArea.innerHTML = oldText.innerHTML;

        textArea.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                if (e.target.value.trim()) {
                    const newTodo = await updateTodo(
                        e.target.value.trim(),
                        task.style.background,
                        id
                    );
                    oldText.innerHTML = newTodo.todo;
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

// UPDATE todo
async function updateTodo(todo, color, elId) {
    try {
        const res = await fetch(`${BASE_URL}/${elId}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({ todo, color }),
        });
        const updatedTodo = await res.json();
        return updatedTodo;
    } catch (e) {
        console.log(e.message);
        return false;
    }
}
