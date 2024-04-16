import { jwtDecode } from 'jwt-decode';

export const extractNameFromToken = (token) => {
    if (!token) {
        return "";
    }

    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.name;
    } catch (error) {
        console.error('Error decoding token:', error);
        return "";
    }
};

