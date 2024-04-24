import { Link, useNavigate } from "react-router-dom";
import AnimationWrapper from "./animation/AnimationWrapper";
import { useContext } from "react";
import { UserContext } from "@/context/usercontext/UserContext";
import { setAuthAction, setUserAction } from "@/reducers/user-reducer/userActions";


const UserNavigation = () => {
    const { userState, userDispatch } = useContext(UserContext);
    const { isAuthenticated, userInfo:{username} } = userState;
    
    const navigate = useNavigate();

    const signOutUser = async () => {
        try{
            await fetch('/api/auth/signout');
            userDispatch(setUserAction({
                fullname: "",
                profileImg: "",
                role: "user",
                userId: "",
                email: "",
                username,
                isVerified: false
              }));     
              userDispatch(setAuthAction(false));       
            navigate('/');
        }catch(err){            
            console.log('error >>', err)
        }
    }
  return (
    <AnimationWrapper 
        transition={{duration: 0.2,}}
        className="absolute right-0 z-50 top-4 text-white">
        <div className="bg-dark-1 absolute flex flex-col right-0 duration-200 border border-dark-grey w-60">
            <Link to={'/editor'} className="flex gap-2 link md:hidden pl-8 py-4">
                <i className="fi fi-rr-file-edit "></i>
                <p>Write</p>
            </Link>
            <Link to={`/users/${username}`} className="link pl-8 py-4 hover:bg-dark-2">
                Profile
            </Link>
            <Link to={`/dashboard/blogs`} className="link pl-8 py-4 hover:bg-dark-2">
                Dashboard
            </Link>
            <Link to={`/settings/edit-profile`} className="link pl-8 py-4 hover:bg-dark-2">
                Settings
            </Link>
            <span className="absolute border-t border-grey w-full"/>
            <button 
                onClick={signOutUser}
                className="text-left p-4 hover:bg-dark-2 w-full pl-8 py-4">
                <h1 className="font-bold text-xl mg-1">Sign Out</h1>
                <p className="text-grey">@{username}</p>
            </button>
        </div>
    </AnimationWrapper>
  )
}

export default UserNavigation