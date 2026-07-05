import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { inject } from '@vercel/analytics'
import App from './App.tsx'
import { BlogList } from './pages/BlogList'
import { printConsoleGreeting } from './lib/consoleGreeting'
import './styles/index.css'

// A small wink for anyone who opens DevTools.
printConsoleGreeting()

// Privacy-friendly page analytics (Vercel — no cookies, no PII). Production
// only, so the dev console stays clean for the CLI easter egg above.
if (import.meta.env.PROD) inject()

// Tiny path-based router: the portfolio at "/", the writing index at "/blogs".
// Navigation between them is a full page load (SPA fallback handles the serve),
// which keeps the app dependency-free for just two routes.
const path = window.location.pathname.replace(/\/+$/, '')
const Root = path === '/blogs' ? BlogList : App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
