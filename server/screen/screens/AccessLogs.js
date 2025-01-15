import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, AsyncStorage } from 'react-native';

const backgroundImage = require('../assets/Background.png');
const columbaryImage = require('../assets/columbary.png');

const handleRefresh = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        console.log('Fetched Token:', token);  // Log the fetched token
        if (!token) {
            console.error('No token found, please log in');
            return;
        }

        const response = await fetch('http://192.168.110.205:3002/api/access-logs', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.status === 403) {
            console.error('Token is invalid or expired');
            // Handle token expiration, e.g., redirect to login
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to fetch access logs');
        }

        const logs = await response.json();
        setAccessLogsData(logs);
    } catch (error) {
        console.error('Error fetching access logs:', error);
    }
};


const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    columbary: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        width: '90%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    logList: {
        width: '100%',
    },
    logItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    logText: {
        fontSize: 16,
    },
    refreshButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    refreshButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default AccessLogs;