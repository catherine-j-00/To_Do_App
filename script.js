// =======================================DOM ELEMENTS =================================================
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
// =======================================Auth ELEMENTS =================================================
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const loginError = document.getElementById('login-error');
const userDisplayName = document.getElementById('user-display-name');
const logoutBtn = document.getElementById('logout-btn');
// ======================================== TASK ELEMENTS ================================================
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const taskCount = document.getElementById('task-count');

// ==========================================STATE MANAGEMENT ===============================================
let currentUser = null;
let tasks = [];

// =========================================INITIALISATION ===================================================
document.addEventListener('DOMContentLoaded',() =>
{
    //check if a user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if(savedUser){
        currentUser = savedUser;
        showDashboard();
    }
    else {
        showLogin();
    }
});

// =========================================== AUTHENTICATION LOGIC =============================================
loginForm.addEventListener('submit',(e)=>
{
    e.preventDefault();
    const username = usernameInput.value.trim();
    if(username === '')
    {
        loginError.textContent = 'Please enter a valid username.';
        return;
    }
    // Save session to Local storage
    currentUser = username;
    localStorage.setItem('currentUser',currentUser);
    // Reset the form and view dashboard
    loginError.textContent = '';
    loginForm.reset();
    showDashboard();
});

logoutBtn.addEventListener('click',() =>
{
    //Clear user session
    localStorage.removeItem('currentUser');
    currentUser = null;
    tasks = [];
    showLogin();
});

function showLogin()
{
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
}

function showDashboard()
{
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    userDisplayName.textContent = currentUser;
    // Load user-specific tasks from Local Storage
    loadTasks();
}

//================================================ TASK LOGIC =============================================
// Load task for current user 
function loadTasks()
{
    const storedTasks = localStorage.getItem(`tasks_${currentUser}`);
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
    renderTasks();
}

// save tasks array to local Storage
function saveTasks()
{
    localStorage.setItem(`tasks_${currentUser}`,JSON.stringify(tasks));
    renderTasks();
}

// ADD Task
taskForm.addEventListener('submit',(e) => 
{
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if(!taskText) return;
    const newTask ={
        id: Date.now().toString(),//unique ID using timestamp
        text: taskText,completed: false
    };
    tasks.push(newTask);
    saveTasks();
    taskInput.value = '';
});

// Toggle Task Completion status 
function toggleTask(id){
    tasks = tasks.map(task =>{
        if(task.id===id){
            return {...task,completed: !task.completed };
        }
        return task;
    });
    saveTasks();
}

//Delete Task
function deleteTask(id){
    tasks=tasks.filter(task => task.id !== id);
    saveTasks();
}

// =============================================RENDER LOGIC =========================================================
function renderTasks()
{
    //Clear list content 
    taskList.innerHTML ='';
    //Handle empty state
    if(tasks.length===0)
    {
        emptyState.classList.remove('hidden');
    }
    else{
        emptyState.classList.add('hidden');
    }
    //Render individual task items
    tasks.forEach(task =>{
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `<div class="task-content ${task.completed ? 'completed' : ''}" onclick = "toggleTask('${task.id}')">
                         <i class = "fa-regular ${task.completed ? 'fa-square-check': 'fa-square'}"></i>
                         <span>${escapeHTML(task.text)}</span>
                         </div>
                         <div class = "task-actions">
                         <button class="btn-icon" onclick = "deleteTask('${task.id}')"title = "Delete Task">
                         <i class = "fa-solid fa-trash"></i>
                         </button>
                         </div>`;
            taskList.appendChild(li);
    });
    
    // Update badge counter
    const pendingCount = tasks.filter(t => ! t.completed).length;
    taskCount.textContent = `${pendingCount} pending`;
}

// Helper to escape HTML characters  and prevent basic XSS
function escapeHTML(str)
{
    return str.replace(/[&<>'"]/g,tag => ({'&': '&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[tag] || tag));
}