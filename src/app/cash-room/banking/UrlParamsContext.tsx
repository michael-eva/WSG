import { createContext, useContext, useEffect, useState } from 'react';

type UrlParamsContextType = {
    urlParams: URLSearchParams;
    updateUrlParams: (key: string, value: string | null) => void;
    clearUrlParams: (prefix: string) => void;
};

const defaultValue: UrlParamsContextType = {
    urlParams: new URLSearchParams(),
    updateUrlParams: () => { },
    clearUrlParams: () => { }
};

const UrlParamsContext = createContext<UrlParamsContextType>(defaultValue);

export const UrlParamsProvider = ({ children }: { children: any }) => {
    const [urlParams, setUrlParams] = useState(new URLSearchParams(window.location.search));

    const updateUrlParams = (key: string, value: string | null) => {
        const newParams = new URLSearchParams(urlParams);

        if (value !== null && value !== '') {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }

        setUrlParams(newParams);
        window.history.pushState({}, '', `${window.location.pathname}?${newParams.toString()}`);
    };

    const clearUrlParams = (prefix: string) => {
        const newParams = new URLSearchParams(urlParams);

        for (const key of Array.from(newParams.keys())) {
            if (key.startsWith(prefix)) {
                newParams.delete(key);
            }
        }

        setUrlParams(newParams);
        window.history.pushState({}, '', `${window.location.pathname}?${newParams.toString()}`);
    };

    useEffect(() => {
        const handlePopState = () => {
            setUrlParams(new URLSearchParams(window.location.search));
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return (
        <UrlParamsContext.Provider value={{ urlParams, updateUrlParams, clearUrlParams }}>
            {children}
        </UrlParamsContext.Provider>
    );
};

export const useUrlParams = () => useContext(UrlParamsContext);
