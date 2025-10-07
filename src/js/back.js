const API_KEY = "http://localhost:3000/tasks";

async function getAllData() {
  const response = await fetch(API_KEY, {
    method: "GET",
  });
  const tasks = await response.json();
  return tasks;
}

const taskForm = document.getElementById("form-part");
const taskCheckBox = document.getElementById("important-checkbox");

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  let taskName = formData.get("task-name");
  let taskDescription = formData.get("task-description");

  let tags = formData.get("task-tags");
  let taskTags = tags.split(",");
  for (let i = 0; i < taskTags.length; i++) {
    taskTags[i] = taskTags[i].trim();
  }

  let importance = taskCheckBox.checked;

  const todoData = {
    title: taskName.trim(),
    description: taskDescription.trim(),
    isImportant: importance,
    isCompleted: false,
    tags: taskTags,
  };

  const response = await fetch(API_KEY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoData),
  });
  cardsReload();
});

function cardsReload() {
  const children = cardsSection.querySelectorAll("*");
  children.forEach((child) => child.remove());
  showCards();
}

let cardsSection = document.getElementById("to-do-tasks");

async function showCards() {
  const allTasks = await getAllData();
  console.log(allTasks);
  for (let i = 0; i < allTasks.length; i++) {
    let task = allTasks[i];
    let card = createCard(task);
    cardsSection.appendChild(card);
  }
}
showCards();

function createCard(task) {
  let card = document.createElement("div");
  card.classList.add("card", "task-card");
  card.appendChild(taskImportanceHeader(task.isImportant));
  card.appendChild(cardBody(task));
  return card;
}

function taskImportanceHeader(importance) {
  let importancePart = document.createElement("div");
  importancePart.classList.add("card-header", "task-importance");
  if (importance) {
    importancePart.style.backgroundColor = "rgb(7, 142, 54)";
  } else {
    importancePart.style.backgroundColor = "gray";
  }
  return importancePart;
}

function cardBody(todoDetails) {
  let bodyPart = document.createElement("div");
  bodyPart.classList.add("card-body", "task-details");

  // Task title
  let taskTitle = document.createElement("h5");
  taskTitle.classList.add("card-title", "task-name");
  if (todoDetails.isImportant) {
    taskTitle.innerHTML = `${todoDetails.title}<i class="fa-solid fa-star icon-left importance"></i>`;
  } else {
    taskTitle.textContent = todoDetails.title;
  }

  // Task description
  let taskText = document.createElement("p");
  taskText.classList.add("card-text", "task-description");
  taskText.textContent = todoDetails.description;

  // Mark as completed checkbox
  let checkTask = document.createElement("div");
  checkTask.className = "checkbox";

  let checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.classList.add("form-check-input");
  checkBox.checked = todoDetails.completed;

  let label = document.createElement("label");
  label.classList.add("form-check-label", "important-checkbox-label");
  if (todoDetails.completed) {
    label.textContent = "Mark as Incomplete";
  } else {
    label.textContent = "Mark as Completed";
  }

  checkBox.addEventListener("change", () => {
    todoDetails.completed = checkBox.checked;
    if (todoDetails.completed) {
      label.textContent = "Mark as Incomplete";
    } else {
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
    editDescriptionField.style.display = "block";
    saveChangesButton.style.display = "block";
    editButtonForm.disabled = true;
    deleteButtonForm.disabled = true;
  });

  // Delete Task Button
  let deleteButtonForm = document.createElement("button");
  deleteButtonForm.classList.add("btn", "btn-danger", "delete-button");
  deleteButtonForm.id = todoDetails.id;
  deleteButtonForm.innerHTML = `<i class="fa-solid fa-trash-can icon-right"></i>Delete`;

  // Delete Task Operation --
  deleteButtonForm.addEventListener("click", async (e) => {
    const id = e.target.id;
    const response = await fetch(`${API_KEY}/${id}`, {
      method: "DELETE",
    });
    const message = await response.text();
    console.log(message);
    cardsReload();
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
  saveChangesButton.classList.add(
    "btn",
    "btn-primary",
    "save-edit-button",
    "w-100"
  );
  saveChangesButton.id = todoDetails.id;
  saveChangesButton.textContent = "Save Changes";

  // save title and description changes operation --

  // Adding task components to card
  bodyPart.appendChild(taskTitle);
  bodyPart.appendChild(taskText);
  bodyPart.appendChild(createTaskTags(todoDetails.tags));
  bodyPart.appendChild(
    createTaskDate(`Date Created On : ${todoDetails.createdAt}`)
  );
  if (todoDetails.updatedAt) {
    bodyPart.appendChild(
      createTaskDate(`Last Updated At : ${todoDetails.updatedAt}`)
    );
  } else {
    bodyPart.appendChild(createTaskDate(`Last Updated At`));
  }
  bodyPart.appendChild(checkTask);
  bodyPart.appendChild(editButtonForm);
  bodyPart.appendChild(deleteButtonForm);
  bodyPart.appendChild(editTitleField);
  bodyPart.appendChild(editDescriptionField);
  bodyPart.appendChild(saveChangesButton);
  return bodyPart;
}

function createTaskTags(tags) {
  let tagsSection = document.createElement("div");
  tagsSection.className = "tags";
  tags.forEach((tag) => {
    let tagItem = document.createElement("div");
    tagItem.className = "tag";
    tagItem.textContent = tag;
    tagsSection.appendChild(tagItem);
  });
  return tagsSection;
}

function createTaskDate(date) {
  let taskTime = document.createElement("div");
  taskTime.className = "task-creation-date";
  taskTime.textContent = date;
  return taskTime;
}

// Clear all tasks button
let clearAllButton = document.querySelector(".clear-all-tasks");
clearAllButton.addEventListener("click", async () => {
  const response = await fetch(API_KEY, {
    method: "DELETE",
  });
  window.location.reload();
});

let searchCardsSection = document.querySelector(".search-cards");
let searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", async (event) => {
  while (searchCardsSection.firstChild) {
    searchCardsSection.removeChild(searchCardsSection.firstChild);
  }
  event.preventDefault();
  const formData = new FormData(event.target);
  const searchTitle = formData.get("search");

  // --WIP
  const response = await fetch(API_KEY, {
    method: "GET",
  });
  const message = await response.json();
  console.log(message);
});
