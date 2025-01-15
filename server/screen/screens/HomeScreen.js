import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ImageBackground, Animated, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';

const columbaryImage = require('../assets/columbary.png');
const homeImage = require('../assets/home.png');
const p1 = require('../assets/settings.png');
const support = require('../assets/support.png');
const userImage = require('../assets/pogi.png');
const backgroundImage = require('../assets/Background.png');

const Locker = ({ openAt }) => {
  return (
    <View style={styles.logsCard}>
      <Text style={styles.logsTitle}>Recent Access Logs</Text>
      <ScrollView
        style={styles.logsContainer}
        showsVerticalScrollIndicator={true} // Displays the scrollbar
      >
        {openAt.length > 0 ? (
          openAt.map((item, index) => {
            const formattedDate = new Date(item).toLocaleString();
            return (
              <Text key={index} style={styles.logsText}>
                {formattedDate}
              </Text>
            );
          })
        ) : (
          <Text style={styles.logsText}>No access logs available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

function HomeScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [userAccount, setUserAccount] = useState(null);
  const [openAt, setOpenAt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const scaleAnimLocker = useRef(new Animated.Value(1)).current;
  const scaleAnimManageAccount = useRef(new Animated.Value(1)).current;
  const scaleAnimHelpDesk = useRef(new Animated.Value(1)).current;

  // Fetch logs after user data is fetched
  const fetchAccessLogs = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (!token) {
        console.error('No token found, cannot fetch logs');
        return;
      }
  
      const response = await fetch('http://192.168.110.205:3002/api/access-logs', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`  // Ensure token is in header
        },
      });
  
      if (response.ok) {
        const logs = await response.json();
        console.log('Access logs:', logs);
        setOpenAt(logs);  // Update the state with fetched logs
      } else {
        console.error('Error fetching logs:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching access logs:', error.message);
    }
  };
  
  


  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
    fetchUserName(); // Fetch userName or userAccount when the component mounts
  }, []);

  // Fetch userName from AsyncStorage or backend
  const fetchUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) {
        setUserName(name);
        setLoading(false);
      } else {
        fetchUserAccount();
      }
    } catch (error) {
      console.error('Error fetching userName from AsyncStorage:', error);
      setLoading(false);
    }
  };

  // Fetch user account data from the API
  const fetchUserAccount = async () => {
    try {
      // Fetch token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      console.log('Fetched Token:', token); // Add this log to debug
  
      if (!token) {
        console.error('No token found, please log in');
        setLoading(false);  // stop loading if there's no token
        return;
      }
  
      const response = await fetch('http://192.168.110.205:3002/api/user', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const data = await response.json();
      console.log('Fetched User Data:', data);  // Add this log to debug
      if (data.userName) {
        setUserName(data.userName);  // Set username from fetched data
        setUserAccount(data);  // Save the full user data
        fetchAccessLogs(data.email, token);  // Pass the user email and token to fetch logs
      } else {
        console.error('No username found in user data');
      }
  
      setLoading(false);  // Stop loading after the fetch
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  // Handle button press animations
  const handleButtonPressIn = (animation) => {
    Animated.spring(animation, {
      toValue: 0.9,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = (animation) => {
    Animated.spring(animation, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  // If fonts aren't loaded or data is still loading, show a loading screen
  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={80}
        >
          <FlatList
            data={[]}
            ListHeaderComponent={
              <>
                <ImageBackground source={backgroundImage} style={styles.cardContainer}>
                  <Image source={columbaryImage} style={styles.headerImage} />
                  <View style={styles.profileInfoContainer}>
                    <Image source={userImage} style={styles.profileImage} />
                    <Text style={styles.userName}>{userName || 'Loading...'}</Text>
                  </View>
                </ImageBackground>

                <View style={styles.buttonContainer}>
                  <Animated.View style={{ transform: [{ scale: scaleAnimLocker }] }}>
                    <TouchableOpacity
                      style={[styles.button, styles.squareButton]}
                      onPressIn={() => handleButtonPressIn(scaleAnimLocker)}
                      onPressOut={() => handleButtonPressOut(scaleAnimLocker)}
                      onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
                    >
                      <View style={styles.buttonContent}>
                        <Image source={homeImage} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Home</Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>

                  <Animated.View style={{ transform: [{ scale: scaleAnimManageAccount }] }}>
                    <TouchableOpacity
                      style={[styles.button, styles.squareButton]}
                      onPressIn={() => handleButtonPressIn(scaleAnimManageAccount)}
                      onPressOut={() => handleButtonPressOut(scaleAnimManageAccount)}
                      onPress={() => navigation.navigate('ManageAccount')}
                    >
                      <View style={styles.buttonContent}>
                        <Image source={p1} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Settings</Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>

                  <Animated.View style={{ transform: [{ scale: scaleAnimHelpDesk }] }}>
                    <TouchableOpacity
                      style={[styles.button, styles.squareButton]}
                      onPressIn={() => handleButtonPressIn(scaleAnimHelpDesk)}
                      onPressOut={() => handleButtonPressOut(scaleAnimHelpDesk)}
                      onPress={() => navigation.navigate('HelpDesk')}
                    >
                      <View style={styles.buttonContent}>
                        <Image source={support} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Help Desk</Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                </View>

                {/* Render logs */}
                <Locker openAt={openAt} />
              </>
            }
          />
        </KeyboardAvoidingView>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>2025 MobileLocker. All rights reserved.</Text>
        </View>
      </View>
    </View>
  );
}
// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'grey',
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  cardContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    width: '100%',
    height: 220,
  },
  headerImage: {
    position: 'absolute',
    top: 10,
    width: 100,
    height: 50,
  },
  profileInfoContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 5,
    top: 50,
  },
  userName: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    top: 40,
    fontFamily: 'Poppins-Bold',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'black',
    alignItems: 'center',
  },
  squareButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    borderRadius: 15,
  },
  buttonContent: {
    alignItems: 'center',
  },
  buttonIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  footerText: {
    fontSize: 12,
    color: '#fff',
  },
  logsCard: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    borderWidth: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },

  logsContainer: {
    maxHeight: 280, // Limits the height of the container
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
    overflow: 'hidden', // Ensures content doesn't overlap
  },
  
 logsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },

  scrollContainer: {
    maxHeight: 200, // Restrict height to keep content inside the card
    overflow: 'hidden', // Prevent overflow
  },

  logsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;