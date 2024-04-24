import { Link, useNavigate } from "react-router-dom"
import MobileNavbar from "./MobileNavbar"
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/context/usercontext/UserContext";
import Avatar from "./Avatar";
import { setAuthPageModeAction } from "@/reducers/user-reducer/userActions";
import UserNavigation from "./UserNavigation";


const Navbar = () => {
  const { state, dispatchUser } = useContext(UserContext);
  const { isAuthenticated, userInfo:{username, fullname, profileImg} } = state;
  const navigate = useNavigate();
  const navPanelRef = useRef<HTMLDivElement>(null);   
 
  const [isNavPanelVisible, setIsNavPanelVisible] = useState(false);
    
  // console.log("Navbar auth --->> ", isAuthenticated);

    const closeNav = (e: MouseEvent) => {
    // Check if the click occurred outside the navigation menu
    if (navPanelRef.current && !navPanelRef.current.contains(e.target as Node)) {
        // Check if the clicked element or its parent has the toggle button class
        if (!(e.target as HTMLElement).classList.contains('nav__toggle')) {
            setIsNavPanelVisible(false);
        }
      }
    };

    useEffect(() => {    
        document.addEventListener('click', closeNav);
        return () => {        
            document.removeEventListener('click', closeNav);
        }       
      },[closeNav]);

  return (
    <div className="flex flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
        <Link to={`${isAuthenticated ? '/home' : '/'}`} className="flex items-center gap-1">
            <img src="/icons/logo.svg" alt="" />
            <p className="text-[26px] text-white font-extrabold max-sm:hidden">webCall</p>
        </Link>
        <div className="flex items-center gap-4">
          {
            isAuthenticated === true ? (
              <div className="relative nav__toggle cursor-pointer" onClick={() => setIsNavPanelVisible(!isNavPanelVisible)} ref={navPanelRef}>
                <Avatar
                  username={username}
                  fullname={fullname}
                  parentStyles="w-12 h-12 mt-1"
                  profileImg={profileImg}
                />
                <div className="relative">
                  {isNavPanelVisible && <UserNavigation/>}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-5">
                <button onClick={() => {
                  dispatchUser(setAuthPageModeAction('sign-in'));
                  navigate('/auth')
                  }}
                  className='whitespace-nowrap text-white rounded-full py-3 px-6 text-xl capitalize hover:bg-opacity-80 bg-blue-1'
                >
                  Sign In
                </button>
                <button onClick={() => {
                  dispatchUser(setAuthPageModeAction('sign-up'));
                  navigate('/auth')
                  }}
                  className='whitespace-nowrap hidden md:block text-blue-1 rounded-full py-3 px-6 text-xl capitalize hover:bg-opacity-80 bg-white'
                >
                  Sign Up
                </button>
              </div>
            )
          }
          <div className="flex-between gap-5">
              <MobileNavbar/>
          </div>
        </div>
    </div>
  )
}

export default Navbar