import React, { useEffect, useState } from 'react';
import {BASE_URL} from '../../config'
import axios from 'axios';
import Header from '../components/Header';

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
  const [priorityData, setPrioritydata] = useState({})

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tasks/stats`,{
          headers : {
            Authorization : localStorage.getItem("token")
          }
        })
        if (!response) {
          throw new Error('Failed to fetch dashboard data')
        }
        const data : Stats[] = response.data
        console.log(data.priorityBreakdown);
        setStats(data)
        setPrioritydata(data.priorityBreakdown)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="p-6">
      <Header/>
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
          <p className="text-3xl font-bold">{stats.percentCompleted}%</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-md font-medium">Tasks Pending</h2>
          <p className="text-3xl font-bold">{stats.percentPending}%</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-md font-medium">Avg Time/Task</h2>
          <p className="text-3xl font-bold">{stats.averageCompletionTime} hrs</p>
        </div>
      </section>
      

      <section className="bg-white shadow rounded p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Pending Task Summary</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-md font-medium">Pending Tasks</h3>
            <p className="text-2xl font-bold">{stats.pendingTasks}</p>
          </div>
          <div className="text-center">
            <h3 className="text-md font-medium">Total Time Lapsed</h3>
            <p className="text-2xl font-bold">{stats.totalLapsedTime} hrs</p>
          </div>
          <div className="text-center">
            <h3 className="text-md font-medium">Estimated Time Left</h3>
            <p className="text-2xl font-bold">{stats.totalBalanceTime} hrs</p>
          </div>
        </div>
      </section>

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
          <tbody>
            {Object.entries(priorityData).map(([key,value]) => (
              <tr key={key}>
                <td className="border border-gray-200 px-4 py-2 text-center">{key}</td>
                <td className="border border-gray-200 px-4 py-2 text-center">{key}</td>
                <td className="border border-gray-200 px-4 py-2 text-center">{value.lapsed.toFixed(2)}</td>
                <td className="border border-gray-200 px-4 py-2 text-center">{value.remaining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;
