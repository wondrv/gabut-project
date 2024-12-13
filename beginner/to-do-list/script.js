document.getElementById("add-task").addEventListener("click", function() {
    const taskInput = document.getElementById("task-input");
    const taskText = taskInput.value.trim();
  
    if (taskText) {
      const taskList = document.getElementById("task-list");
  
      const listItem = document.createElement("li");
      listItem.className = "task-item";
  
      const taskSpan = document.createElement("span");
      taskSpan.textContent = taskText;
  
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
  
      deleteBtn.addEventListener("click", function() {
        taskList.removeChild(listItem);
      });
  
      listItem.appendChild(taskSpan);
      listItem.appendChild(deleteBtn);
  
      taskList.appendChild(listItem);
  
      taskInput.value = "";
    } else {
      alert("Please enter a task.");
    }
  });
  