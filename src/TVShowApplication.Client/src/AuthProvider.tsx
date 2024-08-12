import axios, { AxiosInstance } from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { Routes } from "./apiRoutes";
import { AuthenticatedResponse, ContextStatus, LoginRequest, RefreshTokenRequest, RegisterRequest, User } from "./AuthenticationTypes";
import { parseJwt, unixTime } from "./Utils";

const USER_KEY = "TVShowApplication.User";

type AuthDispatch = React.Dispatch<AuthenticationState>

type AuthenticationState = {
    status: ContextStatus,
    user: User | null,
    error: any | null,
}

const initialState: AuthenticationState = {
    status: ContextStatus.Idle,
    user: null,
    error: null,
};

const AuthStateContext = createContext<AuthenticationState | null>(initialState);
const AuthDispatchContext = createContext<AuthDispatch | null>(null);

function reducer(currentState: AuthenticationState, newState: AuthenticationState): AuthenticationState {
    const mergedState = { ...currentState, ...newState };

    if (mergedState.user) {
        saveToLocalStorage(mergedState.user);
    } else {
        localStorage.removeItem(USER_KEY);
    }

    return mergedState;
}

function useAuthState() {
    const context = useContext(AuthStateContext);
    if (!context) throw new Error("useAuthState must be used in AuthProvider");

    return context;
}

function useAuthDispatch() {
    const context = useContext(AuthDispatchContext);
    if (!context) throw new Error("useAuthDispatch must be used in AuthProvider");

    return context;
}

async function login(dispatch: AuthDispatch, request: LoginRequest) {
    const route = Routes.GetToken;

    try {
        const getTokenResponse = await axios.post<AuthenticatedResponse>(route, request);
        if (getTokenResponse.status != 200
            || !getTokenResponse.data.accessToken
            || !getTokenResponse.data.refreshToken) {

            dispatch({ user: null, status: ContextStatus.Rejected, error: 'Missing access token, refresh token or wrong status code' });
            return;
        }

        const accessTokenPayload = parseJwt(getTokenResponse.data.accessToken);
        const userData: User = {
            Id: accessTokenPayload.Id,
            Role: accessTokenPayload.Role,
            Email: request.Email,
            AccessToken: getTokenResponse.data.accessToken,
            RefreshToken: getTokenResponse.data.refreshToken,
            AccessTokenExpiresAt: accessTokenPayload.ExpiresAt,
            RefreshTokenExpiresAt: accessTokenPayload.RefreshTokenExpirationTime,
        };

        dispatch({ user: userData, status: ContextStatus.Completed, error: null });
    } catch (e) {
        console.error(e);

        dispatch({ error: e, user: null, status: ContextStatus.Rejected });
    }
}

async function register(dispatch: AuthDispatch, request: RegisterRequest): Promise<boolean> {
    const route = Routes.SignUp;

    try {
        const response = await axios.post(route, request);
        if (response.status != 200) {
            return false;
        }

        return true;
    } catch (e) {
        console.error(e);

        return false;
    }
}

async function logout(dispatch: AuthDispatch, authenticatedAxios: AxiosInstance) {
    const route = Routes.RevokeToken;

    console.log(authenticatedAxios.interceptors.request);

    try {
        const response = await authenticatedAxios.post(route,
            {
                data: undefined
            },
        );

        dispatch({ error: null, user: null, status: ContextStatus.Completed });
    } catch (e: any) {
        console.error(e);

        dispatch({ error: e, user: null, status: ContextStatus.Rejected });
    }
}

async function refreshToken(dispatch: AuthDispatch, user: User): Promise<AuthenticatedResponse | null> {
    const route = Routes.RefreshToken;

    const request: RefreshTokenRequest = {
        AccessToken: user.AccessToken,
        RefreshToken: user.RefreshToken,
    };

    try {
        const response = await axios.post<AuthenticatedResponse>(route, request);
        if (response.status != 200
            || !response.data.accessToken
            || !response.data.refreshToken) {

            dispatch({ user: null, status: ContextStatus.Rejected, error: 'Missing access token, refresh token or wrong status code' });
            return null;
        }

        const accessTokenPayload = parseJwt(response.data.accessToken);
        const userData: User = {
            Id: accessTokenPayload.Id,
            Role: accessTokenPayload.Role,
            Email: user.Email,
            AccessToken: response.data.accessToken,
            RefreshToken: response.data.refreshToken,
            AccessTokenExpiresAt: accessTokenPayload.ExpiresAt,
            RefreshTokenExpiresAt: accessTokenPayload.RefreshTokenExpirationTime,
        };

        dispatch({ error: null, user: userData, status: ContextStatus.Completed });

        return { accessToken: response.data.accessToken, refreshToken: response.data.refreshToken };
    } catch (e: any) {
        console.error(e);

        dispatch({ error: e, user: null, status: ContextStatus.Rejected });

        return null;
    }
}

function loadFromLocalStorage(): User | null {
    const localStorageUser = localStorage.getItem(USER_KEY);
    if (!localStorageUser) return null;

    const user: User = JSON.parse(localStorageUser);
    const currentTime = unixTime();
    if (user.RefreshTokenExpiresAt <= currentTime) {
        localStorage.removeItem(USER_KEY);
        return null
    }

    return user;
}

function saveToLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function AuthProvider({ children }: any) {
    const [state, setState] = useReducer(reducer, { ...initialState });

    useEffect(() => {
        const validStoredUser = loadFromLocalStorage();
        if (!validStoredUser) return;

        setState({ ...state, user: validStoredUser });
    }, []);

    //useEffect(() => {
    //    const reviveUser = async (user: User) => {
    //        await refreshToken(setState, user);
    //    };

    //    const currentTime = unixTime();
    //    if (state.user &&
    //        state.user.AccessTokenExpiresAt <= currentTime &&
    //        state.user.RefreshTokenExpiresAt >= currentTime) {
    //        reviveUser(state.user);
    //    }
    //}, [state]);

    return (
        <AuthStateContext.Provider value={state}>
            <AuthDispatchContext.Provider value={setState}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    );
}

export { AuthProvider, useAuthState, useAuthDispatch, login, logout, register, refreshToken, loadFromLocalStorage }