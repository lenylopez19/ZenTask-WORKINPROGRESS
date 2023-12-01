$(document).ready(function () {
  function sendDataPost(url, data, func) {
    $.post(url, data, (response, status) => {
      console.log(status);
      console.log(response);
      const isFunc = typeof func == "function";
      if (isFunc) {
        func();
      }
    });
  }

  function getDataFrom(url, dataType) {
    const promise = $.ajax({
      url: url,
      type: "GET",
      dataType: dataType,
    });
    return promise;
  }

  function loadTasks() {
    const taskContainer = $(".task__container");
    getDataFrom("php/readTasks.php", "json")
      .then((data) => {
        for (entry of data) {
          const existItem = $("#" + entry.id).length;
          if (!existItem) {
            const completed = entry.completed === "1";
            const importance = entry.importance === "1";
            const rowItem = generateElement({tag: "div",classes: ["rowItem"],id: entry.id,});
            const rowContent = createTaskItemFromObj(entry);
            if (completed) rowContent.classList.add("completed");
            if (importance) rowItem.classList.add("important");
            rowItem.append(rowContent);
            const optionMenu = generateElement({tag: "div",classes: ["optionMenu"],});
            const importanceBtn = generateElement({tag: "div",classes: ["setImportant", "optionButton"],textContent: "! Important",});
            const editBtn = generateElement({tag: "div",classes: ["edit", "optionButton"],textContent: "Edit",});
            const deleteBtn = generateElement({tag: "div",classes: ["delete", "optionButton"],textContent: "Delete",});
            optionMenu.append(importanceBtn);
            optionMenu.append(editBtn);
            optionMenu.append(deleteBtn);
            rowItem.prepend(optionMenu);
            taskContainer.append(rowItem);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function TaskSender() {
    const value = $("#taskText").val();
    const data = {
      task: value,
    };
    sendDataPost("php/WriteData.php", data, loadTasks);
  }

  function setCompletedStatus(task) {
    const id = seekId(task).id;
    const data = { id: id };
    $(task).toggleClass("completed");

    $(task).hasClass("completed")
      ? (data["completed"] = 1)
      : (data["completed"] = 0);

    sendDataPost("php/updateTask.php", data);
  }

  function setImportantStatus(task) {
    const rowItem = seekId(task);
    $(rowItem).toggleClass("important");
    const data = {
      id: rowItem.id,
    };
    $(rowItem).hasClass("important")
      ? (data["importance"] = 1)
      : (data["importance"] = 0);
    sendDataPost("php/updateImportance.php", data);
  }

  function seekId(element) {
    while (!element.id) {
      element = element.parentElement;
    }
    return element;
  }

  $(".task__container").on("click", ".row_content", function (event) {
    setCompletedStatus(event.currentTarget);
  });

  $(".task__container").on("click", ".setImportant", function (event) {
    setImportantStatus(event.currentTarget);
  });

  function generateElement(obj) {
    const { tag, type, id, value, classes, textContent } = obj;
    const newElement = document.createElement(tag);
    if (type) newElement.type = type;
    if (value) newElement.value = value;
    if (id) newElement.setAttribute("id", id);
    if (textContent) newElement.innerText = textContent;
    if (classes) {
      for (const _class of classes) {
        newElement.classList.add(_class);
      }
    }
    return newElement;
  }

  function textAeraAutoHeight(textArea) {
    textArea.style.height = "auto";
    textArea.style.height = textArea.scrollHeight + "px";
  }

  function updateTask(taskObj) {
    const updatedTask = document.getElementById("task-" + taskObj.id).value;
    if (updatedTask !== taskObj.task) {
      taskObj.task = updatedTask;
      sendDataPost("php/updateTask.php", taskObj);
    }
    renderUpdatedTask(taskObj);
  }

  function createTaskObj(rowItem) {
    taskId = rowItem.getAttribute("id");
    taskText = rowItem.querySelector(".row_content >p").textContent;
    return {
      id: taskId,
      task: taskText,
    };
  }

  function createTaskItemFromObj(taskObj) {
    const row_content = generateElement({tag: "div",classes: ["row_content"],});
    const circleIcon = generateElement({tag: "span",classes: ["circle__icon"],});
    const task = generateElement({tag: "p",classes: ["task-" + taskObj.id],textContent: taskObj.task,});
    row_content.append(circleIcon);
    row_content.append(task);
    return row_content;
  }

  function renderUpdatedTask(taskObj) {
    const rowItem = document.getElementById(taskObj.id);
    const task = createTaskItemFromObj(taskObj);
    const textArea = rowItem.querySelector("#task-" + taskObj.id);
    textArea.remove();
    rowItem.append(task);
  }

  $(".task__container").on("click", ".edit", function () {
    const element = this.parentElement.parentElement;
    const taskData = createTaskObj(element);
    const editTextBox = generateElement({tag: "textarea",classes: ["editingTask"],id: "task-" + taskData.id, value: taskData.task,});
    editTextBox.addEventListener("input", function () {
      textAeraAutoHeight(this);
    });
    editTextBox.addEventListener("keydown", function (e) {
      if (e.key === "Enter") updateTask(taskData);
    });
    element.querySelector(".row_content").remove();
    element.append(editTextBox);
    textAeraAutoHeight(editTextBox);
    editTextBox.focus();
  });

  $(".task__container").on("click", ".delete", function () {
    const currentElement = this.parentElement.parentElement;
    currentElement.classList.toggle("toDelete");
    const taskOptions = document.querySelector(".taskOptions");
    const tasks = document.getElementsByClassName("toDelete");
    if (tasks.length) {
      taskOptions.style.backgroundColor = "#E47575";
      taskOptions.textContent = "CONFIRM";
    } else {
      taskOptions.style.backgroundColor = "#2197CA";
      taskOptions.textContent = "Done";
    }
  });

  $(".taskOptions").on("click", function () {
    const status = this.getAttribute("data-status");
    const tasks = document.getElementsByClassName("optionMenu");
    const parent = tasks[0].parentElement.parentElement;
    parent.style.opacity = 0;
    this.innerText = "Done";
    setTimeout(() => {
      if (status === "0") {
        for (element of tasks) {
          element.parentElement.style.border = "4px dashed white";
          element.style.display = "flex";
          element.style.opacity = "1";
        }
        this.dataset.status = "1";
      } else if (status === "1") {
        const tasksToDelete = Array.from(
          document.getElementsByClassName("toDelete")
        );
        if (tasksToDelete.length) {
          const idArr = [];
          tasksToDelete.forEach((task) => {
            idArr.push(task.getAttribute("id"));
            task.remove();
          });
          const data = {
            id: idArr,
          };
          sendDataPost("php/deleteTask.php", data);
        }
        for (element of tasks) {
          element.parentElement.removeAttribute("style");
          element.removeAttribute("style");
        }
        this.dataset.status = "0";
        this.innerText = "Task options";
        this.removeAttribute("style");
      }
      parent.style.opacity = 1;
    }, 300);
  });

  $("#taskForm").submit(function (e) {
    e.preventDefault();
    TaskSender();
    $(this).trigger("reset");
  });

  //  START ===== ios spesifics for installed webApp

  if (window.navigator.standalone === true) {
    $("#taskForm").css({
      position: "fixed",
      bottom: "0",
      left: "0",
      "max-width": "400px",
      "background-color": "white",
      inset: "0",
      margin: "auto auto 0",
      height: "80px",
    });

    $(".task__text").css({
      margin: "0",
      "box-shadow": "none",
      "border-radius": "0",
      "text-indent": "4rem",
    });

    $("#addTaskButton").css({
      right: "15px",
      top: "-30px",
    });

    $(".suggestion").css({
      margin: "5px 40px 15px",
    });

    $(".task__container").css({
      "margin-bottom": "40px",
    });
    //    $(".taskOptions").css({
    //     "margin":"10px"
    //    })

    //    $(".appTitle").css({
    //     "margin":"1.4rem 2.4rem 1.8rem"
    //    })

    const div = "<div class='spacer'></div>";
    $("#appWrapper").append(div);
  }

  //  END ===== ios spesifics for installed webApp

  // document.body.addEventListener('touchmove', function(event) {
  //     event.preventDefault();
  //   }, false);

  //submenu item code

  // document.addEventListener("DOMContentLoaded", function(event) {
  //     var touchStartTimestamp;

  // });

  loadTasks();
});
