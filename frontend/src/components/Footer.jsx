function Footer() {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Description */}
          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              AI Health Insight
            </h2>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              AI Health Insight is an AI-powered healthcare support platform
              designed to help users understand possible health conditions
              based on symptoms using machine learning.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>AI Symptom Checker</li>
              <li>Health Reports</li>
              <li>Personal Health Records</li>
              <li>Future Doctor Consultations</li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Legal & Medical
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Privacy Policy</li>
              <li>Terms of Use</li>
              <li>Medical Disclaimer</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t mt-8 pt-4 text-center text-xs text-gray-500">
          <p>
            ⚠️ This platform does not provide medical diagnoses.
            AI-generated insights are for informational purposes only.
            Always consult a licensed healthcare professional.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} AI Health Insight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;