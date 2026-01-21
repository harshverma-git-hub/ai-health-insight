import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-gray-50">
      {/* ================= HERO SECTION ================= */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Your AI-Powered <br />
              <span className="text-blue-600">Digital Health Companion</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              AI Health Insight is a modern healthcare platform that helps you
              understand health risks early, track your well-being, and make
              informed decisions — powered by artificial intelligence.
            </p>

            <div className="mt-8 flex gap-4">
              <a
                href="#services"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Explore Services
              </a>

              <Link
                to="/symptom-checker"
                className="border border-gray-300 px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Symptom Checker
              </Link>
            </div>
          </div>

          {/* Visual Placeholder */}
          <div className="hidden md:block">
            <div className="w-full h-80 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-semibold text-lg">
              Healthcare / Doctor Illustration
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-gray-800 text-center">
          Our Healthcare Services
        </h2>
        <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
          A growing ecosystem of AI-powered healthcare tools designed to
          support patients and doctors.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["AI Symptom Checker", "ML-based symptom analysis and risk estimation."],
            ["Health Risk Analysis", "AI-driven severity and risk scoring."],
            ["Personal Health Records", "Secure storage of health history."],
            ["AI Health Reports", "Structured and explainable reports."],
            ["Preventive Care Insights", "Early warnings and recommendations."],
            ["Doctor Consultation (Future)", "Planned clinical consultation integration."]
          ].map(([title, desc]) => (
            <div
              key={title}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {title}
              </h3>
              <p className="mt-3 text-gray-600 text-sm">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TRUST SECTION ================= */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-800">
            Designed to Support Doctors, Not Replace Them
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            AI Health Insight provides informational and risk-awareness tools.
            It does not provide medical diagnoses. Always consult a qualified
            healthcare professional.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;