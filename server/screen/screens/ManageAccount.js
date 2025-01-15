import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Import images
const columbaryImage = require('../assets/columbary.png');
const profileImage = require('../assets/p1.png');
const resetpincodeImage = require('../assets/security.png');

function ManageAccount() {
    const navigation = useNavigation();

    // Handle Sign Out
    const handleSignOut = async () => {
        Alert.alert(
            'Sign Out',
            'Do you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            // Clear user data from AsyncStorage
                            await AsyncStorage.clear();
                            // Navigate to Login screen after sign out
                            navigation.navigate('LoginScreen');
                        } catch (error) {
                            console.error('Error during sign out:', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    // Navigate to Profile screen
    const goToProfile = () => {
        navigation.navigate('Profile');
    };

    // Navigate to ResetPinCode screen
    const goToResetPinCode = () => {
        navigation.navigate('ResetPinCode'); // Ensure the name matches the one in your navigator
    };

    return (
        <View style={styles.container}>
            {/* Top grey background with the columbary image */}
            <View style={styles.header}>
                <Image source={columbaryImage} style={styles.headerImage} />
            </View>

            {/* Title Text */}
            <Text style={styles.title}>Settings</Text>

            {/* Card */}
            <View style={styles.card}>
                {/* Clickable Profile Section */}
                <TouchableOpacity style={styles.profileContainer} onPress={goToProfile}>
                    <Image source={profileImage} style={styles.profileImage} />
                    <Text style={styles.profileText}>Profile</Text>
                </TouchableOpacity>

                {/* Reset Pincode Section */}
                <TouchableOpacity style={styles.profileContainer} onPress={goToResetPinCode}>
                    <Image source={resetpincodeImage} style={styles.pinImage} />
                    <Text style={styles.profileText}>Reset Pincode</Text>
                </TouchableOpacity>

                {/* Sign Out Button */}
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'grey',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    headerImage: {
        width: 150,
        height: 75,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginVertical: 20,
    },
    card: {
        borderWidth: 5,
        borderColor: 'black',
        borderRadius: 10,
        padding: 20,
        marginTop: 20,
        backgroundColor: 'white',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },

    pinImage:{
        width: 40,
        height: 40,
        borderRadius: 15,
        marginRight: 10,


    },
    profileText: {
        fontSize: 18,
        color: 'black',
        textDecorationLine: 'underline',
    },
    signOutButton: {
        backgroundColor: 'red',
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    signOutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ManageAccount;