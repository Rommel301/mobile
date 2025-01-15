import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Image,
    StyleSheet,
    Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const handleLogin = async () => {
        if (!Email || !Password) {
            Alert.alert('Error', 'Email and password are required.');
            return;
        }

        setLoading(true);

        try {
            // Send login request
            const response = await axios.post('http://192.168.110.205:3002/login', {
                email: Email,
                password: Password,
            });

            // If login is successful and token is returned
            if (response.data.token) {
                await AsyncStorage.setItem('token', response.data.token);
                Alert.alert('Login Successful', 'Go to the Homescreen!');
                navigation.navigate('Home');
            } else {
                Alert.alert('Login Failed', 'Invalid credentials. Please check your email and password.');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message;

                if (errorMessage === 'Incorrect password') {
                    Alert.alert('Login Failed', 'The password you entered is incorrect.');
                } else if (errorMessage === 'User not found') {
                    Alert.alert('Login Failed', 'The email address you entered is incorrect.');
                } else {
                    Alert.alert('Login Failed', 'An unexpected error occurred. Please try again later.');
                }
            } else {
                Alert.alert('Network Error', 'Unable to connect to the server. Please check your internet connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    return (
        <ImageBackground
            source={require('../assets/Background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            {/* Columbary image at the top */}
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/columbary.png')}
                    style={styles.image}
                    resizeMode="contain"
                />  
            </View>

            {/* Form Card */}
            <View style={styles.container}>
    <View style={styles.formContainer}>
        <Text style={styles.title}>Log In</Text>
        <TextInput
            style={[styles.input, styles.shadowEffect]}
            placeholder="Email"
            value={Email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />

        {/* Password Input with Eye Icon */}
        <View style={[styles.passwordContainer, styles.shadowEffect]}>
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Image
                    source={require('../assets/eye.png')}
                    style={styles.icon}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                value={Password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
            />
        </View>

       

        {/* Login Button */}
        <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
        >
            <Text style={styles.buttonText}>
                {loading ? 'Logging In...' : 'Log In'}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
    </View>
</View>

        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    image: {
        width: '70%',
        height: 150,
        marginBottom: -30,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        paddingTop: 30,
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'grey',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        top: 80,
        marginTop: 20,
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
        borderColor: '#ccc',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: 'white',
    },
    shadowEffect: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
    passwordContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        height: 50,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 5,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
    eyeIcon: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    icon: {
        width: 20,
        height: 20,
        tintColor: 'black',
    },
    loginButton: {
        height: 50,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 20,
        top: 12,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    linkText: {
        color: 'black',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    forgotPassword: {
        position: 'absolute',
        top: -15, // Position it above the login button
        right: 10, // Align to the side (right side in this case)
        fontSize: 14,
    },
});


export default LoginScreen;
