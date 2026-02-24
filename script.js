if ("Notification" in window) {
  Notification.requestPermission();
}
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const taskList = document.getElementById("taskList");

document.getElementById("currentDate").innerText =
  new Date().toDateString();

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  const time = document.getElementById("taskTime").value;
  const priority = document.getElementById("priority").value;
  const repeat = document.getElementById("repeat").value;

  if (!text || !time) return;

  tasks.push({
    text,
    dueDate,
    time,
    priority,
    repeat,
    completed: false,
    notified: false
  });

  saveTasks();
  renderTasks();
  clearInputs();
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const div = document.createElement("div");

    div.className =
      "bg-purple-800 p-4 rounded-lg flex justify-between items-center";

    div.innerHTML = `
      <div>
        <p class="${task.completed ? "line-through text-gray-500" : ""}">
          ${task.text}
        </p>
        <p class="text-sm text-purple-400">
          Due: ${task.dueDate || "No date"} | Priority: 
          <span class="${getPriorityColor(task.priority)}">
            ${task.priority}
          </span>
        </p>
      </div>
      <div class="flex gap-2">
        <button onclick="toggleTask(${index})"
          class="bg-green-600 px-3 py-1 rounded">
          ✓
        </button>
        <button onclick="deleteTask(${index})"
          class="bg-red-600 px-3 py-1 rounded">
          X
        </button>
      </div>
    `;

    taskList.appendChild(div);
  });
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearInputs() {
  document.getElementById("taskInput").value = "";
  document.getElementById("dueDate").value = "";
}

function getPriorityColor(priority) {
  if (priority === "High") return "text-red-400";
  if (priority === "Medium") return "text-yellow-400";
  return "text-green-400";
}

renderTasks();

function checkReminders() {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().slice(0, 5);

  tasks.forEach(task => {
    const isToday =
      task.repeat === "daily" ||
      task.dueDate === currentDate;

    if (
      isToday &&
      task.time === currentTime &&
      !task.notified
    ) {
      alert("⏰ Reminder!\n\n" + task.text);

      task.notified = true;

      saveTasks();
    }
  });
}

setInterval(checkReminders, 10000);

function clearInputs() {
  document.getElementById("taskInput").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("taskTime").value = "";
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker Registered"));

}
