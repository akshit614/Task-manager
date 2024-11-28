import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../config";
import axios from "axios";

// Define interfaces for the task data
interface Task {
  _id: string;
  title: string;
  priority: number;
  status: "Pending" | "Finished";
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  totalTime: number; // in hours
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [sortField, setSortField] = useState<string>(""); // Field to sort by
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC"); // Sort order
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "Pending" | "Finished" | null
  >(null);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tasks/`, {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDg3MTk1ZThhZjVkMzBiZTMxMjNjNSIsImlhdCI6MTczMjgwMDk0NiwiZXhwIjoxNzMyODQ0MTQ2fQ.qswX7E_OK0HgzBhTy8xsA-zThtxb5QK0y-I5Kk-bUG4",
          },
        });
        if (!response) {
          throw new Error("Failed to fetch tasks");
        }
        const data: Task[] = await response.data;
        setTasks(data);
        console.log(data);
        
        setFilteredTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // Apply filters and sorting whenever tasks or filters change
  useEffect(() => {
    let updatedTasks = [...tasks];

    // Apply priority filter
    if (priorityFilter !== null) {
      updatedTasks = updatedTasks.filter(
        (task) => task.priority === priorityFilter
      );
    }

    // Apply status filter
    if (statusFilter) {
      updatedTasks = updatedTasks.filter(
        (task) => task.status === statusFilter
      );
    }

    // Apply sorting
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
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Task List</h1>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          onClick={() => {
            localStorage.removeItem("authToken"); // Clear token (or any other logic)
            window.location.href = "/"; // Redirect to login
          }}
        >
          Sign Out
        </button>
      </header>
      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            + Add Task
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Delete Selected
          </button>
        </div>

        <div className="flex space-x-4">
          {/* Sort Dropdown */}
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

          {/* Priority Filter */}
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

          {/* Status Filter */}
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
      {/* Task Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
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
              </td>{" "}
              <td className="border border-gray-300 px-4 py-2">
                {new Date(task.endTime).toLocaleString()}
              </td>{" "}
              <td className="border border-gray-300 px-4 py-2 text-center">
                {task.totalTime}
              </td>{" "}
              <td className="border border-gray-300 px-4 py-2 text-center">
                {" "}
                <button className="text-blue-500 hover:text-blue-700">
                  ✏️
                </button>{" "}
              </td>{" "}
            </tr>
          ))}{" "}
        </tbody>{" "}
      </table>{" "}
    </div>
  );
};

export default TaskList;
