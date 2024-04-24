import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/usercontext/UserContext.tsx'
import { RoomProvider } from './context/roomcontext/RoomContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <RoomProvider>          
          <App />          
        </RoomProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
