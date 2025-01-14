import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// Import screens
import Mainpage from './app/screens/Mainpage';
import LoginScreen from './app/screens/LoginScreen';
import SignupScreen from './app/screens/SignupScreen';
import HomeScreen from './app/screens/HomeScreen';
import HelpDesk from './app/screens/HelpDesk';
import ManageAccount from './app/screens/ManageAccount';
import Profile from './app/screens/Profile'; // Import Profile screen
import ResetPinCodeScreen from './app/screens/ResetPinCodeScreen';


 

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
                <Stack.Screen
                    name="Main"
                    component={Mainpage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Signup"
                    component={SignupScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="HelpDesk"
                    component={HelpDesk}
                    options={{ headerTitle: "Help Desk" }}
                />
                <Stack.Screen
                    name="ManageAccount"
                    component={ManageAccount}
                    options={{ headerTitle: "Manage Account" }}
                />
                <Stack.Screen
                    name="Profile"
                    component={Profile}
                    options={{ headerTitle: "Profile" }}
                />
                <Stack.Screen
                    name="ResetPinCode"
                    component={ResetPinCodeScreen}
                    options={{ headerTitle: 'Reset Pincode' }} 
                />  

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
