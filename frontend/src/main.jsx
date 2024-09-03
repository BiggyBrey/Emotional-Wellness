import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import LoginPage from './LoginPage.jsx'
import SignUp from './SignUp.jsx'
import AiChat from './AiChatBot.jsx'

//import all the components

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    //landing page
    path: '/',
    element: <App />
  },
  // login and signup and dashboard are accessible through landing page
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/signUp',
    element: <SignUp />
  },
  // {
  //   path: '/dashboard',
  //   element: <DashboardPage />
  // },
  // // journal and settings are accessible through dashboard
  // {
  //   path: '/journal',
  //   element: <JournalPage />
  // },
  // {
  //   path: '/settings',
  //   element: <SettingsPage />
  // }

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
