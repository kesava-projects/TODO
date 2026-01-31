const API_BASE_URL = "/api/tasks";

let tasks = [];

let currentFilter = "all";
let searchQuery = "";
let calendarFilterDate = null;

const tasksContainer = document.getElementById("tasksContainer");
const tasksCountEl = document.getElementById("tasksCount");
const todayDateEl = document.getElementById("todayDate");

const filterButtons = document.querySelectorAll(".filter-button");
const seeAllButton = document.getElementById("seeAllButton");

const notificationButton = document.getElementById("notificationButton");
const notificationsDrawer = document.getElementById("notificationsDrawer");
const notificationsList = document.getElementById("notificationsList");
const closeNotifications = document.getElementById("closeNotifications");

const addTaskButton = document.getElementById("addTaskButton");
const calendarButton = document.getElementById("calendarButton");
const searchButton = document.getElementById("searchButton");

const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");

const calendarFilter = document.getElementById("calendarFilter");
const calendarDateInput = document.getElementById("calendarDate");
const clearCalendarFilter = document.getElementById("clearCalendarFilter");

const taskModal = document.getElementById("taskModal");
const closeTaskModal = document.getElementById("closeTaskModal");
const taskForm = document.getElementById("taskForm");
const modalTitle = document.getElementById("modalTitle");

const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const taskDateTimeInput = document.getElementById("taskDateTime");
const taskTypeInput = document.getElementById("taskType");
const taskPriorityInput = document.getElementById("taskPriority");
const taskEmailInput = document.getElementById("taskEmail");

let editingTaskId = null;

// API Functions
async function fetchTasks() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

async function createTask(taskData) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return await response.json();
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

async function updateTask(taskId, taskData) {
  try {
    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

async function deleteTask(taskId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete task");
    return await response.json();
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

function formatDateTime(isoString) {
  if (!isoString) return "No due date";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "No due date";
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;

  const options = { month: "short", day: "numeric" };
  const datePart = date.toLocaleDateString(undefined, options);

  return `${isToday ? "Today" : datePart} ${h12}:${minutes}${ampm}`;
}

function isTodayDate(isoString) {
  if (!isoString) return false;
  const date = new Date(isoString);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function isUpcoming(isoString) {
  if (!isoString) return false;
  const now = new Date();
  const date = new Date(isoString);
  return date.getTime() > now.getTime();
}

function isPrevious(isoString) {
  if (!isoString) return false;
  const now = new Date();
  const date = new Date(isoString);
  return date.getTime() < now.getTime();
}

function matchesCalendarFilter(isoString) {
  if (!calendarFilterDate) return true;
  if (!isoString) return false;
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const ymd = `${year}-${month}-${day}`;
  return ymd === calendarFilterDate;
}

function matchesSearch(task) {
  if (!searchQuery.trim()) return true;
  const q = searchQuery.toLowerCase();
  return (
    task.title.toLowerCase().includes(q) ||
    (task.description || "").toLowerCase().includes(q) ||
    (task.type || "").toLowerCase().includes(q)
  );
}

function filterTask(task) {
  if (!matchesSearch(task)) return false;
  if (!matchesCalendarFilter(task.datetime)) return false;

  switch (currentFilter) {
    case "today":
      return isTodayDate(task.datetime);
    case "upcoming":
      return isUpcoming(task.datetime);
    case "previous":
      return isPrevious(task.datetime);
    default:
      return true;
  }
}

function renderTasks() {
  tasksContainer.innerHTML = "";

  const filtered = tasks.filter(filterTask);

  filtered.forEach((task) => {
    const card = document.createElement("div");
    card.className = "each" + (task.completed ? " completed" : "");
    card.dataset.taskId = task._id;

    const top = document.createElement("div");
    top.className = "top";

    const priority = document.createElement("div");
    priority.className = "priority";
    priority.textContent = task.priority;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "round-check";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", async () => {
      try {
        await updateTask(task._id, { completed: checkbox.checked });
        await loadTasks();
        updateCounts();
        renderTasks();
      } catch (error) {
        console.error("Error updating task:", error);
        checkbox.checked = !checkbox.checked; // Revert on error
      }
    });

    top.appendChild(priority);
    top.appendChild(checkbox);

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = task.title;

    const description = document.createElement("p");
    description.className = "description";
    description.textContent = task.description || "";

    const footer = document.createElement("div");
    footer.className = "footer";

    const time = document.createElement("p");
    time.className = "time";
    time.textContent = formatDateTime(task.datetime);

    const type = document.createElement("p");
    type.className = "type";
    type.textContent = task.type || "other";

    footer.appendChild(time);
    footer.appendChild(type);

    card.appendChild(top);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(footer);

    card.addEventListener("dblclick", () => openEditModal(task._id));

    tasksContainer.appendChild(card);
  });
}

function updateCounts() {
  const todayTasks = tasks.filter(
    (t) => !t.completed && (t.datetime ? isTodayDate(t.datetime) : true),
  );
  tasksCountEl.textContent = todayTasks.length.toString();
}

function updateTodayDateDisplay() {
  const today = new Date();
  const options = { day: "numeric", month: "short" };
  todayDateEl.textContent = ` ${today.toLocaleDateString(undefined, options)}`;
}

function resetForm() {
  taskForm.reset();
  taskPriorityInput.value = "Low";
  taskTypeInput.value = "work";
  editingTaskId = null;
}

function openAddModal() {
  resetForm();
  modalTitle.textContent = "Add Task";
  taskModal.classList.remove("hidden");
  taskModal.setAttribute("aria-hidden", "false");
  taskTitleInput.focus();
}

function openEditModal(taskId) {
  const task = tasks.find((t) => t._id === taskId);
  if (!task) return;
  editingTaskId = taskId;
  modalTitle.textContent = "Edit Task";
  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description || "";
  taskTypeInput.value = task.type || "work";
  taskPriorityInput.value = task.priority || "Low";
  taskEmailInput.value = task.email || "";
  taskDateTimeInput.value = task.datetime
    ? new Date(task.datetime).toISOString().slice(0, 16)
    : "";
  taskModal.classList.remove("hidden");
  taskModal.setAttribute("aria-hidden", "false");
  taskTitleInput.focus();
}

function closeModal() {
  taskModal.classList.add("hidden");
  taskModal.setAttribute("aria-hidden", "true");
  editingTaskId = null;
}

function buildUpcomingNotifications() {
  notificationsList.innerHTML = "";
  const now = new Date();
  const inNext24Hours = tasks.filter((task) => {
    if (!task.datetime || task.completed) return false;
    const date = new Date(task.datetime);
    const diff = date.getTime() - now.getTime();
    return diff >= 0 && diff <= 24 * 60 * 60 * 1000;
  });

  if (!inNext24Hours.length) {
    const li = document.createElement("li");
    li.textContent = "No upcoming tasks in next 24h.";
    notificationsList.appendChild(li);
    return;
  }

  inNext24Hours
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    .forEach((task) => {
      const li = document.createElement("li");
      li.textContent = `${formatDateTime(task.datetime)} — ${task.title}`;
      notificationsList.appendChild(li);
    });
}

function toggleNotificationsDrawer() {
  const hidden = notificationsDrawer.classList.contains("hidden");
  if (hidden) {
    buildUpcomingNotifications();
    notificationsDrawer.classList.remove("hidden");
  } else {
    notificationsDrawer.classList.add("hidden");
  }
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

seeAllButton.addEventListener("click", () => {
  currentFilter = "all";
  filterButtons.forEach((b) => {
    b.classList.toggle("active", b.dataset.filter === "all");
  });
  searchQuery = "";
  searchInput.value = "";
  calendarFilterDate = null;
  calendarDateInput.value = "";
  renderTasks();
});

addTaskButton.addEventListener("click", () => openAddModal());

calendarButton.addEventListener("click", () => {
  calendarFilter.classList.toggle("hidden");
  searchBar.classList.add("hidden");
});

searchButton.addEventListener("click", () => {
  searchBar.classList.toggle("hidden");
  calendarFilter.classList.add("hidden");
  if (!searchBar.classList.contains("hidden")) {
    searchInput.focus();
  }
});

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value || "";
  renderTasks();
});

calendarDateInput.addEventListener("change", (e) => {
  calendarFilterDate = e.target.value || null;
  renderTasks();
});

clearCalendarFilter.addEventListener("click", () => {
  calendarFilterDate = null;
  calendarDateInput.value = "";
  renderTasks();
});

closeTaskModal.addEventListener("click", () => closeModal());

taskModal.addEventListener("click", (e) => {
  if (e.target === taskModal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!taskModal.classList.contains("hidden")) closeModal();
    if (!notificationsDrawer.classList.contains("hidden"))
      notificationsDrawer.classList.add("hidden");
  }
});

notificationButton.addEventListener("click", () => toggleNotificationsDrawer());
closeNotifications.addEventListener("click", () =>
  notificationsDrawer.classList.add("hidden"),
);

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskTitleInput.value.trim();
  if (!title) return;

  const description = taskDescriptionInput.value.trim();
  const type = taskTypeInput.value || "work";
  const priority = taskPriorityInput.value || "Low";
  const email = taskEmailInput.value.trim() || undefined;
  const datetime =
    taskDateTimeInput.value && taskDateTimeInput.value.length
      ? new Date(taskDateTimeInput.value).toISOString()
      : null;

  const taskData = {
    title,
    description,
    type,
    priority,
    email: email || null,
    datetime: datetime || null,
    completed: false,
  };

  try {
    if (editingTaskId) {
      await updateTask(editingTaskId, taskData);
    } else {
      await createTask(taskData);
    }

    await loadTasks();
    updateCounts();
    renderTasks();
    closeModal();
  } catch (error) {
    console.error("Error saving task:", error);
    alert("Failed to save task. Please try again.");
  }
});

async function loadTasks() {
  await fetchTasks();
  updateCounts();
  renderTasks();
}

function init() {
  updateTodayDateDisplay();
  loadTasks();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
