import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Collections } from "@/pages/Collections";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Collections listing (all) and filtered by collection */}
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:collection" element={<Collections />} />
        <Route path="/collections/:collection/:category" element={<Collections />} />
      </Routes>
    </BrowserRouter>
  );
}
