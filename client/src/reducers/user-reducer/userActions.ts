import { UserInfo } from "./userReducer";

export const USER_ACTIONS = {
    SET_USER_INFO: "set-user",
    SET_VERIFIED: "set-verified",
    SET_AUTH_PAGE_MODE: "auth-page-mode",
    SET_AUTH: "is-auth",
} as const;

export const setAuthPageModeAction = (mode: string) => ({
    type: USER_ACTIONS.SET_AUTH_PAGE_MODE,
    payload: { mode } as { mode: string } // Specify the type of payload
});

export const setUserAction = (userInfo: UserInfo) => ({
    type: USER_ACTIONS.SET_USER_INFO,
    payload: { userInfo } as { userInfo: UserInfo } // Specify the type of payload
});

export const setVerificationAction = (status: boolean) => ({
    type: USER_ACTIONS.SET_VERIFIED,
    payload: { status } // Specify the type of payload
});

export const setAuthAction = (status: boolean) => ({
    type: USER_ACTIONS.SET_AUTH,
    payload: { status } // Specify the type of payload
});


