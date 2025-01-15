import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendSMSCode = () => {
    // Send the phone number to the backend to generate and send the SMS code
    fetch('https://192.168.110.205:3002/send-sms-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigation.navigate('VerifySMSCode', { phoneNumber }); // Navigate to verify code screen
        } else {
          Alert.alert('Error', 'Phone number not registered or invalid.');
        }
      })
      .catch((error) => {
        console.error('Error sending SMS code:', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <Button title="Send SMS Code" onPress={handleSendSMSCode} />
    </View>
  );
};

export default ForgotPasswordScreen;
