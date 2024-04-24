import { UserContext } from "@/context/usercontext/UserContext";
import { app } from "@/firebase";
import { setAuthAction, setUserAction } from "@/reducers/user-reducer/userActions";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Oauth = () => {
    const { userDispatch } = useContext(UserContext);  
    const navigate = useNavigate(); 
    const [isLoading, setIsloading] = useState<boolean>(false); 

    const handleClick = async () => { 
        try{
            setIsloading(true);
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider); 
            const res = await fetch(`/api/auth/google-auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                }),
            })
            const data = await res.json();
            const { user, success, message} = data
            if(!success){
                toast.error(message);
            }else{
                toast.success(message);
                const {fullname, profileImg, role, userId, username, verified, email } = user
                setTimeout(() => {
                    userDispatch(setUserAction({
                        fullname,
                        profileImg,
                        role,
                        userId,
                        email,
                        username,
                        isVerified: verified
                      }));
                      userDispatch(setAuthAction(true));
                      navigate('/home');
                }, 3000)
            }            
        }catch(err){
            console.log(`could'nt log in with google`, err);            
        }finally{
            setIsloading(false);
        }
    }
  return (
    <button
        disabled={isLoading}  
        onClick={handleClick}
        className={`${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} btn-dark flex items-center justify-center gap-4 w-[90%] center"`}>
         {isLoading ? 'Signing In...' : 'Continue with Google'}
        <img src='/images/google.png' alt="google icon" className="w-5" />
    </button>
  )
}

export default Oauth