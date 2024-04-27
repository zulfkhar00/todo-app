import React, { Component, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Task } from "../models/Task";
import "../App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); // Default: show all tasks
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [taskDetails, setTaskDetails] = useState("");
  const [editMode, setEditMode] = useState(false); // State for edit mode
  const [editedTaskDetails, setEditedTaskDetails] = useState("");
  const [currentTaskId, setCurrentTaskId] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    console.log(`DASHBOARD: ${user === null}`);
    if (user === null) {
      navigate("/");
      return;
    }
    const url = `http://localhost:8000/get_tasks?email=${encodeURIComponent(
      user.email
    )}`;

    async function fetchData() {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((new_tasks_json) => {
          const new_tasks = JSON.parse(new_tasks_json);
          if (new_tasks) {
            const updated_tasks = new_tasks.map(
              (task) =>
                new Task(
                  task.id,
                  task.text,
                  task.completed,
                  task.category,
                  task.priority,
                  task.dueDate,
                  task.notes
                )
            );
            setTasks(updated_tasks);
          }
        });
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTask = async () => {
    if (inputValue.trim() !== "") {
      const newTask = new Task(
        Date.now().toString(),
        inputValue,
        false,
        selectedCategory,
        "low",
        "" // Initialize dueDate as empty string
      );
      console.log(`INSIDE handleAddTask()`);
      const payload = {
        email: user.email,
        new_task: newTask,
      };
      const response = await fetch("http://localhost:8000/add_task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log(`DASHBOARD: ${response}`);

      setTasks([...tasks, newTask]);
      setInputValue(""); // Clear input after adding task
    }
  };

  const handleToggleTask = async (taskId) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);

    const updatedTask = newTasks.find((task) => task.id === taskId);
    const payload = {
      email: user.email,
      updated_task: updatedTask,
    };

    await fetch("http://localhost:8000/update_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePriorityChange = async (taskId, priority) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, priority } : task
    );
    setTasks(newTasks);

    const updatedTask = newTasks.find((task) => task.id === taskId);
    const payload = {
      email: user.email,
      updated_task: updatedTask,
    };

    await fetch("http://localhost:8000/update_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  const handleDueDateChange = async (taskId, dueDate) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, dueDate } : task
    );
    setTasks(newTasks);

    const updatedTask = newTasks.find((task) => task.id === taskId);
    const payload = {
      email: user.email,
      updated_task: updatedTask,
    };

    await fetch("http://localhost:8000/update_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const togglePopup = (taskId) => {
    // Reset edit mode and edited task details when closing the popup
    if (showPopup && editMode) {
      setEditMode(false);
      setEditedTaskDetails(""); // Reset edited task details
    }

    setShowPopup(!showPopup); // Toggle the popup visibility
    setCurrentTaskId(taskId);
  };

  // eslint-disable-next-line
  const handleEditSave = async (taskId) => {
    if (editMode) {
      const newTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, notes: editedTaskDetails } : task
      );
      setTasks(newTasks);

      const updatedTask = newTasks.find((task) => task.id === taskId);
      const payload = {
        email: user.email,
        updated_task: updatedTask,
      };
      await fetch("http://localhost:8000/update_task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Save changes and switch back to view mode
      setEditMode(false);

      setTaskDetails(editedTaskDetails); // Apply edited text
    } else {
      // Switch to edit mode and initialize edited text
      setEditMode(true);
      setEditedTaskDetails(taskDetails); // Initialize edited text with current value
    }
  };

  const handleTextChange = (e) => {
    setEditedTaskDetails(e.target.value); // Update edited text on change
  };

  const calculateRemainingTime = (dueDate) => {
    const now = new Date();
    const deadline = new Date(dueDate);
    const difference = deadline.getTime() - now.getTime();
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    const hours = Math.ceil(difference / (1000 * 60 * 60));
    return { days, hours };
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="App">
      <div className="header">
        <h1>To-Do List</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={() => handleAddTask()}>Add Task</button>
      </div>
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search tasks"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
        <select onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
          {/* Add more categories as needed */}
        </select>
      </div>
      <ul className="task-list">
        {tasks
          .filter(
            (task) =>
              selectedCategory === "all" || task.category === selectedCategory
          )
          .filter((task) =>
            task.text.toLowerCase().includes(searchKeyword.toLowerCase())
          )
          .map((task) => {
            return (
              <TaskRow
                key={task.id}
                task={task}
                handleToggleTask={handleToggleTask}
                editMode={editMode}
                handlePriorityChange={handlePriorityChange}
                handleDeleteTask={handleDeleteTask}
                handleDueDateChange={handleDueDateChange}
                calculateRemainingTime={calculateRemainingTime}
                togglePopup={togglePopup}
                showPopup={showPopup}
                editedTaskDetails={editedTaskDetails}
                handleTextChange={handleTextChange}
                handleEditSave={handleEditSave}
                currentTaskId={currentTaskId}
              />
            );
          })}
      </ul>
    </div>
  );
};

class TaskRow extends Component {
  render() {
    const {
      task,
      handleToggleTask,
      editMode,
      handlePriorityChange,
      handleDeleteTask,
      handleDueDateChange,
      calculateRemainingTime,
      togglePopup,
      showPopup,
      editedTaskDetails,
      handleTextChange,
      handleEditSave,
      currentTaskId,
    } = this.props;
    return (
      <li
        key={task.id}
        className={task.completed ? "completed" : ""}
        onClick={() => handleToggleTask(task.id)}
      >
        <span
          className={`priority ${task.priority}`}
          onClick={(e) => {
            e.stopPropagation();
            const priorities = ["low", "medium", "high"];
            const currentPriorityIndex = priorities.indexOf(task.priority);
            const nextPriorityIndex =
              (currentPriorityIndex + 1) % priorities.length;
            handlePriorityChange(task.id, priorities[nextPriorityIndex]);
          }}
        >
          {task.priority}
        </span>
        {task.text}
        <span
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTask(task.id);
          }}
        >
          X
        </span>
        <input
          type="date"
          value={task.dueDate}
          onChange={(e) => handleDueDateChange(task.id, e.target.value)}
        />
        {task.dueDate && (
          <span className="remaining-time">
            {calculateRemainingTime(task.dueDate).days} days (
            {calculateRemainingTime(task.dueDate).hours} hours) left
          </span>
        )}
        <button
          className="info-btn"
          onClick={(e) => {
            e.stopPropagation();
            togglePopup(task.id); // Pass the task ID to togglePopup
          }}
        >
          Info
        </button>
        {showPopup && currentTaskId === task.id && (
          <div className="popup-container" onClick={() => togglePopup()}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header">
                <div className="header-left">
                  <h2>Task Details</h2>
                </div>
                <div className="header-right">
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSave(task.id);
                    }}
                  >
                    {editMode ? "Save" : "Edit"}
                  </button>
                  <button className="close-btn" onClick={togglePopup}>
                    Close
                  </button>
                </div>
              </div>
              <div className="popup-content">
                {editMode ? (
                  <textarea
                    className="edit-textarea"
                    value={editedTaskDetails}
                    onChange={handleTextChange}
                  />
                ) : (
                  <p className="saved-text">{task.notes}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </li>
    );
  }
}

export default App;
