import React, { useEffect, useState } from 'react';
import {BASE_URL} from '../../config'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface Stats {
  totalCount : number,
  pendingTasks: number,
  percentCompleted: number,
  percentPending: number,
  averageCompletionTime: number,
  totalLapsedTime: number,
  totalBalanceTime: number,
  priorityBreakdown: object
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats[]>([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tasks/stats`,{
          headers : {
            Authorization : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDg3MTk1ZThhZjVkMzBiZTMxMjNjNSIsImlhdCI6MTczMjgwMDk0NiwiZXhwIjoxNzMyODQ0MTQ2fQ.qswX7E_OK0HgzBhTy8xsA-zThtxb5QK0y-I5Kk-bUG4"
          }
        })
        if (!response) {
          throw new Error('Failed to fetch dashboard data')
        }
        console.log(response.data);
        const data : Stats[] = response.data
        setStats(data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center py-4 border-b">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          onClick={() => {
            localStorage.removeItem('token'); // Clear token (or any other logic)
            navigate('/login')
          }}
        >
          Sign Out
        </button>
      </header>

      {/* Summary Section */}
      <div className='p-1'>
        <h1 className='font-bold text-3xl'>Summary</h1>
      </div>
      <section className="grid grid-cols-4 gap-6 mb-8 pt-8">
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-md font-medium">Total Tasks</h2>
          <p className="text-3xl font-bold">{stats.totalCount}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-md font-medium">Tasks Completed</h2>
          <p className="text-3xl font-bold">{stats.percentCompleted.toFixed(2)}%</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-md font-medium">Tasks Pending</h2>
          <p className="text-3xl font-bold">{stats.percentPending.toFixed(2)}%</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-md font-medium">Avg Time/Task</h2>
          <p className="text-3xl font-bold">{stats.averageCompletionTime.toFixed(2)} hrs</p>
        </div>
      </section>
      

      {/* Pending Task Summary */}
      <section className="bg-white shadow rounded p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Pending Task Summary</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-md font-medium">Pending Tasks</h3>
            <p className="text-2xl font-bold">{stats.pendingTasks}</p>
          </div>
          <div className="text-center">
            <h3 className="text-md font-medium">Total Time Lapsed</h3>
            <p className="text-2xl font-bold">{stats.totalLapsedTime.toFixed(2)} hrs</p>
          </div>
          <div className="text-center">
            <h3 className="text-md font-medium">Estimated Time Left</h3>
            <p className="text-2xl font-bold">{stats.totalBalanceTime.toFixed(2)} hrs</p>
          </div>
        </div>
      </section>

      {/* Task Priority Table */}
      <section className="bg-white shadow rounded p-6">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 px-4 py-2">Task Priority</th>
              <th className="border border-gray-200 px-4 py-2">Pending Tasks</th>
              <th className="border border-gray-200 px-4 py-2">Time Lapsed (hrs)</th>
              <th className="border border-gray-200 px-4 py-2">Time to Finish (hrs)</th>
            </tr>
          </thead>
          {/* <tbody>
            {priorityData.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-200 px-4 py-2 text-center">{row.priority}</td>
                <td className="border border-gray-200 px-4 py-2 text-center">{row.pendingTasks}</td>
                <td className="border border-gray-200 px-4 py-2 text-center">{row.timeLapsed}</td>
                <td className="border border-gray-200 px-4 py-2 text-center">{row.timeToFinish}</td>
              </tr>
            ))}
          </tbody> */}
        </table>
      </section>
    </div>
  );
};

export default Dashboard;
