import React from 'react';

interface DashboardStatsProps {
  stats: {
    totalTasks: number;
    completedPercentage: number;
    pendingPercentage: number;
    timeLapsedByPriority: { [priority: number]: number };
    balanceTimeByPriority: { [priority: number]: number };
    averageCompletionTime: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Task Statistics</h2>
      <p>Total Tasks: {stats.totalTasks}</p>
      <p>Completed Tasks: {stats.completedPercentage}%</p>
      <p>Pending Tasks: {stats.pendingPercentage}%</p>
      <div className="mt-4">
        <h3 className="font-bold">Time Lapsed by Priority:</h3>
        <ul>
          {Object.entries(stats.timeLapsedByPriority).map(([priority, time]) => (
            <li key={priority}>
              Priority {priority}: {time} hours
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h3 className="font-bold">Balance Time by Priority:</h3>
        <ul>
          {Object.entries(stats.balanceTimeByPriority).map(([priority, time]) => (
            <li key={priority}>
              Priority {priority}: {time} hours
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4">Average Completion Time: {stats.averageCompletionTime} hours</p>
    </div>
  );
};

export default DashboardStats;
