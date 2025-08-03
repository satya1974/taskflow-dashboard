"use client"

import { useState, useEffect } from "react"
import { Plus, Mail, X, Crown, Edit, Shield } from "lucide-react"

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("Viewer")
  const [loading, setLoading] = useState(true)

  // Fetch team members from backend on mount
  useEffect(() => {
    fetch("http://localhost:5000/team")
      .then((res) => res.json())
      .then((data) => {
        setTeamMembers(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load team members:", err)
        setLoading(false)
      })
  }, [])

  const handleInviteMember = async (e) => {
    e.preventDefault()
    try {
      // Call backend to add team member
      const newMemberPayload = {
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        avatar: inviteEmail.split("@")[0].substring(0, 2).toUpperCase(),
        joinedAt: new Date().toISOString().split("T")[0],
        status: "Pending",
        lastActive: "Never",
      }

      // Assuming you have a POST /team endpoint for adding members (you can create one)
      const res = await fetch("http://localhost:5000/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMemberPayload),
      })

      if (!res.ok) throw new Error("Failed to invite member")
      const addedMember = await res.json()
      setTeamMembers([...teamMembers, addedMember])
      setInviteEmail("")
      setInviteRole("Viewer")
      setShowInviteModal(false)
    } catch (error) {
      console.error(error)
      alert("Error inviting member")
    }
  }

  const handleRoleChange = async (memberId, newRole) => {
    try {
      // Find member to update
      const member = teamMembers.find((m) => m.id === memberId)
      if (!member) return

      // Call backend to update member role (assuming PUT /team/:id)
      const res = await fetch(`http://localhost:5000/team/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (!res.ok) throw new Error("Failed to update role")

      setTeamMembers(
        teamMembers.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      )
    } catch (error) {
      console.error(error)
      alert("Error updating role")
    }
  }

  const handleRemoveMember = async (memberId, memberName) => {
    try {
      const res = await fetch(
        `http://localhost:5000/team/${encodeURIComponent(memberName)}`,
        {
          method: "DELETE",
        }
      )
      if (!res.ok) throw new Error("Failed to remove member")

      setTeamMembers(teamMembers.filter((m) => m.id !== memberId))

      // Optionally: Refetch projects/tasks elsewhere in your app to stay in sync
    } catch (error) {
      console.error(error)
      alert("Error removing member. Please try again.")
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "Owner":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "Editor":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "Viewer":
        return <Shield className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "Owner":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "Editor":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "Viewer":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-300"
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-700 font-bold text-xl">
        Loading team members...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-8">
      <div className="space-y-8 container mx-auto px-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
              Team
            </h1>
            <p className="text-purple-600 text-lg font-medium">
              Manage your team members and their permissions
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white px-6 py-3 rounded-2xl hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 flex items-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            <span className="font-semibold">Invite Member</span>
          </button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-purple-200">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl border border-purple-300">
                <Crown className="h-8 w-8 text-purple-700" />
              </div>
              <div className="ml-6">
                <p className="text-sm font-bold text-gray-600">Total Members</p>
                <p className="text-3xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-purple-200">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl border border-purple-300">
                <Shield className="h-8 w-8 text-purple-700" />
              </div>
              <div className="ml-6">
                <p className="text-sm font-bold text-gray-600">Active Members</p>
                <p className="text-3xl font-bold text-gray-900">
                  {teamMembers.filter((m) => m.status === "Active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-purple-200">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl border border-purple-300">
                <Mail className="h-8 w-8 text-purple-700" />
              </div>
              <div className="ml-6">
                <p className="text-sm font-bold text-gray-600">Pending Invites</p>
                <p className="text-3xl font-bold text-gray-900">
                  {teamMembers.filter((m) => m.status === "Pending").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-200">
          <div className="px-8 py-6 border-b-2 border-purple-200 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50">
            <h3 className="text-xl font-bold text-purple-800">Team Members</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-purple-200">
              <thead className="bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y-2 divide-purple-100">
                {teamMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-white transition-all duration-300"
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-full flex items-center justify-center text-white font-bold shadow-xl">
                          {member.avatar}
                        </div>
                        <div className="ml-6">
                          <div className="text-sm font-bold text-gray-900">{member.name}</div>
                          <div className="text-sm text-purple-600 font-medium">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRoleIcon(member.role)}
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          disabled={member.role === "Owner"}
                          className={`ml-3 text-xs font-bold px-4 py-2 rounded-full border-2 ${getRoleColor(member.role)} ${
                            member.role === "Owner" ? "cursor-not-allowed" : "cursor-pointer"
                          }`}
                        >
                          <option value="Owner">Owner</option>
                          <option value="Editor">Editor</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold border-2 ${getStatusColor(member.status)}`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.lastActive}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-900">{member.joinedAt}</td>
                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                      {member.role !== "Owner" && (
                        <button
                          onClick={() => handleRemoveMember(member.id, member.name)}
                          className="text-red-600 hover:text-red-900 font-semibold hover:bg-red-100 px-3 py-1 rounded-lg transition-all duration-300"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invite Member Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl border-2 border-purple-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Invite Team Member</h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleInviteMember} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300"
                  >
                    <option value="Viewer">Viewer - Can view projects and tasks</option>
                    <option value="Editor">Editor - Can create and edit content</option>
                    <option value="Owner">Owner - Full access to everything</option>
                  </select>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white rounded-xl hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Send Invite
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
