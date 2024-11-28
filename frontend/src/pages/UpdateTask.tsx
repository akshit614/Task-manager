import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


const UpdateTask: React.FC = () => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<number>(1);
  const [status, setStatus] = useState<"pending" | "finished">("pending");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [task, setTask] = useState([])
  const navigate  = useNavigate()
  const updateId = localStorage.getItem("updateId")

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tasks/${updateId}`, {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDg3MTk1ZThhZjVkMzBiZTMxMjNjNSIsImlhdCI6MTczMjgwMDk0NiwiZXhwIjoxNzMyODQ0MTQ2fQ.qswX7E_OK0HgzBhTy8xsA-zThtxb5QK0y-I5Kk-bUG4",
          },
        });
        if (!response) {
          throw new Error("Failed to fetch task");
        }
        const data = await response.data;
        setTask(data[0]);
    
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    fetchTask();
  }, [updateId]);


  const handleSubmit = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/tasks/${updateId}`,{
        title,
        priority : Number(priority),
        status,
        startTime : new Date(startTime).toISOString(),
        endTime : new Date(endTime).toISOString(),
      }, {
        headers : {
            Authorization : localStorage.getItem("token")
          }
      })

      if (response) {
        alert("Task updated successfully!");
        navigate('/tasks')
      } else {
        alert("error in updating task");
      }
    } catch (error ) {
      alert("Failed to update task. Please try again." + error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update task</h2>
        <p>Task id : {updateId}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-2">Title</label>
            <input
              type="text"
              placeholder={task.title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Priority</label>
            <select
              aria-placeholder={task.priority}
              onChange={(e) => setPriority(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded"
            >
              {[1, 2, 3, 4, 5].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Status</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Pending"
                  checked={status === "pending"}
                  onChange={() => setStatus("pending")}
                />
                Pending
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Finished"
                  checked={status === "finished"}
                  onChange={() => setStatus("finished")}
                />
                Finished
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Start Time</label>
            <input
              type="datetime-local"
              placeholder={task.startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">End Time</label>
            <input
              type="datetime-local"
              placeholder={task.endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Link to={'/tasks'}>
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Update task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;
