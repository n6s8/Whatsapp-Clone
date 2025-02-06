import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import WhatsAppChat from "./components/WhatsAppChat";

export default function App (){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/chat" element={<WhatsAppChat />} />
            </Routes>
        </Router>
    );
};

