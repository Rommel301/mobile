import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ResetPinCodeScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track if the form is being submitted
  const [token, setToken] = useState(''); // State to hold the token

  // Fetch email, PIN, and token from AsyncStorage on mount
  useEffect(() => {
    const fetchEmailAndPinCode = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedPinCode = await AsyncStorage.getItem('pinCode'); // Ensure this is being stored correctly
        const storedToken = await AsyncStorage.getItem('token'); // Ensure token is fetched correctly
  
        if (storedEmail) {
          setEmail(storedEmail);
        }
        if (storedPinCode) {
          setOldPin(storedPinCode);  // Set the PIN from AsyncStorage
        }
        if (storedToken) {
          setToken(storedToken);  // Set token in state
        }
      } catch (error) {
        console.error('Error fetching email, PIN, or token:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEmailAndPinCode();
  }, []);

  const handleSubmit = async () => {
    if (newPin !== confirmNewPin) {
        alert('New PIN and Confirm PIN do not match.');
        return;
    }

    if (!oldPin || !newPin || !confirmNewPin) {
        alert('Please fill in all fields.');
        return;
    }

    setIsSubmitting(true);

    try {
        const response = await axios.put(
            'http://192.168.0.104:3002/reset-pin',
            { oldPin, newPin, confirmNewPin },  // Include confirmNewPin here
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('Response from server:', response.data);  // Log the full response

        if (response.status === 200) {
            // If the PIN was updated, show the success message
            Alert.alert('Success', 'Your PIN has been updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
            setOldPin('');
            setNewPin('');
            setConfirmNewPin('');
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        if (error.response) {
            alert(error.response.data.message || 'Failed to update PIN. Please try again.');
        } else {
            alert('Network error or server unreachable.');
        }
    } finally {
        setIsSubmitting(false);
    }
};





  return (
    <View style={styles.container}>
      <Text>Reset Your PIN</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text>Email:</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            style={styles.input}
            editable={false}a
          />
        </>
      )}

      <Text>Old PIN:</Text>
      <TextInput
        value={oldPin}
        onChangeText={setOldPin}
        placeholder="Enter your old PIN"
        style={styles.input}
      />

      {/* Show oldPin value for debugging purposes */}

      <Text>New PIN:</Text>
      <TextInput
        value={newPin}
        onChangeText={setNewPin}
        secureTextEntry
        placeholder="Enter your new PIN"
        style={styles.input}
      />

      {/* Show newPin value for debugging purposes */}

      <Text>Confirm New PIN:</Text>
      <TextInput
        value={confirmNewPin}
        onChangeText={setConfirmNewPin}
        secureTextEntry
        placeholder="Confirm your new PIN"
        style={styles.input}
      />

      <Button 
        title={isSubmitting ? "Resetting..." : "Reset PIN"} 
        onPress={handleSubmit} 
        disabled={isSubmitting} // Disable button while submitting
      />

      {isSubmitting && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default ResetPinCodeScreen;