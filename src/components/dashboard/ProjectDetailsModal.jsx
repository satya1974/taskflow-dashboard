"use client"

import { X, Users, Calendar, BarChart3, Clock } from "lucide-react"

export default function ProjectDetailsModal({ project, isOpen, onClose }) {
  if (!isOpen || !project) return null

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

  const getProgressColor = (color) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-2xl border-2 border-purple-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 border-b-2 border-purple-200 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-purple-800 mb-2">{project.name}</h2>
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 ml-4"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{project.description}</p>
          </div>

          {/* Progress */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Progress</h3>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600 mr-3" />
                <span className="text-2xl font-bold text-purple-800">{project.progress}%</span>
                <span className="text-sm text-purple-600 ml-2">Complete</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-4">
                <div
                  className={`${getProgressColor(project.color)} h-4 rounded-full transition-all duration-500 shadow-lg`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deadline */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Deadline</p>
                  <p className="text-lg font-bold text-blue-800">{project.deadline}</p>
                </div>
              </div>
            </div>

            {/* Team Size */}
            <div className="bg-gradient-to-r from-green-50 to-purple-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-lg font-bold text-green-800">{project.teamMembers.length} Members</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Team Members</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-white rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg mr-4">
                    {typeof member === "string"
                      ? member
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "TM"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{member || "Unnamed"}</p>
                    <p className="text-sm text-purple-600">Team Member</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Project Timeline</h3>
            <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span className="text-sm">
                  Project created and will be completed by{" "}
                  <strong className="text-purple-700">{project.deadline}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t-2 border-purple-200 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 rounded-b-2xl">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
