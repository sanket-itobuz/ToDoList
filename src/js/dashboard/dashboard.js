import customFetch from "../fetch/customFetch.js";
import showToast from "../toasts/toastOperation.js";

window.fetch = customFetch;

const PROFILE_BASE_URL = "http://localhost:3000/profile";
const BASE_URL = "http://localhost:3000/tasks";

if (
  localStorage.getItem("refresh_token") === "undefined" ||
  !localStorage.getItem("access_token")
) {
  console.log("Refresh Token Expired");
  window.location.href = "../../pages/login.html";
} else {
  let user;

  try {
    const response = await fetch(PROFILE_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    user = response.user;
    console.log(user);
  } catch (err) {
    console.log(err);
  }

  const username = document.getElementById("user");
  const email = document.getElementById("email");
  const createdAt = document.getElementById("createdAt");
  const profileImage = document.querySelector(".profile-image");
  const logOut = document.querySelector(".logout");

  const timeStr = user.createdAt;
  const dateString = timeStr.split("T");
  const date = dateString[0].split("-");

  username.innerHTML = `${user.username} <i class="fa-solid fa-circle-check"></i>`;
  email.innerHTML = `<i class="fa-solid fa-envelope" style="color: rgb(200, 3, 3)"></i> ${user.email}`;
  createdAt.innerHTML = `<i class="fa-solid fa-calendar"></i> ${date[2]}/${date[1]}/${date[0]}`;
  profileImage.setAttribute(
    "src",
    user.profile ||
      "https://static.vecteezy.com/system/resources/previews/065/959/781/non_2x/simple-dark-blue-user-profile-icon-person-symbol-free-vector.jpg"
  );

  logOut.addEventListener("click", (event) => {
    localStorage.clear();
    window.location.href = "../../pages/login.html";
  });

  async function getAllData() {
    try {
      let tasks = await fetch(`${BASE_URL}/fetch`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return tasks;
    } catch (err) {
      console.error(err);
    }
  }

  const taskForm = document.getElementById("formPart");
  const taskCheckBox = document.getElementById("importantCheckbox");

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

    try {
      const message = await fetch(`${BASE_URL}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      });

      showToast(message);
    } catch (err) {
      console.error(err);
    }
    cardsReload();
  });

  function cardsReload() {
    cardsSection.innerHTML = "";
    showCards();
  }

  function taskCountInfo(tasks) {
    // Declaring no variables
    const totalTasksNo = document.getElementById("totalTasks");
    const completedTaskNo = document.getElementById("completedTask");
    const notCompletedTaskNo = document.getElementById("notCompletedTask");
    const importantTaskNo = document.getElementById("importantTasks");

    let totalTasks = 0;
    let completedTasks = 0;
    let notCompletedTasks = 0;
    let importantTasks = 0;

    for (let i = 0; i < tasks.length; i++) {
      let task = tasks[i];

      totalTasks++;
      if (task.isCompleted) {
        completedTasks++;
      } else {
        notCompletedTasks++;
      }
      if (task.isImportant) {
        importantTasks++;
      }
    }
    totalTasksNo.innerHTML = `Total : <span>${totalTasks}</span>`;
    completedTaskNo.innerHTML = `Completed : <span>${completedTasks}</span>`;
    notCompletedTaskNo.innerHTML = `Not Completed : <span>${notCompletedTasks}</span>`;
    importantTaskNo.innerHTML = `Important : <span>${importantTasks}</span>`;
  }

  let cardsSection = document.getElementById("toDoTasks");

  async function showCards() {
    const allTasks = await getAllData();
    console.log(allTasks);

    for (let i = 0; i < allTasks.length; i++) {
      let task = allTasks[i];

      let card = createCard(task);
      cardsSection.appendChild(card);
    }
    taskCountInfo(allTasks);
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
      importancePart.style.backgroundColor = "#007EA7";
    } else {
      importancePart.style.backgroundColor = "#9AD1D4";
    }
    return importancePart;
  }

  function cardBody(todoDetails) {
    let bodyPart = document.createElement("div");
    bodyPart.classList.add("card-body", "task-details");

    // Task title
    let taskTitle = document.createElement("h5");
    taskTitle.classList.add("card-title", "task-name");
    taskTitle.style.color = "#003249";

    if (todoDetails.isImportant) {
      taskTitle.innerHTML = `${todoDetails.title}<i class="fa-solid fa-star icon-left importance"></i>`;
    } else {
      taskTitle.textContent = todoDetails.title;
    }

    // Task description
    let taskText = document.createElement("p");
    taskText.classList.add("card-text", "task-description");
    taskText.textContent = todoDetails.description;
    taskText.style.color = "#007EA7";

    // Mark as completed checkbox
    let checkTask = document.createElement("div");
    checkTask.className = "checkbox";

    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = todoDetails._id;
    checkBox.classList.add("form-check-input");
    checkBox.checked = todoDetails.isCompleted;

    let label = document.createElement("label");
    label.classList.add("form-check-label", "important-checkbox-label");

    if (todoDetails.isCompleted) {
      label.textContent = "Mark as Incomplete";
    } else {
      label.textContent = "Mark as Completed";
    }

    checkBox.addEventListener("change", async (e) => {
      const taskInfo = document.querySelector(".task-info");

      let targetEditId = e.target.id;

      const editData = {
        id: targetEditId,
        isCompleted: checkBox.checked,
      };

      try {
        const message = await fetch(`${BASE_URL}/edit`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        });

        console.log(message);
      } catch (err) {
        console.log(err);
      }

      todoDetails.isCompleted = checkBox.checked;

      if (todoDetails.isCompleted) {
        label.textContent = "Mark as Incomplete";
      } else {
        label.textContent = "Mark as Completed";
      }

      cardsReload();
    });
    checkTask.appendChild(checkBox);
    checkTask.appendChild(label);

    // Edit Task Button
    let editButtonForm = document.createElement("button");
    editButtonForm.classList.add("btn", "edit-button");
    editButtonForm.id = todoDetails._id;
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
    deleteButtonForm.classList.add("btn", "delete-button");
    deleteButtonForm.id = todoDetails._id;
    deleteButtonForm.innerHTML = `<i class="fa-solid fa-trash-can icon-right"></i>Delete`;

    // Delete Todo Operation
    deleteButtonForm.addEventListener("click", async (e) => {
      const id = e.target.id;

      try {
        const message = await fetch(`${BASE_URL}/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        showToast(message);
      } catch (err) {
        console.log(err);
      }

      cardsReload();
    });

    // Edit Title Field
    let editTitleField = document.createElement("input");
    editTitleField.classList.add("form-control", "edit-title-field");
    editTitleField.value = todoDetails.title;

    // Edit Description Field
    let editDescriptionField = document.createElement("input");
    editDescriptionField.classList.add(
      "form-control",
      "edit-description-field"
    );
    editDescriptionField.value = todoDetails.description;

    // Save Changes button
    let saveChangesButton = document.createElement("button");
    saveChangesButton.classList.add("btn", "save-edit-button", "w-100");
    saveChangesButton.id = todoDetails._id;
    saveChangesButton.textContent = "Save Changes";

    // Save title and description changes Operation
    saveChangesButton.addEventListener("click", async (e) => {
      let targetEditId = e.target.id;
      let editTitle = editTitleField.value;
      let editDescription = editDescriptionField.value;

      const editData = {
        id: targetEditId,
        title: editTitle,
        description: editDescription,
      };

      try {
        const message = await fetch(`${BASE_URL}/edit`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        });

        showToast(message);
      } catch (err) {
        console.log(err);
      }

      cardsReload();
      searchCardsSection.innerHTML = "";
    });

    // Adding todo components to card
    bodyPart.appendChild(taskTitle);
    bodyPart.appendChild(taskText);

    bodyPart.appendChild(createTaskTags(todoDetails.tags));
    bodyPart.appendChild(createTaskDate(todoDetails.createdAt));

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
      tagItem.style.backgroundColor = "#007EA7";
      tagItem.style.color = "#f5f9faff";
      tagsSection.appendChild(tagItem);
    });
    return tagsSection;
  }

  function createTaskDate(time) {
    let taskTime = document.createElement("div");
    taskTime.className = "task-creation-date";

    const dateString = time.split("T");
    const date = dateString[0].split("-");

    taskTime.innerHTML = `<i class="fa-solid fa-calendar" style="color: #007EA7"></i> ${date[2]}/${date[1]}/${date[0]}`;
    return taskTime;
  }

  // Clear all tasks button
  let clearAllButton = document.querySelector(".clear-all-tasks");

  clearAllButton.addEventListener("click", async () => {
    try {
      const message = await fetch(`${BASE_URL}/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      showToast(message);
    } catch (err) {
      console.log(err);
    }

    cardsReload();
  });

  // Search todos via title and tagname
  let searchCardsSection = document.querySelector("#searchCards");
  let searchForm = document.getElementById("searchForm");

  searchForm.addEventListener("submit", async (event) => {
    while (searchCardsSection.firstChild) {
      searchCardsSection.removeChild(searchCardsSection.firstChild);
    }

    event.preventDefault();
    const formData = new FormData(event.target);
    const searchTitle = formData.get("search-title");
    const searchTag = formData.get("search-tag");

    try {
      const searchTasks = await fetch(
        `${BASE_URL}/search?title=${searchTitle}&tag=${searchTag}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      searchTasks.forEach((task) => {
        searchCardsSection.appendChild(createCard(task));
      });
    } catch (err) {
      console.log(err);
    }
  });
}
