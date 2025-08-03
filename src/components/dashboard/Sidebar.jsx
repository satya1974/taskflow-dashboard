"use client"
import { Home, FolderOpen, CheckSquare, Users, Settings, X } from "lucide-react"

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "team", label: "Team", icon: Users },
]

export default function Sidebar({
  isOpen = false,
  onClose = () => {},
  activeTab = "dashboard",
  setActiveTab = () => {},
}) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-gradient-to-b from-white via-purple-50 to-purple-100 border-r-2 border-purple-200 pt-6 pb-4 overflow-y-auto shadow-2xl">
            <div className="flex items-center flex-shrink-0 px-6 mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-purple-200 transform hover:scale-110 transition-all duration-300">
                  <span className="text-white font-bold text-xl">TF</span>
                </div>
                <span className="ml-4 text-2xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                  TaskFlow
                </span>
              </div>
            </div>
            <nav className="mt-8 flex-1 px-3 space-y-3">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white shadow-2xl transform scale-105 border-l-4 border-purple-300"
                        : "border-transparent text-gray-600 hover:bg-gradient-to-r hover:from-purple-100 hover:via-purple-200 hover:to-purple-300 hover:text-purple-800 border-l-4 hover:border-purple-400"
                    } group flex items-center px-6 py-4 text-sm font-semibold rounded-r-2xl w-full text-left transition-all duration-300 ease-in-out hover:shadow-lg`}
                  >
                    <Icon
                      className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-purple-600"} mr-4 h-6 w-6 transition-all duration-300`}
                    />
                    {item.label}
                  </button>
                )
              })}
            </nav>
            {/* <div className="px-6 py-6">
              <div className="bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 rounded-2xl p-4 border-2 border-purple-400 shadow-lg">
                <p className="text-sm text-purple-800 font-bold">Pro Tip</p>
                <p className="text-xs text-purple-700 mt-2 font-medium">Use Cmd+K to quickly search</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`${isOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white via-purple-50 to-purple-100 transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-20 px-6 border-b-2 border-purple-200 bg-gradient-to-r from-purple-50 via-white to-purple-50">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-purple-200">
                <span className="text-white font-bold text-xl">TF</span>
              </div>
              <span className="ml-4 text-2xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-100 transition-all duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-3">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    onClose()
                  }}
                  className={`${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white shadow-2xl transform scale-105 border-l-4 border-purple-300"
                      : "border-transparent text-gray-600 hover:bg-gradient-to-r hover:from-purple-100 hover:via-purple-200 hover:to-purple-300 hover:text-purple-800 border-l-4 hover:border-purple-400"
                  } group flex items-center px-6 py-4 text-sm font-semibold rounded-r-2xl w-full text-left transition-all duration-300 ease-in-out hover:shadow-lg`}
                >
                  <Icon
                    className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-purple-600"} mr-4 h-6 w-6 transition-all duration-300`}
                  />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
