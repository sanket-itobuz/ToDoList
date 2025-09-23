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
        date : creationDate
    }
    localStorage.setItem(Date.now(), JSON.stringify(todoData));
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
        importancePart.textContent = "Important";
        importancePart.style.backgroundColor = "#e4e408";
    }
    else {
        importancePart.textContent = "Normal";
    }
    return importancePart;
}

function bodyPartElement(todoDetails) {
    let bodyPart = document.createElement("div");
    bodyPart.classList.add("card-body", "task-details");

    let taskTitle = document.createElement("h5");
    taskTitle.classList.add("card-title", "task-name");
    taskTitle.textContent = todoDetails.title;

    let taskText = document.createElement("p");
    taskText.classList.add("card-text", "task-description");
    taskText.textContent = todoDetails.description;

    let taskTime = document.createElement("div");
    taskTime.className = "task-creation-date";
    taskTime.textContent = `Date Created On : ${todoDetails.date}`;

    let checkTask = document.createElement("div");
    checkTask.className = "checkbox";
    checkTask.innerHTML = `<input
                type="checkbox"
                id="important-checkbox"
                class="form-check-input"
                name="important-checkbox"
              />
              <label class="form-check-label important-checkbox-label"
                >Mark as Completed</label
              >`;

    let deleteButtonForm = document.createElement("button");
    deleteButtonForm.classList.add("btn", "btn-danger", "delete-button");
    deleteButtonForm.id = todoDetails.id;
    deleteButtonForm.textContent = "Delete";

    bodyPart.appendChild(taskTitle);
    bodyPart.appendChild(taskText);
    bodyPart.appendChild(taskTime);
    bodyPart.appendChild(checkTask);
    bodyPart.appendChild(deleteButtonForm);
    return bodyPart;
}

let deleteTaskButtons = document.querySelectorAll(".delete-button");
deleteTaskButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        localStorage.removeItem(this.id);
    })
})









