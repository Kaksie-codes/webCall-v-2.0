export interface UserInfo {
    username: string;
    profileImg: string;
    fullname: string;
    email: string;
    isVerified: boolean;
    userId: string,
    role: "admin" | "user";
}



export const INITIAL_USER_STATE: InitialUserState = {
    userInfo: {
        username: "", 
        profileImg: "",
        fullname: "",
        userId: "",
        email: "",
        isVerified: false, 
        role: "user"
    },
    authPageMode: 'sign-in',
    isAuthenticated: false
}

// Refine the InitialUserState interface
interface InitialUserState {
    userInfo: UserInfo;
    authPageMode: string;
    isAuthenticated: boolean;
}


import { USER_ACTIONS } from "./userActions";



export type UserAction =
    | {
          type: typeof USER_ACTIONS.SET_AUTH_PAGE_MODE;
          payload: { mode: string };
      }
    | {
          type: typeof USER_ACTIONS.SET_USER_INFO;
          payload: { userInfo: UserInfo};
      }
    | {
          type: typeof USER_ACTIONS.SET_VERIFIED;
          payload: { status: boolean };
      }
    | {
          type: typeof USER_ACTIONS.SET_AUTH;
          payload: { status: boolean };
      };

// Define the reducer function for managing the state of peers
export const userReducer = (state: InitialUserState, action: UserAction): InitialUserState => {
    switch (action.type) {
        case USER_ACTIONS.SET_AUTH_PAGE_MODE:
            return {
                ...state,
                authPageMode: action.payload.mode
            };
        case USER_ACTIONS.SET_USER_INFO:
            return {
                ...state,
                userInfo: action.payload.userInfo 
            };
        case USER_ACTIONS.SET_AUTH:
            return {
                ...state,
                isAuthenticated: action.payload.status
            };
        case USER_ACTIONS.SET_VERIFIED:
            return {
                ...state,
                userInfo: {
                    ...(state.userInfo || {}),
                    isVerified: action.payload.status
                }
            };
        default:
            return state;
    }
};


 