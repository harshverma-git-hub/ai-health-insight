import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import SymptomChecker from "./pages/SymptomChecker";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/symptom-checker"
            element={<SymptomChecker />}
          />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
