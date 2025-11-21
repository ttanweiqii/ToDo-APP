document.addEventListener("DOMContentLoaded", () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));

  if (storedTasks) {
    storedTasks.forEach((task) => tasks.push(task));
    updateTasksList();
    updateStats();
  }
});

let tasks = [];
let editIndex = null;

// Utility function to show alert message
const showAlertMessage = (message, color = "green") => {
  const alertContainer = document.getElementById("alertContainer");
  alertContainer.innerHTML = "";

  const alertMessage = document.createElement("p");
  alertMessage.id = "alertMessage";
  alertMessage.textContent = message;
  alertMessage.style.color = color;
  alertMessage.style.fontSize = "18px";
  alertMessage.style.textAlign = "center";
  alertMessage.style.marginTop = "5px";
  alertMessage.style.fontWeight = "bold";

  alertContainer.appendChild(alertMessage);

  // Gradually fade out and remove the alert message after 5 seconds
  setTimeout(() => {
    alertMessage.classList.add("fade-out");
    setTimeout(() => {
      alertMessage.remove();
    }, 1000); // Match the CSS animation duration
  }, 1000); // Display the alert for 1 seconds before fading out
};

// Add Task
const addTask = () => {
  const taskInput = document.getElementById("taskInput");
  const text = taskInput.value.trim();

  if (text) {
    if (editIndex !== null) {
      tasks[editIndex].text = text;
      editIndex = null;
      showAlertMessage("Task updated successfully!", "blue");
    } else {
      tasks.push({ text: text, completed: false });
      showAlertMessage("Task added successfully!", "green");
    }
    taskInput.value = "";
    updateTasksList();
    updateStats();
    saveTasks();
  } else {
    showAlertMessage("Please enter a task!", "red");
  }
};

// Toggle Task Completion
const toggleTaskComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  updateTasksList();
  updateStats();
  saveTasks();
};

// Delete Task
const deleteTask = (index) => {
  tasks.splice(index, 1);
  updateTasksList();
  updateStats();
  saveTasks();
  showAlertMessage("Task deleted successfully!", "orange");
};

// Edit Task
const editTask = (index) => {
  const taskInput = document.getElementById("taskInput");
  taskInput.value = tasks[index].text;
  editIndex = index;
  showAlertMessage("Edit mode activated!", "blue");
};

// Update Task Status
const updateStats = () => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;
  const progressBar = document.getElementById("progress");

  progressBar.style.width = `${progress}%`;

  document.getElementById("numbers").innerText =
    `${completedTasks} / ${totalTasks}`;

  if (tasks.length && completedTasks === totalTasks) {
    blaskConfetti();
  }
};

// Update Task List
const updateTasksList = () => {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("taskItem");

    listItem.innerHTML = `
        <div class="task ${task.completed ? "completed" : ""}">
          <input type="checkbox" class="checkbox" ${
            task.completed ? "checked" : ""
          } />
          <p>${task.text}</p>
        </div>
        <div class="icons">
          ${
            !task.completed
              ? `<img src="images/pencil.png" onClick="editTask(${index})" />`
              : ""
          }
          <img src="images/bin.png" onClick="deleteTask(${index})" />
        </div>
      `;
    listItem
      .querySelector(".checkbox")
      .addEventListener("change", () => toggleTaskComplete(index));
    taskList.append(listItem);
  });
};

// Save tasks to local storage
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Load tasks from local storage
document.addEventListener("DOMContentLoaded", () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (storedTasks) {
    tasks = storedTasks;
    updateTasksList();
    updateStats();
  }
});

document.getElementById("newTask").addEventListener("click", (e) => {
  e.preventDefault();
  addTask();
});

const blaskConfetti = () => {
  const count = 200,
    defaults = {
      origin: { y: 0.7 },
    };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      }),
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};
