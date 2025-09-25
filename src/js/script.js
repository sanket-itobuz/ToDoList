console.log(`Hello Tasks`)

// Selecting all the form items
const taskForm = document.getElementById("form-part");
const taskNameField = document.getElementById("task-name");
const taskDescriptionField = document.getElementById('task-description');
const taskCheckBox = document.getElementById("important-checkbox");
const addTaskButton = document.getElementById('add-task-button');

let taskName;
let taskDescription;
let isImportant;
let creationDate;

// Selecting the Task Card section
const taskCardSections = document.getElementById("to-do-tasks");

// Get all the form inputs
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    taskName = formData.get("task-name");
    taskDescription = formData.get("task-description");
    isImportant = taskCheckBox.checked;

    let creationYear = new Date().getFullYear();
    let creationMonth = new Date().getMonth();
    let creationDay = new Date().getDate();

    creationDate = `${creationDay}/${creationMonth + 1}/${creationYear}`;

    const todoData = {
        id : Date.now(),
        title : taskName,
        description : taskDescription,
        importance : isImportant,
        date : creationDate,
        completed : false
    }
    localStorage.setItem(todoData.id, JSON.stringify(todoData));
    taskCardSections.appendChild(createTaskCard(todoData));
})


for(let i=0;i<localStorage.length;i++) {
    let key = localStorage.key(i);
    let object = JSON.parse(localStorage.getItem(key));
    console.log(object);
    taskCardSections.appendChild(createTaskCard(object));
}

function createTaskCard(object) {
    let taskCard = document.createElement("div");
    taskCard.classList.add("card", "task-card");
    taskCard.appendChild(importancePartElement(object.importance));
    taskCard.appendChild(bodyPartElement(object));
    return taskCard;
}

function importancePartElement(important) {
    let importancePart = document.createElement("div");
    importancePart.classList.add("card-header", "task-importance");
    if(important) {
        importancePart.style.backgroundColor = "rgb(7, 142, 54)";
    }
    else {
        importancePart.style.backgroundColor = "gray";
    }
    return importancePart;
}

function bodyPartElement(todoDetails) {
    let bodyPart = document.createElement("div");
    bodyPart.classList.add("card-body", "task-details");

    // Task title
    let taskTitle = document.createElement("h5");
    taskTitle.classList.add("card-title", "task-name");
    if(todoDetails.importance) {
        taskTitle.innerHTML = `${todoDetails.title}<i class="fa-solid fa-star icon-left importance"></i>`;
    }
    else {
        taskTitle.textContent = todoDetails.title;
    }
    
    // Task description
    let taskText = document.createElement("p");
    taskText.classList.add("card-text", "task-description");
    taskText.textContent = todoDetails.description;

    // Task added time
    let taskTime = document.createElement("div");
    taskTime.className = "task-creation-date";
    taskTime.textContent = `Date Created On : ${todoDetails.date}`;


    // Mark as completed checkbox
    let checkTask = document.createElement("div");
    checkTask.className = "checkbox";

    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.classList.add("form-check-input");
    checkBox.checked = todoDetails.completed; 

    let label = document.createElement("label");
    label.classList.add("form-check-label", "important-checkbox-label");
    // label.textContent = "Mark as Completed";
    if(todoDetails.completed) {
        label.textContent = "Mark as Incomplete";
    }
    else {
        label.textContent = "Mark as Completed";
    }
    
    checkBox.addEventListener("change", () => {
        todoDetails.completed = checkBox.checked;
        localStorage.setItem(todoDetails.id, JSON.stringify(todoDetails));
        if(todoDetails.completed) {
            label.textContent = "Mark as Incomplete";
        }
        else {
            label.textContent = "Mark as Completed";
        }
    });
    checkTask.appendChild(checkBox);
    checkTask.appendChild(label);

    // Edit Task Button
    let editButtonForm = document.createElement("button");
    editButtonForm.classList.add("btn", "btn-primary", "edit-button");
    editButtonForm.id = todoDetails.id;
    editButtonForm.innerHTML = `<i class="fa-solid fa-pen icon-right"></i>Edit`;

    editButtonForm.addEventListener("click", (e) => {
        editTitleField.style.display = "block";
        editDescriptionField.style.display = "block"
        saveChangesButton.style.display = "block";
        editButtonForm.disabled = true;
        deleteButtonForm.disabled = true;
    })

    // Delete Task Button
    let deleteButtonForm = document.createElement("button");
    deleteButtonForm.classList.add("btn", "btn-danger", "delete-button");
    deleteButtonForm.id = todoDetails.id;
    deleteButtonForm.innerHTML = `<i class="fa-solid fa-trash-can icon-right"></i>Delete`;

    deleteButtonForm.addEventListener("click", (e) => {
        const taskId = e.target.id;
        localStorage.removeItem(taskId);
        e.target.closest(".task-card").remove(); 
        taskCardSections.reset();
    });

    // Edit Title Field
    let editTitleField = document.createElement("input");
    editTitleField.classList.add("form-control", "edit-title-field");
    editTitleField.placeholder = "Enter new Title";

    // Edit Description Field
    let editDescriptionField = document.createElement("input");
    editDescriptionField.classList.add("form-control", "edit-description-field");
    editDescriptionField.placeholder = "Enter new Description";

    // Save Changes button
    let saveChangesButton = document.createElement("button");
    saveChangesButton.classList.add("btn", "btn-primary", "save-edit-button", "w-100");
    saveChangesButton.id = todoDetails.id;
    saveChangesButton.textContent = "Save Changes";

    saveChangesButton.addEventListener("click", (e) => {
        let newTitle = editTitleField.value;
        let newDescription = editDescriptionField.value;
        todoDetails.title = newTitle;
        todoDetails.description = newDescription;
        localStorage.setItem(e.target.id, JSON.stringify(todoDetails));

        editTitleField.style.display = "none";
        editDescriptionField.style.display = "none"
        saveChangesButton.style.display = "none";
        editButtonForm.disabled = false;
        deleteButtonForm.disabled = false;
        window.location.reload();
    });


    // Adding task components to card
    bodyPart.appendChild(taskTitle);
    bodyPart.appendChild(taskText);
    bodyPart.appendChild(taskTime);
    bodyPart.appendChild(checkTask);
    bodyPart.appendChild(editButtonForm);
    bodyPart.appendChild(deleteButtonForm);
    bodyPart.appendChild(editTitleField);
    bodyPart.appendChild(editDescriptionField);
    bodyPart.appendChild(saveChangesButton);
    return bodyPart;
}

let clearAllButton = document.querySelector(".clear-all-tasks");
clearAllButton.addEventListener("click", () => {
    localStorage.clear();
    window.location.reload();
})
