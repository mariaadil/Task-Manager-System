
    document.addEventListener('DOMContentLoaded', function() {
    const tasksList = document.getElementById('tasks-list');
    const taskForm = document.getElementById('task-form');
    const API_URL = 'https://jsonplaceholder.typicode.com/todos'; // Dummy API URL
    let tasks = []; // Initialize tasks as an array
  
    // Function to fetch tasks from API
    function fetchTasks() {
      fetch(API_URL)
        .then(response => response.json())
        .then(data => {
          tasks = data; // Update tasks array with fetched data
          renderTasks(tasks);
        })
        .catch(error => {
          console.error('Error fetching tasks:', error);
        });
    }
  
    // Function to render tasks
    function renderTasks(tasks) {
      tasksList.innerHTML = ''; // Clear previous tasks
  
      tasks.forEach(task => {
        const card = `
          <div class="col-md-4 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.completed ? 'Completed' : 'Pending'}</p>
                <button type="button" class="btn btn-primary mr-2 edit-btn" data-id="${task.id}">Edit</button>
                <button type="button" class="btn btn-danger delete-btn" data-id="${task.id}">Delete</button>
              </div>
            </div>
          </div>
        `;
        tasksList.insertAdjacentHTML('beforeend', card);
      });
  
      // Attach event listeners to edit and delete buttons after rendering
      attachEditDeleteListeners();
    }
  
    // Function to attach event listeners to edit and delete buttons
    function attachEditDeleteListeners() {
      const editButtons = document.querySelectorAll('.edit-btn');
      const deleteButtons = document.querySelectorAll('.delete-btn');
  
      // Edit button click handler
      editButtons.forEach(button => {
        button.addEventListener('click', function() {
          const taskId = button.getAttribute('data-id');
          editTask(taskId);
        });
      });
  
      // Delete button click handler
      deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
          const taskId = button.getAttribute('data-id');
          deleteTask(taskId);
        });
      });
    }
  
    // Function to handle editing a task
    function editTask(taskId) {
      // Fetch task details for editing
      fetch(`${API_URL}/${taskId}`)
        .then(response => response.json())
        .then(task => {
          // Display a modal or form to edit task details
          const updatedTitle = prompt('Enter updated task title:', task.title);
          if (updatedTitle !== null) {
            const updatedTask = { title: updatedTitle, completed: task.completed };
  
            fetch(`${API_URL}/${taskId}`, {
              method: 'PUT',
              body: JSON.stringify(updatedTask),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            })
              .then(response => response.json())
              .then(data => {
                console.log('Task updated:', data);
                // Update the task in the UI
                const updatedTaskIndex = tasks.findIndex(t => t.id === parseInt(taskId));
                tasks[updatedTaskIndex] = data;
                renderTasks(tasks); // Re-render tasks after editing
              })
              .catch(error => {
                console.error('Error updating task:', error);
              });
          }
        })
        .catch(error => {
          console.error('Error fetching task details:', error);
        });
    }
  
    // Function to delete a task by ID
    function deleteTask(taskId) {
      if (confirm('Are you sure you want to delete this task?')) {
        fetch(`${API_URL}/${taskId}`, {
          method: 'DELETE'
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to delete task');
            }
            console.log('Task deleted successfully.');
            // Remove the task from the UI
            tasks = tasks.filter(task => task.id !== parseInt(taskId));
            renderTasks(tasks); // Re-render tasks after deletion
          })
          .catch(error => {
            console.error('Error deleting task:', error);
          });
      }
    }
  
    // Event listener for task form submission
    taskForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const taskDescription = document.getElementById('task-description').value;
      const newTask = {
        title: taskDescription,
        completed: false
      };
  
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log('New task added:', data);
          tasks.push(data); // Add new task to local tasks array
          renderTasks(tasks); // Refresh tasks after adding new task
          taskForm.reset();
        })
        .catch(error => {
          console.error('Error adding task:', error);
        });
    });
  
    // Initial fetch and render tasks
    fetchTasks();
  });
  
