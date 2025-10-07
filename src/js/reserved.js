function cardBody(task) {
  let bodyPart = document.createElement("div");
  bodyPart.classList.add("card-body", "task-details");
  bodyPart.appendChild(createTaskTitle(task.title, task.isImportant));
  bodyPart.appendChild(createTaskDescription(task.description));
  bodyPart.appendChild(createTaskTags(task.tags));
  bodyPart.appendChild(createTaskDate(`Date Created On : ${task.createdAt}`));
  if (task.updatedAt) {
    bodyPart.appendChild(createTaskDate(`Last Updated At : ${task.updatedAt}`));
  }
  bodyPart.appendChild(createCheckBox(task));
  bodyPart.appendChild(editOperationButton(task));
  bodyPart.appendChild(deleteOperationButton(task));
  const editField = editFields(task);
  for (let i = 0; i < editField.length; i++) {
    bodyPart.appendChild(editField[i]);
  }
  return bodyPart;
}

function createTaskTitle(title, importance) {
  let taskTitle = document.createElement("h5");
  taskTitle.classList.add("card-title", "task-name");
  if (importance) {
    taskTitle.innerHTML = `${title}<i class="fa-solid fa-star icon-left importance"></i>`;
  } else {
    taskTitle.textContent = title;
  }
  return taskTitle;
}

function createTaskDescription(description) {
  let taskDescription = document.createElement("p");
  taskDescription.classList.add("card-text", "task-description");
  taskDescription.textContent = description;
  return taskDescription;
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

function createCheckBox(task) {
  // Mark as completed checkbox
  let checkTask = document.createElement("div");
  checkTask.className = "checkbox";

  let checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.classList.add("form-check-input");
  checkBox.checked = task.isCompleted;

  let label = document.createElement("label");
  label.classList.add("form-check-label", "important-checkbox-label");
  if (task.isCompleted) {
    label.textContent = "Mark as Incomplete";
  } else {
    label.textContent = "Mark as Completed";
  }

  checkTask.appendChild(checkBox);
  checkTask.appendChild(label);
  return checkTask;
}

function editOperationButton(task) {
  let editButtonForm = document.createElement("button");
  editButtonForm.classList.add("btn", "btn-primary", "edit-button");
  editButtonForm.id = task.id;
  editButtonForm.innerHTML = `<i class="fa-solid fa-pen icon-right"></i>Edit`;

  return editButtonForm;
}

function deleteOperationButton(task) {
  let deleteButtonForm = document.createElement("button");
  deleteButtonForm.classList.add("btn", "btn-danger", "delete-button");
  deleteButtonForm.id = task.id;
  deleteButtonForm.innerHTML = `<i class="fa-solid fa-trash-can icon-right"></i>Delete`;

  return deleteButtonForm;
}

function editFields(task) {
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
  saveChangesButton.id = task.id;
  saveChangesButton.textContent = "Save Changes";

  return [editTitleField, editDescriptionField, saveChangesButton];
}
