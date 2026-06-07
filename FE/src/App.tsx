import AppRouter from "./router/Index";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
