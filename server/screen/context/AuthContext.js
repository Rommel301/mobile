import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            const userData = await AsyncStorage.getItem('userProfile');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        };
        loadUserData();
    }, []);

    const saveUserData = async (userData) => {
        setUser(userData);
        await AsyncStorage.setItem('userProfile', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, saveUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
