import React, { useEffect, useState } from 'react'
import {BASE_URL} from '../../config'
import axios from 'axios'
import Header from '../components/Header'

interface Task {
  _id: string
  title: string
  status: string
  priority: number
  startTime: string
  endTime: string
}

interface Stats {
  totalCount : number
  pendingTasks: number
  percentCompleted: number,
  percentPending: number
  averageCompletionTime: number
  totalLapsedTime: number
  totalBalanceTime: number
  priorityBreakdown: { [key: string]: PriorityEntry } 
}

interface PriorityEntry {
  lapsed: number
  remaining: number
  pendingCount?: number
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalCount: 0,
    pendingTasks: 0,
    percentCompleted: 0,
    percentPending: 0,
    averageCompletionTime: 0,
    totalLapsedTime: 0,
    totalBalanceTime: 0,
    priorityBreakdown: {},
  })
  const [tasks, setTasks] = useState<Task[]>([])

  const [priorityData, setPrioritydata] = useState<{ [key: string]: PriorityEntry }>({})

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const stateResponse = await axios.get(`${BASE_URL}/tasks/stats`,{
          headers : {
            Authorization : localStorage.getItem("token")
          }
        })
        if (!stateResponse) {
          throw new Error('Failed to fetch dashboard data')
        }
        const statsData = stateResponse.data
        setStats(statsData)

        const tasksResponse = await axios.get(`${BASE_URL}/tasks`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })

        const allTasks  = tasksResponse.data
        setTasks(allTasks)

        const pendingTasksByPriority: { [key: string]: number } = {}
        tasks
          .filter((task) => task.status === "pending") 
          .forEach((task) => {
            const priority = task.priority.toString()
            if (!pendingTasksByPriority[priority]) {
              pendingTasksByPriority[priority] = 0
            }
            pendingTasksByPriority[priority] += 1
          }) 

        const enrichedPriorityData = { ...statsData.priorityBreakdown }
        Object.entries(pendingTasksByPriority).forEach(([priority, count]) => {
          if (!enrichedPriorityData[priority]) {
            enrichedPriorityData[priority] = { lapsed: 0, remaining: 0 } 
          }
          enrichedPriorityData[priority].pendingCount = count
        })

        setPrioritydata(enrichedPriorityData)

      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      }
    }

    fetchDashboardStats()
  }, [tasks])

  return (
    <div className="p-6">
      <Header/>
      <div className='p-1'>
        <h1 className='font-bold text-3xl'>Summary</h1>
      </div>
      <section className="grid grid-cols-4 gap-6 mb-8 pt-8">
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h2 className="text-md font-medium">Total Tasks</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalCount}</p>
        </div>
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h2 className="text-md font-medium">Tasks Completed</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.percentCompleted}%</p>
        </div>
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h2 className="text-md font-medium">Tasks Pending</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.percentPending}%</p>
        </div>
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h2 className="text-md font-medium">Avg Time/Task</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.averageCompletionTime} hrs</p>
        </div>
      </section>
      

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Pending Task Summary</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-md font-medium">Pending Tasks</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.pendingTasks}</p>
          </div>
          <div className="text-center">
            <h3 className="text-md font-medium">Total Time Lapsed</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.totalLapsedTime} hrs</p>
          </div>
          <div className="text-center">
            <h3 className="text-md font-medium">Estimated Time Left</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.totalBalanceTime} hrs</p>
          </div>
        </div>
      </section>

      <section className="bg-white shadow-md rounded p-6">
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
                <td className="border font-bold border-gray-200 px-4 py-2 text-center text-green-600">{key}</td>
                <td className="border font-bold border-gray-200 px-4 py-2 text-center text-green-600">{value.pendingCount || 0}</td>
                <td className="border font-bold border-gray-200 px-4 py-2 text-center text-green-600">{value.lapsed.toFixed(2)}</td>
                <td className="border font-bold border-gray-200 px-4 py-2 text-center text-red-600">{value.remaining.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default Dashboard
