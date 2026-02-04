// Get elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
addTaskBtn.addEventListener("click", addTask);
const taskList = document.getElementById("taskList");

// Load tasks when page starts
window.onload = loadTasks;

// Function to add a new task
function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }
  createTaskElement(taskText);
  saveTask(taskText);
  taskInput.value = "";
}

// Function to create a task <li>
function createTaskElement(taskText, completed = false) {
  const li = document.createElement("li");

// Task text span (so we can edit separately from ❌ button)
const span = document.createElement("span");
span.textContent = taskText;
li.appendChild(span);
  if (completed) {
    li.classList.add("completed");
  }

  // Toggle completed
  li.addEventListener("click", function () {
    li.classList.toggle("completed");
    updateStorage();
  });

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.style.background = "red";
  deleteBtn.style.color = "white";
  deleteBtn.style.border = "none";
  deleteBtn.style.borderRadius = "5px";
  deleteBtn.style.padding = "5px 8px";
  deleteBtn.style.cursor = "pointer";

  deleteBtn.onclick = function () {
    li.remove();
    updateStorage();
  };

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// Save a new task to storage
function saveTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from storage
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    createTaskElement(task.text, task.completed);
  });
}

// Update storage after changes
function updateStorage() {
  let tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.firstChild.textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Button + Enter key
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});
const toggleModeBtn = document.getElementById("toggleModeBtn");

// Load mode from storage
if (localStorage.getItem("mode") === "dark") {
  document.body.classList.add("dark-mode");
  toggleModeBtn.textContent = "☀️ Light Mode";
}

toggleModeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    toggleModeBtn.textContent = "☀️ Light Mode";
    localStorage.setItem("mode", "dark");
  } else {
    toggleModeBtn.textContent = "🌙 Dark Mode";
    localStorage.setItem("mode", "light");
  }
});
// Edit task on double-click
span.addEventListener("dblclick", function () {
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.style.flex = "1";
  input.style.padding = "5px";
  input.style.fontSize = "14px";

  // Replace span with input
  li.replaceChild(input, span);
  input.focus();

  // Save changes on Enter or blur
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      saveEdit();
    }
  });
  input.addEventListener("blur", saveEdit);

  function saveEdit() {
    span.textContent = input.value.trim() || "Untitled Task";
    li.replaceChild(span, input);
    updateStorage();
  }
});