import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DashBoard from './Pages/dashboard'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DashBoard />
  </StrictMode>,
)
