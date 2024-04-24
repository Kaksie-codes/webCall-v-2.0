// import { Toaster } from 'react-hot-toast'
import { Toaster } from "@/components/ui/toaster"
import { Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import UpcomingPage from './pages/UpcomingPage'
import PreviousPage from './pages/PreviousPage'
import RecordingsPage from './pages/RecordingsPage'
import PersonalRoomPage from './pages/PersonalRoomPage'
import PrivateRoute from './components/PrivateRoute'
import LandingPage from './pages/LandingPage'
import UserVerificationPage from './pages/UserVerificationPage'


function App() {  

  return (
    <div className='bg-dark-2'> 
      <Toaster/>     
      <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/auth' element={<AuthPage/>}/>
          <Route path='users/:id/verify/:token' element={<UserVerificationPage/>}/>

                 {/*Protected Routes  */}
          <Route path='' element={<PrivateRoute/>}> 
            <Route path='/home' element={<HomePage/>}/>            
            <Route path='/upcoming' element={<UpcomingPage/>}/>
            <Route path='/personal-room' element={<PersonalRoomPage/>}/>
            <Route path='/recordings' element={<RecordingsPage/>}/>
            <Route path='/previous' element={<PreviousPage/>}/>
          </Route>
      </Routes>      
    </div>
  )
}

export default App
