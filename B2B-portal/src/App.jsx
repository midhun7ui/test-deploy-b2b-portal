import { useCallback, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import Preloader from "./components/Preloader";

function App() {
  const [showPreloader, setShowPreloader] = useState(() => {
    try {
      return !sessionStorage.getItem("preloader_shown");
    } catch {
      return false;
    }
  });

  const handlePreloaderComplete = useCallback(() => {
    try {
      sessionStorage.setItem("preloader_shown", "true");
    } catch {
      // ignore
    }
    setShowPreloader(false);
  }, []);

  return (
    <>
      {showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      <AppRoutes />
    </>
  );
}

export default App;