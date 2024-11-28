import React from 'react';

interface TaskCardProps {
  title: string;
  startTime: string;
  endTime: string;
  priority: number;
  status: string;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  startTime,
  endTime,
  priority,
  status,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="font-bold text-lg">{title}</h2>
      <p>Start Time: {new Date(startTime).toLocaleString()}</p>
      <p>End Time: {new Date(endTime).toLocaleString()}</p>
      <p>Priority: {priority}</p>
      <p>Status: {status}</p>
      <div className="flex gap-4 mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
