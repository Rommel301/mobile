import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Alert, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({ navigation }) => {
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Contact_No, setContactNumber] = useState('');
    const [Address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSignup = async () => {
        setLoading(true);
        try {
            // Send the POST request
            const response = await axios.post(
                'http://192.168.110.205192.168.0.104:3002/register', // Your server address
                {
                    Name,
                    Email,
                    Password,
                    Contact_No,
                    Address,
                },
                {
                    headers: {
                        'Content-Type': 'application/json', // Ensure the request is sent as JSON
                    },
                }
            );
    
            // If registration is successful
            Alert.alert('Signup', response.data.message, [
                { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
            ]);
        } catch (error) {
            setLoading(false); // Stop the loading state if there's an error
            
            // Handle different types of error responses
            if (error.response) {
                // Error from the server (status code 400 or other)
                Alert.alert('Error', error.response.data.message || 'Something went wrong. Please try again.');
            } else if (error.request) {
                // Network error (e.g., no internet connection)
                Alert.alert('Error', 'Network error. Please try again.');
            } else {
                // Unknown error
                Alert.alert('Error', 'Unexpected error occurred. Please try again.');
            }
        }
    };
    
    

    return (
        <ImageBackground
            source={require('../assets/Background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={styles.content}>
                        <Image
                            source={require('../assets/columbary.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        <View style={styles.formContainer}>
                            <Text style={styles.title}>Sign Up</Text>
                            <TextInput style={[styles.input, styles.shadowEffect]} placeholder="Name" value={Name} onChangeText={setName} />
                            <TextInput style={[styles.input, styles.shadowEffect]} placeholder="Email" value={Email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                            
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[styles.input, styles.passwordInput, styles.shadowEffect]}
                                    placeholder="Password"
                                    value={Password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!isPasswordVisible}
                                />
                                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                                    <Image
                                        source={require('../assets/eye.png')}
                                        style={styles.icon}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                            
                            <TextInput style={[styles.input, styles.shadowEffect]} placeholder="Contact Number" value={Contact_No} onChangeText={setContactNumber} keyboardType="phone-pad" />
                            <TextInput style={[styles.input, styles.shadowEffect]} placeholder="Address" value={Address} onChangeText={setAddress} />

                            <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
                                <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={styles.linkText}>Already have an account? Log in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: '100%',
        height: 100,
        marginBottom: 20,
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'black',
    },
    input: {
        height: 50,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: 'white',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    passwordInput: {
        flex: 1,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        padding: 10,
    },
    icon: {
        width: 20,
        height: 20,
        bottom: 5,
    },
    shadowEffect: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
    signupButton: {
        height: 50,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    linkText: {
        color: 'black',
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
});

export default SignupScreen;
