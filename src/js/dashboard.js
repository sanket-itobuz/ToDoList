import refreshTokens from "./refreshToken";

if (localStorage.getItem("access_token") == null) {
  window.location.href = "/pages/login.html";
} else {
  const USER_API_KEY = "http://localhost:3000/user/auth";

  let response = await fetch(USER_API_KEY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  let user = await response.json();
  if (user.error) {
    await refreshTokens();
    response = await fetch(USER_API_KEY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    user = await response.json();
  }
  console.log(user);

  const username = document.getElementById("user");
  const email = document.getElementById("email");
  const createdAt = document.getElementById("createdAt");
  const logOut = document.querySelector(".logout");

  username.innerHTML = `${user.username} <i class="fa-solid fa-circle-check" style="color: #198754"></i>`;
  email.innerHTML = `<i class="fa-solid fa-envelope" style="color: #dc3545"></i> ${user.email}`;
  createdAt.innerHTML = `<i class="fa-solid fa-calendar" style="color: #0d6efd"></i> ${user.createdAt}`;

  logOut.addEventListener("click", (event) => {
    localStorage.clear();
    window.location.href = "../pages/login.html";
  });

  const API_KEY = "http://localhost:3000/tasks";

  async function getAllData() {
    try {
      let response = await fetch(`${API_KEY}/fetch`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      let tasks = await response.json();

      if (tasks.error) {
        await refreshTokens();
        response = await fetch(`${API_KEY}/fetch`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        tasks = await response.json();
      }
      return tasks;
    } catch (err) {
      console.log("JWT Expire Problem", err);
    }
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

    const response = await fetch(`${API_KEY}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(todoData),
    });
    const message = await response.json();
    if (message.error) {
      await refreshTokens();
    }
    console.log(message);

    cardsReload();
  });

  function cardsReload() {
    const children = cardsSection.querySelectorAll("*");
    children.forEach((child) => child.remove());
    showCards();
  }

  // Declaring no variables
  const totalTasksNo = document.getElementById("total-tasks");
  const completedTaskNo = document.getElementById("completed-task");
  const notCompletedTaskNo = document.getElementById("not-completed-task");
  const importantTaskNo = document.getElementById("important-tasks");

  let cardsSection = document.getElementById("to-do-tasks");

  async function showCards() {
    const allTasks = await getAllData();
    console.log(allTasks);

    let totalTasks = 0;
    let completedTasks = 0;
    let notCompletedTasks = 0;
    let importantTasks = 0;

    for (let i = 0; i < allTasks.length; i++) {
      let task = allTasks[i];

      totalTasks++;
      if (task.isCompleted) {
        completedTasks++;
      } else {
        notCompletedTasks++;
      }
      if (task.isImportant) {
        importantTasks++;
      }

      let card = createCard(task);
      cardsSection.appendChild(card);
    }

    totalTasksNo.innerHTML = `Total : <span>${totalTasks}</span>`;
    completedTaskNo.innerHTML = `Completed : <span>${completedTasks}</span>`;
    notCompletedTaskNo.innerHTML = `Not Completed : <span>${notCompletedTasks}</span>`;
    importantTaskNo.innerHTML = `Important : <span>${importantTasks}</span>`;
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
      let targetEditId = e.target.id;
      const editData = {
        id: targetEditId,
        isCompleted: checkBox.checked,
      };
      const response = await fetch(`${API_KEY}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(editData),
      });
      const message = await response.json();
      if (message.error) {
        await refreshTokens();
      }
      console.log(message);

      todoDetails.isCompleted = checkBox.checked;
      if (todoDetails.isCompleted) {
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
    deleteButtonForm.classList.add("btn", "btn-danger", "delete-button");
    deleteButtonForm.id = todoDetails._id;
    deleteButtonForm.innerHTML = `<i class="fa-solid fa-trash-can icon-right"></i>Delete`;

    // Delete Todo Operation
    deleteButtonForm.addEventListener("click", async (e) => {
      const id = e.target.id;
      const response = await fetch(`${API_KEY}/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const message = await response.json();
      if (message.error) {
        await refreshTokens();
      }
      console.log(message);
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
    saveChangesButton.classList.add(
      "btn",
      "btn-primary",
      "save-edit-button",
      "w-100"
    );
    saveChangesButton.id = todoDetails._id;
    saveChangesButton.textContent = "Save Changes";

    // Save title and description changes Operation
    saveChangesButton.addEventListener("click", async (e) => {
      let targetEditId = e.target.id;
      let editTitle = editTitleField.value;
      let editDescription = editDescriptionField.value;

      console.log(editTitle);
      console.log(editDescription);

      const editData = {
        id: targetEditId,
        title: editTitle,
        description: editDescription,
      };
      const response = await fetch(`${API_KEY}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(editData),
      });
      const message = await response.json();
      if (message.error) {
        await refreshTokens();
      }
      console.log(message);
      cardsReload();
    });

    // Adding todo components to card
    bodyPart.appendChild(taskTitle);
    bodyPart.appendChild(taskText);
    bodyPart.appendChild(createTaskTags(todoDetails.tags));

    // bodyPart.appendChild(
    //   createTaskDate(`Date Created On : ${todoDetails.createdAt}`)
    // );
    // if (todoDetails.updatedAt) {
    //   bodyPart.appendChild(
    //     createTaskDate(`Last Updated At : ${todoDetails.updatedAt}`)
    //   );
    // } else {
    //   bodyPart.appendChild(createTaskDate(`Last Updated At`));
    // }

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
    const response = await fetch(`${API_KEY}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    const message = await response.json();
    if (message.error) {
      await refreshTokens();
    }
    console.log(message);
    cardsReload();
  });

  // Search todos via title and tagname
  let searchCardsSection = document.querySelector("#search-cards");
  let searchForm = document.getElementById("search-form");

  searchForm.addEventListener("submit", async (event) => {
    while (searchCardsSection.firstChild) {
      searchCardsSection.removeChild(searchCardsSection.firstChild);
    }
    event.preventDefault();
    const formData = new FormData(event.target);
    const searchTitle = formData.get("search-title");
    const searchTag = formData.get("search-tag");

    const response = await fetch(
      `${API_KEY}/search?title=${searchTitle}&tag=${searchTag}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    const searchTasks = await response.json();
    if (searchTasks.error) {
      await refreshTokens();
    }
    console.log(typeof searchTasks);

    searchTasks.forEach((task) => {
      searchCardsSection.appendChild(createCard(task));
    });
  });
}
