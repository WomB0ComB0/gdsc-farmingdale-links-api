import React from "react";
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from './serviceWorker';

const container = document.getElementById("app")! as HTMLElement;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={
          <>
            <main style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100dvh",
              width: "100dvw",
            }}>
              <h1>404 Not Found 😓</h1>
              <button
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50px",
                  width: "100px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "black",
                  color: "white",
                  cursor: "pointer",
                  transition: "background-color 0.25s ease",
                }}
              >
                <a href="/">Go ⬅️ Home</a>
              </button>
            </main>
          </>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

reportWebVitals();
serviceWorker.register();
