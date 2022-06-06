let todosList = [];
let filters = {
    searchText: ''
};

let editButtonFlag = true;

function myCreateElement(element, parent, className) {
    const childElement = document.createElement(element);
    if (className !== undefined)
        childElement.className = className;

    parent.appendChild(childElement);

    return childElement;
}

function myArrayOfObjectsSearch(array, key) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].text.toLowerCase() === key.toLowerCase()) {
            return i;
        }
    }

    return -1;
};

function renderTodos(todos, filters) {
    let filteredTodos = todos.filter(function (todo) {
        return todo.text.toLowerCase().includes(filters.searchText.toLowerCase());
    });

    return filteredTodos;
}

// Add-Btton event listener
document.querySelector('.add-button').addEventListener('click', function () {
    const addInputValue = document.querySelector('.add-todo-input').value;
    const highPriorityDiv = document.querySelector('.high-priority-div');
    const lowPriorityDiv = document.querySelector('.low-priority-div');

    if (addInputValue === '') {
        alert('Please, Write a todo to add');
    } else {
        // Check if the entered todo is found
        if (myArrayOfObjectsSearch(todosList, addInputValue) !== -1)
            alert('You have this todo. Please write a new one');

        // Add the new todo to the todoList and to the HTML
        else {
            // Hide todos-have text
            if (todosList.length === 0) {
                document.querySelector('.todos-have').style.visibility = 'hidden';
            }

            const highPriorityFlag = document.querySelector('.high-priority-checkbox').checked;
            // Push the new todo to todoList
            todosList.push({
                text: addInputValue,
                completed: false,
                highPriority: highPriorityFlag
            });

            ////////////////////////////////////

            // Create todo Div
            let todoDiv;
            if (highPriorityFlag) {
                todoDiv = myCreateElement('div', highPriorityDiv, 'todo');

                // Return high priority checkbox to false as a default value
                document.querySelector('.high-priority-checkbox').checked = false;

            } else {
                todoDiv = myCreateElement('div', lowPriorityDiv, 'todo');
            }

            // Create row Div
            const rowDiv = myCreateElement('div', todoDiv, 'row');

            // Create todo-content Div
            const todoContentDiv = myCreateElement('div', rowDiv, 'todo-content text-left shadow-sm offset-2 col-6');

            // Create todo-buttons Div
            const todoButtonsDiv = myCreateElement('div', rowDiv, 'todo-buttons text-left col-2');

            // Create read-only text-input inside todo-content
            const todoContentValue = myCreateElement('input', todoContentDiv, 'todo-content-value');
            todoContentValue.value = addInputValue;
            todoContentValue.readOnly = true;

            // Create buttons inside todo-buttons
            // Create edit-button
            myCreateElement('i', todoButtonsDiv, 'btn btn-warning fas fa-pen edit-button').title = 'Edit';

            // Create done-button
            myCreateElement('i', todoButtonsDiv, 'btn btn-success fas fa-check done-button').title = 'Done';

            // Create delete-button
            myCreateElement('i', todoButtonsDiv, 'btn btn-danger fas fa-trash-alt delete-button').title = 'Delete';

            ////////////////////////////////////

            // Clear add input value
            document.querySelector('.add-todo-input').value = '';
        }
    }
});

// Done-Button event listener
document.addEventListener('click', function (e) {
    const doneBtn = e.target;
    if (doneBtn && doneBtn.classList.contains('done-button')) {
        const todoRowDiv = doneBtn.parentElement.parentElement;
        const todoContent = todoRowDiv.querySelector('.todo-content-value');
        const index = myArrayOfObjectsSearch(todosList, todoContent.value);
        if (!todosList[index].completed) {
            todosList[index].completed = true;
            if (document.querySelector('.hide-completed').querySelector('span').textContent === ' Unhide completed')
                todoRowDiv.parentElement.style.display = 'none';
        } else {
            todosList[index].completed = false;
        }

        todoContent.classList.toggle('completed');
    }
});

// Edit-Button event listener
let todoContentOldValue;
document.addEventListener('click', function (e) {
    const editBtn = e.target;
    if (editBtn && editBtn.classList.contains('edit-button')) {
        const todoRowDiv = editBtn.parentElement.parentElement;
        const todoContentDiv = todoRowDiv.querySelector('.todo-content');
        const todoContentDivValue = todoContentDiv.querySelector('.todo-content-value');
        let todoContentNewValue;

        if (editBtn.textContent !== 'Save') {

            todoContentOldValue = todoContentDivValue.value;

            //////// Change button interface
            // Disable the 2 buttons for this todo
            todoRowDiv.querySelector('.done-button').classList.add('disabled-button');
            todoRowDiv.querySelector('.delete-button').classList.add('disabled-button');

            // Make text box editable
            todoContentDivValue.readOnly = false;
            todoContentDivValue.style.background = '#fff';

            // Move cursor to the edit box
            todoContentDivValue.focus();
            todoContentDivValue.select();

            // Change edit-button to save button
            editBtn.textContent = 'Save';
            editBtn.classList.remove('fa-pen');
        } else {

            todoContentNewValue = todoContentDivValue.value;
            if (todoContentNewValue !== null && todoContentNewValue !== '') {

                // Check if new value is equal one ,so Do nothing, just ignore and jumb to Change button interface
                if (todoContentNewValue === todoContentOldValue) {
                    // Do nothing
                }

                // Check if this new edit of the todo is found in todoList
                else if (myArrayOfObjectsSearch(todosList, todoContentNewValue) !== -1) {
                    alert('You have this todo. Please write a new one');
                    todoContentDivValue.value = todoContentOldValue;
                } else {

                    //////// Edit inside list
                    const index = myArrayOfObjectsSearch(todosList, todoContentOldValue);
                    todosList[index].text = todoContentNewValue;
                    todoContentDivValue.value = todoContentNewValue;
                    todoContentDivValue.readOnly = true;
                }

                //////// Change button interface
                // Enable the 2 buttons for this todo
                todoRowDiv.querySelector('.done-button').classList.remove('disabled-button');
                todoRowDiv.querySelector('.delete-button').classList.remove('disabled-button');

                // Make text box read-only
                todoContentDivValue.readOnly = true;
                todoContentDivValue.style.background = 'transparent';

                // Return edit-button to origin
                editBtn.textContent = '';
                editBtn.classList.add('fa-pen');
            }
        }
    }
});

// Delete-Button event listener
document.addEventListener('click', function (e) {
    const deleteBtn = e.target;
    if (deleteBtn && deleteBtn.classList.contains('delete-button')) {
        const todoDiv = deleteBtn.parentElement.parentElement.parentElement;
        const todoContentValue = todoDiv.querySelector('.todo-content-value').value;
        const index = myArrayOfObjectsSearch(todosList, todoContentValue);

        // Remove it from todosList
        todosList.splice(index, 1);

        // Remove todo Div from HTML
        todoDiv.remove();

        // Show todos-have to default
        if (todosList.length === 0) {
            document.querySelector('.todos-have').style.visibility = 'visible';
        }
    }
});

// Delete-All-Button event listener
document.querySelector('.delete-all-todos').addEventListener('click', function () {

    if (todosList.length === 0) {
        alert('There is no todo to delete');
    } else if (confirm('Are you sure you want to delete all todos?')) {

        const todosDiv = document.querySelector('.todos');

        // Clear all todoList elements
        todosList = [];

        // Remove all todo divs        
        document.querySelector('.high-priority-div').remove(); // Remove high-priority-div
        document.querySelector('.low-priority-div').remove(); // Remove low-priority-div

        // Create high-priority-div again because the previous loop removed it
        myCreateElement('div', todosDiv, 'high-priority-div');

        // Create low-priority-div again because the previous loop removed it
        myCreateElement('div', todosDiv, 'low-priority-div');

        // Show todos-have to default
        document.querySelector('.todos-have').style.visibility = 'visible';
    }
});


document.querySelector('.hide-completed').addEventListener('click', function () {
    const completedTodos = todosList.filter(function (todo) {
        return todo.completed;
    });
    if (completedTodos.length > 0) {
        const todoArray = document.querySelectorAll('.todo');
        if (this.querySelector('span').textContent === ' Hide completed') {

            // Hide button style
            this.querySelector('i').classList.remove('fa-eye-slash');
            this.querySelector('i').classList.add('fa-eye');
            this.querySelector('span').textContent = ' Unhide completed';

            for (let i = 0; i < todoArray.length; i++) {
                if (todoArray[i].querySelector('.todo-content-value').classList.contains('completed')) {
                    todoArray[i].style.display = 'none';
                }
            }
        } else {

            // Unhide button style
            this.querySelector('i').classList.remove('fa-eye');
            this.querySelector('i').classList.add('fa-eye-slash');
            this.querySelector('span').textContent = ' Hide completed';

            for (let i = 0; i < todoArray.length; i++) {
                if (todoArray[i].style.display == 'none') {
                    todoArray[i].style.display = 'block';
                }
            }
        }
    } else {
        alert('Unfortunately, there is no any completed todo');
    }
});
//localStorage.setItem('text', 'ahmed');
//
////let user = {text: 'Todo', comp: true};
//
////let userJSON = JSON.stringify(user);
//
////localStorage.setItem('user', userJSON);
//
//let userJSON = localStorage.getItem('user');
//
//let user = JSON.parse(userJSON);
//
//console.log(`The ${user.text} task is ${user.comp}`);
////localStorage.removeItem('text');
