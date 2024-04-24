import Loader from "@/components/Loader";
import { setAuthAction, setUserAction } from "@/reducers/user-reducer/userActions";
import { INITIAL_USER_STATE, userReducer } from "@/reducers/user-reducer/userReducer";
import { ReactNode, createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

interface RoomProviderProps {
    children: ReactNode; 
}

export const UserContext = createContext<any | null>(null);


export const UserProvider = ({children}: RoomProviderProps) => {
    const navigate = useNavigate();
    const [state, dispatchUser] = useReducer(userReducer, INITIAL_USER_STATE);
    const [loading, setLoading] = useState(true); // Add loading state

    console.log({state})
    // console.log('isAuthenticated: >>>', state.isAuthenticated)
    const readCookies = async () => {        
        try {
            // Submit the form data
            const res = await fetch(`/api/auth/read-cookies`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },                    
            });
            const result = await res.json();           
            console.log('reading cookie')
            if (result.success === false) {
                console.log(result.message);
                // setLoading(false); // Set loading to false when authentication data is retrieved
            } else {
                const { fullname, userId, username, role, verified, profileImg, email } = result.userData
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
                //   setLoading(false); // Set loading to false when authentication data is retrieved
                  
            // }
        }
    }catch(err:any) {
        console.log('backend error >>', err.message);
        // toast.error(err?.data?.message)
    }finally{
        setLoading(false); 
    }       
}

    
    useEffect(() => {
        readCookies();
    }, [navigate]); 

    if (loading) {
        // Render loading state while fetching authentication data
        return (
        <div className="h-screen w-screen grid place-items-center bg-dark-1 ">
            <Loader/>
        </div>
        );
    }

    const contextValues = {
        state,
        loading,
        dispatchUser
    }
    return (
        <UserContext.Provider value={contextValues}>
            {children}
        </UserContext.Provider>
    )
}