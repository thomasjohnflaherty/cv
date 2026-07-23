import { MotionConfig } from "framer-motion";
import { SinglePage } from "./pages/SinglePage";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SinglePage />
    </MotionConfig>
  );
}

export default App;
