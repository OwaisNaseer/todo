const currentDate = document.getElementById("current-date");
const currentTime = document.getElementById("current-time");
const AddDateAndTime = document.getElementById("add-date-and-time");
const AddDateAndTimeInput = document.getElementById("datetime-input");
const AddButton = document.getElementById("add-button");
const AddTaskInput = document.getElementById("title-input");
const listContainer = document.getElementById("list-container");
const taskScreen = document.getElementById("task-screen");
const doneScreen = document.getElementById("done-screen");
const changeStatus = document.getElementById("change-status");

let isTaskScreen = true;
let isdoneScreen = false;

const showOrHideSecondInput = function () {
  if (AddDateAndTime.textContent === ">") {
    AddDateAndTime.textContent = "<";
    AddDateAndTimeInput.style.display = "block";
  } else {
    AddDateAndTime.textContent = ">";
    AddDateAndTimeInput.style.display = "none";
  }
};

const hideSecondInput = function (event) {
  if (
    AddDateAndTimeInput.style.display === "block" &&
    event.target !== AddDateAndTime
  ) {
    AddDateAndTimeInput.style.display = "none";
    AddDateAndTime.textContent = ">";
  }
};

const inputValidation = function () {
  if (AddTaskInput.value.trim() && AddDateAndTimeInput.value.trim()) {
    AddButton.style.backgroundColor = "#20eeb0";
    AddButton.style.cursor = "pointer";
  } else {
    AddButton.style.backgroundColor = "#888888";
    AddButton.style.cursor = "not-allowed";
  }
};

function currentDateTime() {
  currentDate.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
  });
  currentTime.textContent = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

setInterval(currentDateTime, 1000);
AddDateAndTime.addEventListener("click", showOrHideSecondInput);
document.addEventListener("input", inputValidation);
document.addEventListener("click", hideSecondInput);

class Todo {
  constructor() {
    this.tasks = [];
    this.eventListener();
  }

  eventListener() {
    AddButton.addEventListener("click", this.addButtonHandler.bind(this));
    taskScreen.addEventListener("click", this.handleTaskScreen.bind(this));
    doneScreen.addEventListener("click", this.handleDoneScreen.bind(this));
  }

  addButtonHandler() {
    if (
      AddTaskInput.value.trim() === "" ||
      AddDateAndTimeInput.value.trim() === ""
    ) {
      return;
    }

    this.tasks.push({
      title: AddTaskInput.value.trim(),
      datetime: AddDateAndTimeInput.value.trim(),
      status: "pending",
    });

    this.renderTodo();
    this.resetInputs();
  }

  renderTodo() {
    listContainer.innerHTML = "";

    if (isTaskScreen) {
      if (this.tasks?.length > 0) {
        this.tasks.forEach((task, index) => {
          listContainer.innerHTML += `
          <div style="display: flex; justify-content: space-between; align-items: center; ${
            task.status === "status-done" ? "width: 90%;" : "width: 85%;"
          } margin-top: 20px;" data-index="${index}">

            <div class="list-container">
              <p class="list-title">
                ${task.title} 
                <span class="change-status ${"status-done"}" data-index="${index}">
                  ${task.status === "pending" ? "" : "Done"}
                </span>
              </p>
              <p class="list-time">${new Date(
                task.datetime
              ).toLocaleString()}</p>
            </div>
            <div style="display: flex; gap: 3px; align-items: center; width:35px">
            ${
              task.status === "pending"
                ? `<img class="change-status status-done" data-index="${index}" src="./tickIcon.svg">`
                : `<div style="width: 100px;"></div>`
            }
            
              <img src="./akar-icons_trash-can.svg" class="delete-icon" style="cursor: pointer;" data-index="${index}">
            </div>
          </div>
        `;
        });

        const deleteIcons = document.querySelectorAll(".delete-icon");
        deleteIcons.forEach((icon) => {
          icon.addEventListener("click", (event) => {
            const index = event.target.getAttribute("data-index");
            this.deleteTask(index);
          });
        });

        const changeStatusButtons = document.querySelectorAll(".change-status");
        changeStatusButtons.forEach((button) => {
          button.addEventListener("click", (event) => {
            const index = event.target.getAttribute("data-index");
            this.handleChangeStatus(index);
          });
        });
      } else {
        listContainer.innerHTML = "<p>No tasks added.</p>";
      }
    } else if (isdoneScreen) {
      const doneTasks = this.tasks.filter((task) => task.status === "done");

      if (doneTasks.length > 0) {
        listContainer.innerHTML = "";

        doneTasks.forEach((task, index) => {
          listContainer.innerHTML += `
            <div  style='  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  margin-top: 20px;' data-index="${index}">
              <div class="list-container">
                <p class="list-title">
                  ${task.title}
                  
                </p>
                <p class="list-time">${new Date(
                  task.datetime
                ).toLocaleString()}</p>
              </div>
              <div style="display: flex; gap: 3px; align-items: center; width:200px"">
                <img src="./akar-icons_trash-can.svg" class="delete-icon" style="cursor: pointer;" data-index="${index}">
              </div>
            </div>
          `;
        });

        const deleteIcons = document.querySelectorAll(".delete-icon");
        deleteIcons.forEach((icon) => {
          icon.addEventListener("click", (event) => {
            const index = event.target.getAttribute("data-index");
            this.deleteTask(index);
          });
        });

        const changeStatusButtons = document.querySelectorAll(".change-status");
        changeStatusButtons.forEach((button) => {
          button.addEventListener("click", (event) => {
            const index = event.target.getAttribute("data-index");
            this.handleChangeStatus(index);
          });
        });
      } else {
        listContainer.innerHTML = "<p>No completed tasks.</p>";
      }
    }
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
    this.renderTodo();
  }

  resetInputs() {
    AddTaskInput.value = "";
    AddDateAndTimeInput.value = "";
    AddButton.style.backgroundColor = "#888888";
    AddButton.style.cursor = "not-allowed";
  }

  handleTaskScreen() {
    if (!isTaskScreen) {
      isTaskScreen = true;
      isdoneScreen = false;
      taskScreen.style.background = "blue";
      taskScreen.style.color = "white";
      doneScreen.style.background = "white";
      doneScreen.style.color = "black";

      doneScreen.style.borderRadius = "10px";
      this.renderTodo();
    }
  }

  handleDoneScreen() {
    if (!isdoneScreen) {
      doneScreen.style.borderRadius = "10px";
      isdoneScreen = true;
      isTaskScreen = false;
      taskScreen.style.background = "white";
      taskScreen.style.color = "black";
      doneScreen.style.background = "blue";
      doneScreen.style.color = "white";
      this.renderTodo();
    }
  }

  handleChangeStatus(index) {
    const task = this.tasks[index];
    if (task.status === "pending") {
      task.status = "done";
      document.getElementsByClassName("todo-list").style.width = "90%";
    }

    this.renderTodo();
  }
}

new Todo();
