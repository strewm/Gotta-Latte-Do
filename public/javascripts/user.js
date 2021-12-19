import { handleErrors } from './utils.js';

// Fetches current logged in user
export const fetchUser = async () => {
    const userRes = await fetch('/users/current')
    const { user } = await userRes.json();
    return user;
}
