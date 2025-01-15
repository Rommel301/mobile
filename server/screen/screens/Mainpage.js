// app/screens/Main.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';

const Main = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/columbary.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.motto}>
          "Secure. Convenient. Always There."
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.introText}>
        Columbary Locker: Your trusted solution for safe and easy storage. 
        Sign up now to experience peace of mind!
      </Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    marginTop: 50,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  motto: {
    fontSize: 20,
    fontStyle: 'italic',
    color: 'white',
    marginBottom: 30, // Space below motto
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 100, // Increased margin to push it much further down
    marginBottom: 70,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 80, // Adjusted to ensure buttons are lower
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    height: 20,
  },
  image: {
    width: 180,
    height: 180,
  },
});

export default Main;
