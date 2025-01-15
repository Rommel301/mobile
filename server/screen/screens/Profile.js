import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Import images
const columbaryImage = require('../assets/columbary.png');
const pogiImage = require('../assets/pogi.png'); // Import pogi.png image

function EditProfile() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Fetch user data from the backend
    const fetchUserData = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            Alert.alert('Error', 'No token found, please log in again.');
            return;
          }
      
          const response = await axios.get('http://192.168.110.205:3002/me', {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token as Bearer in the Authorization header
            },
          });
      
          const { Name, Email, Contact_No, Address } = response.data;
          setUserData({
            name: Name,
            email: Email,
            contactNumber: Contact_No,
            address: Address,
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error', 'Failed to fetch user data. Please try again.');
        } finally {
          setLoading(false);
        }
      };

    // Save changes to the backend
    const handleSaveChanges = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No token found. Please log in again.');
                return;
            }

            // Send PUT request to update the profile
            const response = await axios.put('http://192.168.0.192:3002/update', userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            Alert.alert('Success', response.data.message);
            setIsEditing(false); // Disable editing after saving changes
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Unable to update profile. Please try again.');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Top grey background with the columbary image */}
            <View style={styles.header}>
                <Image source={columbaryImage} style={styles.headerImage} />
            </View>

            <Text style={styles.title}>Edit Profile</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={styles.card}>
                    {/* Display the pogi.png image above the name */}
                    <Image source={pogiImage} style={styles.pogiImage} />

                    {/* Editable Name */}
                    <Text style={styles.userInfo}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.name}
                        onChangeText={(text) => setUserData({ ...userData, name: text })}
                        editable={isEditing}
                    />

                    {/* Editable Email */}
                    <Text style={styles.userInfo}>Email:</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.email}
                        onChangeText={(text) => setUserData({ ...userData, email: text })}
                        editable={isEditing}
                    />

                    {/* Editable Contact Number */}
                    <Text style={styles.userInfo}>Contact Number:</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.contactNumber}
                        onChangeText={(text) => setUserData({ ...userData, contactNumber: text })}
                        editable={isEditing}
                    />

                    {/* Editable Address */}
                    <Text style={styles.userInfo}>Address:</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.address}
                        onChangeText={(text) => setUserData({ ...userData, address: text })}
                        editable={isEditing}
                    />

                    {/* Button to toggle edit/save */}
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={isEditing ? handleSaveChanges : () => setIsEditing(true)} // Toggle editing mode
                    >
                        <Text style={styles.editButtonText}>
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        paddingTop: 1,
        backgroundColor: 'grey',
        alignItems: 'center',  // Align children horizontally

        
    },
    header: {
        width: '50%', // Make sure the header takes the full width
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    headerImage: {
        width: '60%', // Make the header image responsive
        height: 55,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginBottom: 20,
    },
    card: {
        width: '90%', // Ensure the card is responsive
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        padding: 10,
        paddingTop: -0.8,
        backgroundColor: 'white',
        marginBottom: 20,
    },
    pogiImage: {
        width: 100,  // Adjust the width as needed
        height: 100,  // Adjust the height as needed
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 20,
    },
    userInfo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        color: 'black',
        backgroundColor: '#f8f8f8',
    },
    editButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    editButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditProfile;
