export let BACKEND_URL = '';

export const loadConfig = async (): Promise<void> => {
    const response = await fetch('/config.json');
    const config = await response.json();
    BACKEND_URL = config.BACKEND_URL;
    import('./api').then(({ default: api }) => {
        api.defaults.baseURL = `${BACKEND_URL}/api`;
    });
};
