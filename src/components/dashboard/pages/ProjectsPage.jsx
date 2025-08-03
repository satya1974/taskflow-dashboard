"use client"

import { useState, useEffect } from "react"
import { Plus, MoreHorizontal, Users, Calendar, X, Edit, Trash2, Eye } from "lucide-react"
import ProjectDetailsModal from "../ProjectDetailsModal"

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    deadline: "",
    teamMembers: [],
    status: "Planning",
    progress: 0,
    color: "purple",
  })
  const [editingProject, setEditingProject] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [teamInput, setTeamInput] = useState("")

  const fetchProjects = async () => {
    const res = await fetch("http://localhost:5000/projects")
    const data = await res.json()
    setProjects(data)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreateProject = async (e) => {
    e.preventDefault()

    const payload = {
      ...newProject,
      teamMembers: newProject.teamMembers || [],
      progress: parseInt(newProject.progress),
    }

    const method = editingProject ? "PUT" : "POST"
    const url = editingProject
      ? `http://localhost:5000/projects/${editingProject.id}`
      : "http://localhost:5000/projects"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingProject
          ? payload
          : {
              ...payload,
              id: Date.now(),
            }
      ),
    })

    if (res.ok) {
      fetchProjects()
      setShowCreateModal(false)
      setEditingProject(null)
      setNewProject({
        name: "",
        description: "",
        deadline: "",
        teamMembers: [],
        status: "Planning",
        progress: 0,
        color: "purple",
      })
    }
    setTeamInput("")
  }

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return
    await fetch(`http://localhost:5000/projects/${id}`, { method: "DELETE" })
    fetchProjects()
  }

  const handleEditProject = (project) => {
    setNewProject(project)
    setEditingProject(project)
    setTeamInput(project.teamMembers.join(", "))
    setShowCreateModal(true)
    setDropdownOpen(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "Planning":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getColorDot = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-500"
      case "green":
        return "bg-green-500"
      case "purple":
        return "bg-purple-500"
      case "orange":
        return "bg-orange-500"
      default:
        return "bg-purple-500"
    }
  }
  
  const handleViewProject = (project) => {
    setSelectedProject(project)
    setShowDetailsModal(true)
    setDropdownOpen(null)
  }
  const handleDropdownToggle = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id)
  }
  const getProgressColor = (color) => {
    return {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
    }[color] || "bg-purple-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-8">
      <div className="space-y-8 container mx-auto px-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-purple-600 text-lg font-medium">Manage and track your project process</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white px-6 py-3 rounded-2xl shadow-xl hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 transform hover:scale-105 transition-all duration-300 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Project
          </button>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative bg-white border-2 border-purple-200 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-6 group"
            >
              <div className="flex items-start justify-between mb-6">
                  <div className={`w-4 h-4 rounded-full ${getColorDot(project.color)} shadow-lg`}></div>
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => handleDropdownToggle(project.id)}
                      className="text-gray-400 hover:text-purple-600 transition-all duration-300 p-2 rounded-xl hover:bg-purple-100"
                    >
                      <MoreHorizontal className="h-6 w-6" />
                    </button>

                    {dropdownOpen === project.id && (
                      <div className="absolute right-0 top-12 mt-1 w-56 bg-white border-2 border-purple-200 rounded-2xl shadow-2xl z-20 overflow-hidden">
                        <button
                          onClick={() => handleViewProject(project)}
                          className="w-full px-6 py-4 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-900 flex items-center transition-all duration-300 border-b border-purple-100"
                        >
                          <Eye className="h-5 w-5 mr-3 text-purple-500" />
                          <span className="font-medium">View Details</span>
                        </button>
                        <button
                          onClick={() => handleEditProject(project)}
                          className="w-full px-6 py-4 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-900 flex items-center transition-all duration-300 border-b border-purple-100"
                        >
                          <Edit className="h-5 w-5 mr-3 text-purple-500" />
                          <span className="font-medium">Edit Project</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="w-full px-6 py-4 text-left text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-900 flex items-center transition-all duration-300"
                        >
                          <Trash2 className="h-5 w-5 mr-3 text-red-500" />
                          <span className="font-medium">Delete Project</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{project.name}</h3>
              <p className="text-gray-600 text-sm mb-6 line-clamp-2">{project.description}</p>

              <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${getProgressColor(project.color)} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

              <div className="flex items-center justify-between mb-6">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold border-2 ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                  <div className="flex items-center text-sm text-gray-500 font-medium">
                    <Calendar className="h-4 w-4 mr-2" />
                    {project.deadline}
                  </div>
                </div>

              {/* Team Avatars */}
              <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600 font-medium">{project.teamMembers.length} members</span>
                  </div>
              {project.teamMembers.length > 0 && (
                <div className="flex -space-x-2 mb-4">
                  {project.teamMembers.slice(0, 4).map((member, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white text-purple-800 flex items-center justify-center text-xs font-bold shadow-sm"
                    >
                      {typeof member === "string"
                        ? member
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "TM"}
                    </div>
                  ))}
                  {project.teamMembers.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-purple-300 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                      +{project.teamMembers.length - 4}
                    </div>
                  )}
                </div>
              )}
              </div>
            </div>

          ))}
        </div>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl border-2 border-purple-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editingProject ? "Edit" : "Create"} Project</h2>
                <button onClick={() => setShowCreateModal(false)}>
                  <X />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Project Name"
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-200"
                />
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Description"
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-200"
                />
                <input
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl"
                />
                <input
                  type="number"
                  value={newProject.progress}
                  onChange={(e) => setNewProject({ ...newProject, progress: e.target.value })}
                  placeholder="Progress (%)"
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl"
                />
                <input
                      type="text"
                      value={teamInput}
                      onChange={(e) => {
                        setTeamInput(e.target.value)
                        setNewProject({
                          ...newProject,
                          teamMembers: e.target.value
                            .split(",")
                            .map((m) => m.trim())
                            .filter(Boolean), // avoid empty strings
                        })
                      }}
                      placeholder="Team Members (comma separated)"
                      className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl"
                    />
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <select
                  value={newProject.color}
                  onChange={(e) => setNewProject({ ...newProject, color: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl"
                >
                  <option value="purple">Purple</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="orange">Orange</option>
                </select>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white rounded-xl hover:from-purple-700 hover:to-purple-900 transition"
                  >
                    {editingProject ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Project Details Modal */}
        <ProjectDetailsModal
          project={selectedProject}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedProject(null)
          }}
        />
      </div>
    </div>
  )
}
