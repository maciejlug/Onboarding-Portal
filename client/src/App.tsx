import AppRoutes from "./AppRoutes";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <Navbar />
      <AppRoutes />
    </div>
  );
}

export default App;