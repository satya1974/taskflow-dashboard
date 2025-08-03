import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, Users, BarChart3 } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  const handleKeyPress = (event, action) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  return (
    <main className="w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-4 sm:px-6 lg:px-12 py-12 flex items-center justify-center">
      <div
        className={`w-full space-y-16 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Hero Section */}
        <header className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold animate-float">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </h1>

          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Organize your projects.{" "}
            <span className="text-white font-semibold">Simplify your workflow.</span>
          </p>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transform the way you manage tasks and collaborate with your team.
            TaskFlow brings clarity to chaos and efficiency to your everyday workflow.
          </p>

          {/* CTA Button */}
          <div className="pt-6">
            <button
              onClick={handleGetStarted}
              onKeyDown={(e) => handleKeyPress(e, handleGetStarted)}
              className="px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
              aria-label="Get started with TaskFlow"
            >
              Get Started
              <ArrowRight className="ml-2 inline-block w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Features */}
        <section className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4 sm:px-6 lg:px-12">
            {[{
              icon: <CheckCircle className="w-8 h-8 text-white" />,
              title: "Smart Organization",
              text: "Categorize and prioritize your tasks with intelligent design.",
              bg: "from-blue-500 to-purple-500"
            }, {
              icon: <Users className="w-8 h-8 text-white" />,
              title: "Team Collaboration",
              text: "Seamlessly work together with real-time updates and sharing.",
              bg: "from-purple-500 to-pink-500"
            }, {
              icon: <BarChart3 className="w-8 h-8 text-white" />,
              title: "Progress Tracking",
              text: "Stay on top with visual insights and analytics.",
              bg: "from-pink-500 to-red-500"
            }].map((feature, idx) => (
              <article key={idx} className="text-center space-y-4 p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.bg} rounded-full mx-auto flex items-center justify-center`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Social Proof */}
        <section className="pt-12 text-center space-y-4">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
            Trusted by teams worldwide
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60 text-white text-lg font-semibold">
            <span>10k+</span>
            <span className="text-gray-400">•</span>
            <span>Teams</span>
            <span className="text-gray-400">•</span>
            <span>50+ Countries</span>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Landing;
