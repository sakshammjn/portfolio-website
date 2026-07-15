import { StrictMode, type ComponentType, type ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BlogList } from './pages/BlogList'
import { BlogPostPage } from './pages/BlogPost'
import { Changelog } from './pages/Changelog'
import { NotFound } from './pages/NotFound'
import { blogPosts } from './data/content'
import { printConsoleGreeting } from './lib/consoleGreeting'
import './styles/index.css'

// A small wink for anyone who opens DevTools.
printConsoleGreeting()

// Tiny path-based router: the portfolio at "/", the writing index at
// "/blogs", a post at "/blogs/<slug>", the release ledger at "/changelog" —
// anything else is a real 404 instead of silently showing the homepage.
// Navigation is a full page load (SPA fallback handles the serve), which
// keeps the app dependency-free for a handful of routes.
const path = window.location.pathname.replace(/\/+$/, '')
const ROUTES: Record<string, ComponentType> = {
  '': App,
  '/blogs': BlogList,
  '/changelog': Changelog,
}

let element: ReactElement
if (ROUTES[path]) {
  const Route = ROUTES[path]
  element = <Route />
} else if (path.startsWith('/blogs/')) {
  const slug = path.slice('/blogs/'.length)
  const post = blogPosts.find((p) => p.slug === slug)
  element = post ? <BlogPostPage post={post} /> : <NotFound />
} else {
  element = <NotFound />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>{element}</StrictMode>,
)
