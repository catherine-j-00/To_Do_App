// ---------- 1. Grab elements ----------
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const clearBtn = document.getElementById("clearBtn");
const filterButtons = document.querySelectorAll(".filter");
// ---------- 2. State ----------
let tasks = loadTasks(); // the single source of truth
let currentFilter = "all"; // "all" | "active" | "completed"
// ---------- 3. Storage ----------
function saveTasks() {
localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
try {
return JSON.parse(localStorage.getItem("tasks")) || [];
} catch (e) {
return [];
}
}
// ---------- 4. Actions (change data, then redraw) ----------
function addTask() {
const text = taskInput.value.trim();
if (text === "") return; // ignore empty input
tasks.push({ id: Date.now(), text: text, done: false });
taskInput.value = "";
taskInput.focus();
update();
}
function toggleTask(id) {
tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
update();
}
function deleteTask(id) {
tasks = tasks.filter((t) => t.id !== id);
update();
}
function clearCompleted() {
tasks = tasks.filter((t) => !t.done);
update();
}
function setFilter(filter) {
currentFilter = filter;
filterButtons.forEach((b) =>
b.classList.toggle("active", b.dataset.filter === filter)
);
render();
}
// ---------- 5. Drawing the page ----------
function visibleTasks() {
if (currentFilter === "active") return tasks.filter((t) => !t.done);
if (currentFilter === "completed") return tasks.filter((t) => t.done);
return tasks;
}
function render() {
taskList.innerHTML = ""; // wipe the old list
visibleTasks().forEach((task) => {
const li = document.createElement("li");
if (task.done) li.classList.add("done");
const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = task.done;
checkbox.addEventListener("change", () => toggleTask(task.id));
const span = document.createElement("span");
span.textContent = task.text; // textContent = safe
const del = document.createElement("button");
del.className = "delete";
del.textContent = "\u00D7";
del.setAttribute("aria-label", "Delete task");
del.addEventListener("click", () => deleteTask(task.id));
li.append(checkbox, span, del);
taskList.appendChild(li);
});
const left = tasks.filter((t) => !t.done).length;
counter.textContent = left + (left === 1 ? " task left" : " tasks left");
}
// save + redraw together
function update() {
saveTasks();
render();
}
// ---------- 6. Events ----------
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
if (e.key === "Enter") addTask();
});
clearBtn.addEventListener("click", clearCompleted);
filterButtons.forEach((b) =>
b.addEventListener("click", () => setFilter(b.dataset.filter))
);
// ---------- 7. First draw ----------
render();