import DashboardHome from "./pages/DashboardHome"
import ProjectsPage from "./pages/ProjectsPage"
import TasksPage from "./pages/TasksPage"
import TeamPage from "./pages/TeamPage"

export default function DashboardContent({ activeTab = "dashboard" }) {
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />
      case "projects":
        return <ProjectsPage />
      case "tasks":
        return <TasksPage />
      case "team":
        return <TeamPage />
      default:
        return <DashboardHome />
    }
  }

  return <div className="relative p-6">{renderContent()}</div>
}
