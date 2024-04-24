import Loader from "@/components/Loader";
import { UserContext } from "@/context/usercontext/UserContext";
import { setAuthAction, setUserAction } from "@/reducers/user-reducer/userActions";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const UserVerificationPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const { token, id }= useParams();
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string>('');
    const [status, setStatus] = useState<boolean>(false);
    const { state, dispatchUser } = useContext(UserContext); 
    const { isAuthenticated } = state
  

    const resendVerificationEmail = async() => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/auth/resendVerificationMail/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })

            const { message:statusMessage, userId, success} = await res.json();

            if(success == false){
                setStatus(false); 
                toast.error(statusMessage);                   
            }else{
                setUserId(userId);                    
                setStatus(true);
                toast.success(statusMessage);
            }
            setIsLoading(false);
            setStatus(status);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await fetch(`/api/auth/${id}/verify/${token}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })

                const { message:statusMessage, success, userData} = await res.json();

                if(success == false){
                    setStatus(false);
                    toast.error(statusMessage);                                      
                }else{
                    // setUserId(userId);                    
                    setStatus(true);
                    toast.success(statusMessage);
                    const {fullname, profileImg, role, userId, username, verified, email } = userData
                    dispatchUser(setUserAction({
                        fullname,
                        profileImg,
                        role,
                        userId,
                        email,
                        username,
                        isVerified: verified
                      }));
                      dispatchUser(setAuthAction(true));
                    //   navigate('/home');                    
                }                
                setStatus(status)
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        if (!isAuthenticated) {
            verifyUser();
        }
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            setLoading(false);
        }
    }, [isAuthenticated])

  return (
    <div className="grid place-items-center h-cover">
    {
        loading ? (
            <Loader/>
        ) : (
            isAuthenticated == true ? (
                <div className="text-center">
                    <h1 className="font-gelasio text-5xl">Your Account is successfully verified</h1>
                    <button
                        onClick={() => navigate(`/users/${userId}`)} 
                        className="btn-dark"
                    >
                        Update your Profile
                    </button>
                </div>
            ) : (
                <div className="text-center">
                    <h1 className={`font-gelasio text-5xl`}>Your account is not verified</h1>
                    <button
                        disabled={isLoading}
                        onClick={resendVerificationEmail} 
                        className={`btn-dark ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {isLoading ? 'sending...' : 'Resend Verification Email'}   
                    </button>
            </div>
            )
            
        )
    }        
    </div>
  )
}

export default UserVerificationPage