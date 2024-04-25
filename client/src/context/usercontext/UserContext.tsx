// Import necessary modules and components
import Loader from "@/components/Loader"; // Component for displaying loading animation
import { setAuthAction, setUserAction } from "@/reducers/user-reducer/userActions"; // Action creators for setting authentication and user data
import { INITIAL_USER_STATE, userReducer } from "@/reducers/user-reducer/userReducer"; // Initial state and reducer for managing user data
import { ReactNode, createContext, useEffect, useReducer, useState } from "react"; // Necessary React imports for creating context and managing state
import { useNavigate } from "react-router-dom"; // Hook for navigation within React Router

// Define interface for props passed to UserProvider component
interface RoomProviderProps {
    children: ReactNode; // Children elements passed to UserProvider
}

// Create context for user data
export const UserContext = createContext<any | null>(null);

// Define UserProvider component
export const UserProvider = ({children}: RoomProviderProps) => {
    const navigate = useNavigate(); // Hook for navigating within React Router
    const [userState, userDispatch] = useReducer(userReducer, INITIAL_USER_STATE); // State and dispatch function for managing user data
    const [loading, setLoading] = useState(true); // State for managing loading state

    // Function to read authentication cookies
    const readCookies = async () => {        
        try {
            // Submit request to server to read cookies
            const res = await fetch(`/api/auth/read-cookies`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },                    
            });
            const result = await res.json(); // Parse response JSON           
            if (result.success === false) {
                console.log(result.message); // Log error message if cookie reading fails
            } else {
                // Extract user data from response and dispatch actions to set user and authentication data
                const { fullname, userId, username, role, verified, profileImg, email } = result.userData
                userDispatch(setUserAction({
                    fullname,
                    profileImg,
                    role,
                    userId,
                    email,
                    username,
                    isVerified: verified
                }));
                userDispatch(setAuthAction(true)); // Set authentication to true               
            }
        } catch(err:any) {
            console.log('backend error >>', err.message); // Log backend error message if request fails       
        } finally {
            setLoading(false); // Set loading to false after cookie reading process completes
        }       
    }

    // Effect hook to trigger cookie reading when navigation changes
    useEffect(() => {
        readCookies();
    }, [navigate]); 

    // Render loading state while fetching authentication data
    if (loading) {
        return (
            <div className="h-screen w-screen grid place-items-center bg-dark-1 ">
                <Loader/>
            </div>
        );
    }

    // Context values containing user data and loading state
    const contextValues = {
        userState,
        loading,
        userDispatch
    } 

    // Provide context with user data to children components
    return (
        <UserContext.Provider value={contextValues}>
            {children}
        </UserContext.Provider>
    )
}
