"use client"
import { Menu, Search, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Portal from "../Portal"

export default function Navbar({ userName = "John Doe", onMenuClick = () => {} }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [allSearchData, setAllSearchData] = useState([])
  const navigate = useNavigate()
  // 👇 Fetch projects and tasks from backend
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          fetch("https://taskflow-dashboard.vercel.app/projects"),
          fetch("https://taskflow-dasboard.vercel.app/tasks")
        ])
        const projects = await projectsRes.json()
        const tasks = await tasksRes.json()

        const formattedProjects = projects.map((proj) => ({
          id: proj.id,
          title: proj.title || proj.name,
          description: proj.description || "",
          type: "project",
        }))

        const formattedTasks = tasks.map((task) => ({
          id: task.id,
          title: task.title || task.name,
          description: task.description || "",
          type: "task",
          project: task.project || "",
        }))

        setAllSearchData([...formattedProjects, ...formattedTasks])
      } catch (err) {
        console.error("Failed to fetch search data", err)
      }
    }

    fetchSearchData()
  }, [])

  const handleGetStarted = () => {
    navigate("/");
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = allSearchData.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSearchResults(filtered)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }, [searchTerm, allSearchData])

  const handleSearchSelect = (item) => {
    setSearchTerm("")
    setShowResults(false)
    console.log("Selected:", item)
  }

  return (
    <header className="bg-gradient-to-r from-white via-purple-50 to-white shadow-xl border-b-2 border-purple-200 backdrop-blur-sm">
      <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-3 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-100 lg:hidden transition-all duration-300"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden sm:block ml-6 lg:ml-0 relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects, tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-6 py-3 border-2 border-purple-300 rounded-2xl leading-5 bg-white/90 backdrop-blur-sm placeholder-purple-400 focus:outline-none focus:placeholder-purple-300 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
              />
            </div>

            {showResults && searchResults.length > 0 && (
              <Portal>
                <div
                  className="fixed left-1/2 top-24 transform -translate-x-1/2 mt-3 bg-white/95 backdrop-blur-sm border-2 border-purple-300 rounded-2xl shadow-2xl z-[1000] max-h-80 overflow-y-auto w-[32rem] max-w-full"
                  style={{ minWidth: 300 }}
                >
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSearchSelect(item)}
                      className="w-full px-6 py-4 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 border-b border-purple-100 last:border-b-0 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                          {item.project && (
                            <div className="text-xs text-purple-600 mt-1 font-medium">Project: {item.project}</div>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${
                            item.type === "project"
                              ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300"
                              : "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-300"
                          }`}
                        >
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </Portal>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button onClick={handleGetStarted} className="p-3 text-purple-400 hover:text-purple-600 hover:bg-purple-100 rounded-xl transition-all duration-300">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
