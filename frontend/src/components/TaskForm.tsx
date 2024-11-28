import React, { useState } from 'react';

interface TaskFormProps {
  initialData?: {
    title: string;
    startTime: string;
    endTime: string;
    priority: number;
    status: string;
  };
  onSubmit: (task: any) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit }) => {
  const [task, setTask] = useState(
    initialData || {
      title: '',
      startTime: '',
      endTime: '',
      priority: 1,
      status: 'pending',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-4">
        <label className="block text-gray-700">Title:</label>
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Start Time:</label>
        <input
          type="datetime-local"
          name="startTime"
          value={task.startTime}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">End Time:</label>
        <input
          type="datetime-local"
          name="endTime"
          value={task.endTime}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Priority:</label>
        <select
          name="priority"
          value={task.priority}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          {[1, 2, 3, 4, 5].map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Status:</label>
        <select
          name="status"
          value={task.status}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="pending">Pending</option>
          <option value="finished">Finished</option>
        </select>
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Save Task
      </button>
    </form>
  );
};

export default TaskForm;
