import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"

function startApp() {
  createRoot(document.getElementById("root")).render(
    <StrictMode><App /></StrictMode>
  )
}

if (window.liff) {
  window.liff.init({ liffId: "2009199519-UViGDRf7" })
    .then(() => {
      window.__liffReady = true;
      if (window.liff.isLoggedIn()) { return window.liff.getProfile(); }
      else { window.liff.login({ redirectUri: window.location.href }); return null; }
    })
    .then(profile => { if (profile) window.__liffUserId = profile.userId; startApp(); })
    .catch(() => { startApp(); });
} else {
  startApp();
}
