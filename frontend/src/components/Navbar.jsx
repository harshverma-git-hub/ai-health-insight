import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            AI
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-semibold text-gray-800">
              Health Insight
            </h1>
            <p className="text-xs text-gray-500">
              AI-Powered Healthcare
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link
            to="/symptom-checker"
            className="hover:text-blue-600 transition"
          >
            Symptom Checker
          </Link>
          <span className="cursor-not-allowed text-gray-400">
            Health Records
          </span>
          <span className="cursor-not-allowed text-gray-400">
            Reports
          </span>
          <span className="cursor-not-allowed text-gray-400">
            About
          </span>
        </nav>

        {/* Action Area */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:inline-block text-sm text-gray-600 hover:text-blue-600 transition">
            Sign In
          </button>
          <Link
            to="/symptom-checker"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;