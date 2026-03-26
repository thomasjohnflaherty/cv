import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { TechPage } from "./pages/TechPage";
import { MusicPage } from "./pages/MusicPage";
import { ContactPage } from "./pages/ContactPage";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<TechPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Footer />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
