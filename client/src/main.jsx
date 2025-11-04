import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext.jsx';
import brandLogoUrl from './assets/brand_logo.png';

// =============================================
// 🧱 Clerk Setup (Commented Out for Manual Users)
// =============================================
// import { ClerkProvider } from '@clerk/clerk-react';
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// if (!PUBLISHABLE_KEY) {
//   throw new Error("Missing Clerk Publishable Key");
// }

// =============================================
// ✅ Render App for MANUAL AUTH SYSTEM
// =============================================
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/"> */}
      <AppContextProvider>
        <App />
      </AppContextProvider>
    {/* </ClerkProvider> */}
  </BrowserRouter>
);

// =============================================
// ✅ Set Favicon Dynamically
// =============================================
const favicon = document.querySelector('link[rel="icon"]');

if (favicon) {
  favicon.href = brandLogoUrl;
  favicon.type = 'image/png';
} else {
  const newFavicon = document.createElement('link');
  newFavicon.rel = 'icon';
  newFavicon.type = 'image/png';
  newFavicon.href = brandLogoUrl;
  document.head.appendChild(newFavicon);
}
