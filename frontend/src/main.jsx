import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import LoginPage from './LoginPage.jsx'
import SignUp from './SignUp.jsx'
import AiChat from './AiChatBot.jsx'
import ChatBot from './components/ChatBot.jsx'
import Landing from "./Landing.jsx"
import JournalPage from "./components/journal/JournalPage.jsx";
import JournalDisplay from "./components/journal/journalDisplay/JournalDisplay.jsx";

//import all the components

import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route, redirect
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index loader={() => redirect("/landing")} />
      <Route path="landing" element={<Landing />} />
      <Route path="journals" element={<JournalDisplay />} />
      <Route path="write" element={<JournalPage />} />
      <Route path="entry/:id" element={<JournalPage />} />
      <Route path='login' element={<LoginPage />} />
      <Route path='chatbot' element={<ChatBot />} />
      {/* <Route path='quiz' element={<Quiz/>}/> */}
      {/* <Route path='dashboard' element={<Dashboard/>}/> */}
      <Route path='signup' element={<SignUp />} />
      {/* <Route path='settings' element={<Settings/>}/> */}
    </Route>
  )
  // {
  //   //landing page
  //   path: '/',
  //   element: <App />
  // },
  // // login and signup and dashboard are accessible through landing page
  // {
  //   path: '/login',
  //   element: <LoginPage />
  // },
  // {
  //   path: '/signUp',
  //   element: <SignUp />
  // },
  // // {
  // //   path: '/dashboard',
  // //   element: <DashboardPage />
  // // },
  // // // journal and settings are accessible through dashboard
  // // {
  // //   path: '/journal',
  // //   element: <JournalPage />
  // // },
  // // {
  // //   path: '/settings',
  // //   element: <SettingsPage />
  // // }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
