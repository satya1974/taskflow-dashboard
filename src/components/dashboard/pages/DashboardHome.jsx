"use client"
import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { FolderOpen, CheckSquare, Clock, TrendingUp } from "lucide-react"

const statsData = [
  { name: "Jan", projects: 4, tasks: 24 },
  { name: "Feb", projects: 6, tasks: 32 },
  { name: "Mar", projects: 8, tasks: 45 },
  { name: "Apr", projects: 5, tasks: 28 },
  { name: "May", projects: 9, tasks: 52 },
  { name: "Jun", projects: 7, tasks: 38 },
  ]
export default function DashboardHome() {
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    fetch("http://localhost:5000/dashboard")
      .then(res => res.json())
      .then(data => setDashboardData(data))
      .catch(err => console.error("Failed to fetch dashboard data", err))
  }, [])

  if (!dashboardData) {
    return <p className="p-6 text-purple-600">Loading dashboard...</p>
  }

  const {
    totalProjects,
    totalTasks,
    pendingTasks,
    completionRate,
    taskStatusData,
    upcomingTasks
  } = dashboardData

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-200 shadow-xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-purple-600 text-lg">Welcome back! Here's what's happening with your projects.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-purple-500/25 min-h-[140px]">
            <div className="flex items-center h-full">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 flex-shrink-0">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-purple-100 truncate">Total Projects</p>
                <p className="text-3xl font-bold text-white">{dashboardData.totalProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 hover:shadow-purple-200/50 min-h-[140px]">
            <div className="flex items-center h-full">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl border border-purple-300 flex-shrink-0">
                <CheckSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Total Tasks</p>
                <p className="text-3xl font-bold text-purple-700">{dashboardData.totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 hover:shadow-purple-200/50 min-h-[140px]">
            <div className="flex items-center h-full">
              <div className="p-3 bg-gradient-to-br from-yellow-100 via-purple-100 to-purple-200 rounded-xl border border-purple-300 flex-shrink-0">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Pending Tasks</p>
                <p className="text-3xl font-bold text-purple-700">{dashboardData.pendingTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-2xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-purple-500/25 min-h-[140px]">
            <div className="flex items-center h-full">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-purple-100 truncate">Completion Rate</p>
                <p className="text-3xl font-bold text-white">{dashboardData.completionRate}</p>
              </div>
              
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-2 border-purple-200 hover:shadow-purple-200/50 transition-all duration-300">
              <h3 className="text-xl font-bold text-purple-800 mb-6">Projects & Tasks Overview</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#F9FAFB",
                      border: "2px solid #8B5CF6",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(139, 92, 246, 0.15)",
                    }}
                  />
                  <Bar dataKey="projects" fill="#8B5CF6" name="Projects" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="tasks" fill="#A855F7" name="Tasks" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-6">Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-purple-200 bg-gradient-to-r from-purple-50 via-white to-purple-50">
            <h3 className="text-xl font-bold text-purple-800">Upcoming Deadlines</h3>
          </div>
          <div className="divide-y divide-purple-100">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="px-8 py-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-purple-50 hover:to-white transition-all duration-300"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{task.title}</h4>
                  <p className="text-purple-600 font-medium">{task.project}</p>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-gray-500 font-medium">{task.deadline}</span>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${
                      task.priority === "high"
                        ? "bg-gradient-to-r from-red-100 to-purple-100 text-red-800 border-red-300"
                        : task.priority === "medium"
                          ? "bg-gradient-to-r from-yellow-100 to-purple-100 text-yellow-800 border-yellow-300"
                          : "bg-gradient-to-r from-green-100 to-purple-100 text-green-800 border-green-300"
                    }`}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
