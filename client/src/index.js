import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from './App.jsx';
import './style/main.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SessionPage from "./pages/SessionPage.jsx";
import HomePage from "./pages/HomePage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/session",
        element: <SessionPage/>
    },
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
)