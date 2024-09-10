import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { requireAuth } from './services/UserAuth.jsx'
import './index.css'
import LoginPage, { loader as loginLoader, action as loginAction } from './LoginPage.jsx'
import SignUp from './SignUp.jsx'
import AiChat from './AiChatBot.jsx'
import ChatBot, { loader as AiChatLoader } from './components/ChatBot.jsx'
import Landing from "./Landing.jsx"
import AiJournal, { loader as AiJournalLoader } from './components/AiJournal.jsx'
import JournalPage from "./components/journal/JournalPage.jsx";
import JournalDisplay, { loader as journalLoader } from "./components/journal/journalDisplay/JournalDisplay.jsx";
import Dashboard, { loader as dashboardLoader } from "./Dashboard.jsx"
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
      <Route
        path="journals"
        element={<JournalDisplay />}
        loader={journalLoader}
        errorElement={<h1>There was an error</h1>}
      />
      <Route path="write" element={<JournalPage />} />
      <Route
        path="entry/:id"
        element={<JournalPage />}
        loader={async () => await requireAuth()} />
      <Route
        path='login'
        element={<LoginPage />}
        loader={loginLoader}
        action={loginAction}
      />
      <Route
        path='chatbot'
        element={<ChatBot />}
        loader={AiChatLoader}
      />
      <Route
        path='aijournal'
        element={<AiJournal />}
        loader={AiJournalLoader}
      />
      {/* <Route path='quiz' element={<Quiz/>}/> */}
      <Route
        path='dashboard'
        element={<Dashboard />}
        loader={dashboardLoader}
      />
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
