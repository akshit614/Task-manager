import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../config";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header";


// Define interfaces for the task data
interface Task {
  _id: string;
  title: string;
  priority: number;
  status: "Pending" | "Finished";
  startTime: string; 
  endTime: string; 
  totalTime: number; 
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [sortField, setSortField] = useState<string>(""); 
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC"); 
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "Pending" | "Finished" | null
  >(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tasks/`, {
          headers: {
            Authorization: localStorage.getItem("token")
          },
        });
        if (!response) {
          throw new Error("Failed to fetch tasks");
        }
        const data: Task[] = await response.data;
        setTasks(data);
        
        setFilteredTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // handle selected tasks

  const handleTaskSelect = (taskId: string) => {
    const updatedSelection = new Set(selectedTasks);
    if (updatedSelection.has(taskId)) {
      updatedSelection.delete(taskId); // Deselect task if already selected
    } else {
      updatedSelection.add(taskId); // Select task if not already selected
    }
    setSelectedTasks(updatedSelection);
  };

  const handleDeleteSelected = async () => {
    if (selectedTasks.size === 0) {
      alert("No tasks selected");
      return;
    }

    try {
      const response = await axios.delete(`${BASE_URL}/tasks/deleteSelected`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        data: { ids: Array.from(selectedTasks) }, // Send array of selected task IDs
      });

      alert(response.data.message);
      // Remove the deleted tasks from the UI
      setTasks(tasks.filter((task) => !selectedTasks.has(task._id)));
      setFilteredTasks(filteredTasks.filter((task) => !selectedTasks.has(task._id)));
      setSelectedTasks(new Set()); // Clear selected tasks
    } catch (error) {
      console.error("Error deleting selected tasks:", error);
      alert("Error deleting tasks");
    }
  };



  useEffect(() => {
    let updatedTasks = [...tasks];

    if (priorityFilter !== null) {
      updatedTasks = updatedTasks.filter(
        (task) => task.priority === priorityFilter
      );
    }

    if (statusFilter) {
      updatedTasks = updatedTasks.filter(
        (task) => task.status === statusFilter
      );
    }

    if (sortField) {
      updatedTasks.sort((a, b) => {
        if (sortField === "startTime" || sortField === "endTime") {
          const dateA = new Date(a[sortField as keyof Task]).getTime();
          const dateB = new Date(b[sortField as keyof Task]).getTime();
          return sortOrder === "ASC" ? dateA - dateB : dateB - dateA;
        } else {
          const valueA = a[sortField as keyof Task] as number;
          const valueB = b[sortField as keyof Task] as number;
          return sortOrder === "ASC" ? valueA - valueB : valueB - valueA;
        }
      });
    }

    setFilteredTasks(updatedTasks);
  }, [tasks, sortField, sortOrder, priorityFilter, statusFilter]);

  const handleSortChange = (field: string, order: "ASC" | "DESC") => {
    setSortField(field);
    setSortOrder(order);
  };

  const handlePriorityFilterChange = (priority: number | null) => {
    setPriorityFilter(priority);
  };

  const handleStatusFilterChange = (status: "Pending" | "Finished" | null) => {
    setStatusFilter(status);
  };

  return (
    <div className="p-6">
      <Header />
      <div className="flex justify-between items-center mb-6 py-6 ">
        <div className="flex space-x-4">
          <Link to={'/createtask'}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              + Add Task
            </button>
          </Link>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleDeleteSelected}>
            Delete Selected
          </button>
        </div>

        <div className="flex space-x-4">

          <div>
            <label htmlFor="sort" className="block text-sm font-medium">
              Sort:
            </label>
            <select
              id="sort"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              onChange={(e) => {
                const [field, order] = e.target.value.split("|");
                handleSortChange(field, order as "ASC" | "DESC");
              }}
            >
              <option value="">Select</option>
              <option value="startTime|ASC">Start time: ASC</option>
              <option value="startTime|DESC">Start time: DESC</option>
              <option value="endTime|ASC">End time: ASC</option>
              <option value="endTime|DESC">End time: DESC</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium">
              Priority:
            </label>
            <select
              id="priority"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              onChange={(e) =>
                handlePriorityFilterChange(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
            >
              <option value="">All</option>
              {[1, 2, 3, 4, 5].map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium">
              Status:
            </label>
            <select
              id="status"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              onChange={(e) =>
                handleStatusFilterChange(
                  e.target.value as "Pending" | "Finished" | null
                )
              }
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Finished">Finished</option>
            </select>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse border-2 border-gray-600">
        <thead>
          <tr>
          <th className="border border-gray-300 px-4 py-2">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    // Select all tasks
                    setSelectedTasks(new Set(filteredTasks.map((task) => task._id)));
                  } else {
                    // Deselect all tasks
                    setSelectedTasks(new Set());
                  }
                }}
              /> 
              </th>
            <th className="border border-gray-300 px-4 py-2">Task ID</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Priority</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Start Time</th>
            <th className="border border-gray-300 px-4 py-2">End Time</th>
            <th className="border border-gray-300 px-4 py-2">
              Total Time (hrs)
            </th>
            <th className="border border-gray-300 px-4 py-2">Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task._id}>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedTasks.has(task._id)}
                  onChange={() => handleTaskSelect(task._id)}
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">{task._id}</td>
              <td className="border border-gray-300 px-4 py-2">{task.title}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {task.priority}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {task.status}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(task.startTime).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(task.endTime).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {task.totalTime.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <Link to={'/updatetask'}>
                  <button onClick={() => {localStorage.setItem("updateId", task._id)}} className="text-blue-500 hover:text-blue-700">
                    ✏️
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
