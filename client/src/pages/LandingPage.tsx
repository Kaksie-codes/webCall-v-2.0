import Navbar from "@/components/Navbar"
import { UserContext } from "@/context/usercontext/UserContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";


const LandingPage = () => {
  const { userState } = useContext(UserContext);    
  const {isAuthenticated} = userState;

  console.log('auth state ====>', isAuthenticated)

  return (
    <>
    {
      isAuthenticated ? (
        <Navigate  to={'/home'}/>
      ) : (
      <div className="min-h-screen w-screen">      
        <Navbar/>        
      </div>
      )
    }
    </>    
  )
}

export default LandingPage