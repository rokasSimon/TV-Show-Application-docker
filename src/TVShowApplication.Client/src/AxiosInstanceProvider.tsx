import axios, { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { loadFromLocalStorage, refreshToken, useAuthDispatch } from "./AuthProvider";
import { unixTime } from "./Utils";

const AxiosContext = createContext<AxiosInstance | null>(null);

type AxiosInstanceProviderProps = {
    config?: CreateAxiosDefaults<any>,
    children: any
}

const AxiosInstanceProvider = ({
    config,
    children
}: AxiosInstanceProviderProps) => {
    const [isSetup, setSetup] = useState(false);
    const instanceRef = useRef(axios.create(config))
    const setAuth = useAuthDispatch();

    useEffect(() => {

        if (isSetup) return;
        // Required so this useEffect runs before children useEffects
        setSetup(true);

        const requestInterceptor = async (config: AxiosRequestConfig<any>): Promise<AxiosRequestConfig<any>> => {

            const user = loadFromLocalStorage();
            if (!user) return config;

            const currentTime = unixTime();
            if (user.RefreshTokenExpiresAt <= currentTime) {
                window.location.href = '/user/login';

                return Promise.reject('Refresh token has expired');
            }

            if (user.AccessTokenExpiresAt <= currentTime) {
                const tokens = await refreshToken(setAuth, user);
                if (!tokens || !config.headers) return config;

                config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
                return config;
            }

            config.headers!['Authorization'] = `Bearer ${user.AccessToken}`;
            return config;
        };

        instanceRef.current.interceptors.request.use(requestInterceptor, (err) => {
            console.log(err);

            return Promise.reject(err);
        });

    }, [isSetup]);

    return (
        <AxiosContext.Provider value={instanceRef.current}>
            {isSetup && children}
        </AxiosContext.Provider>  
    );
};

function useAxiosContext() {
    const context = useContext(AxiosContext);
    if (!context) throw new Error("useAxiosContext must be used in AuthProvider");

    return context;
}

export { AxiosInstanceProvider, useAxiosContext }