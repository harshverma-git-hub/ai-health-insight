import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default MainLayout;