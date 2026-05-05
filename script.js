let tasks = [];

// ====== SELECTORS ======
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const filterSubject = document.getElementById('filterSubject');
const sortDateBtn = document.getElementById('sortDate');
const clearAllBtn = document.getElementById('clearAll');
const loadApiBtn = document.getElementById('loadApi');

// ====== RENDER TASKS ======
const renderTasks = (taskArray = tasks) => {
    taskList.innerHTML = "";

    if (taskArray.length === 0) {
        taskList.innerHTML = "<li>No tasks yet</li>";
        return;
    }

    taskArray.forEach(({ taskName, subject, dueDate }) => {
        const li = document.createElement('li');
        li.textContent = `${taskName} | ${subject} | Due: ${dueDate}`;
        taskList.appendChild(li);
    });
};

// ====== ADD TASK ======
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskName = document.getElementById('taskName').value.trim();
    const subject = document.getElementById('subject').value;
    const dueDate = document.getElementById('dueDate').value;

    if (!taskName || !dueDate) {
        alert("Please fill all fields");
        return;
    }

    tasks.push({
        id: Date.now(),
        taskName,
        subject,
        dueDate
    });

    taskForm.reset();
    renderTasks();
});

// ====== FILTER ======
filterSubject.addEventListener('change', () => {
    const value = filterSubject.value;

    if (value === "All") {
        renderTasks();
    } else {
        const filtered = tasks.filter(task => task.subject === value);
        renderTasks(filtered);
    }
});

// ====== SORT ======
sortDateBtn.addEventListener('click', () => {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    renderTasks();
});

// ====== CLEAR ALL ======
clearAllBtn.addEventListener('click', () => {
    tasks = [];
    renderTasks();
});

// ====== LOAD API ======
loadApiBtn.addEventListener('click', async() => {
    loadApiBtn.disabled = true;
    loadApiBtn.textContent = 'Loading...';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=3');
        const apiTasks = await response.json();
        const subjects = ['Math', 'Science', 'English'];

        apiTasks.forEach((task, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i + 1);

            tasks.push({
                id: Date.now() + i,
                taskName: task.title,
                subject: subjects[i % 3],
                dueDate: date.toISOString().split('T')[0]
            });
        });

        renderTasks();
        alert('Loaded 3 tasks from API!');
    } catch (error) {
        alert('Error loading API data');
        console.error(error);
    } finally {
        loadApiBtn.disabled = false;
        loadApiBtn.textContent = 'Load API Data';
    }
});

// ====== INITIAL LOAD ======
renderTasks();