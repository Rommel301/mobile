import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Remove background image
const columbaryImage = require('../assets/columbary.png'); 

const Feedback = () => {
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showFAQs, setShowFAQs] = useState(false);

    const toggleFeedback = () => {
        setShowFeedback(!showFeedback);
        if (showFAQs) setShowFAQs(false); 
    };

    const toggleFAQs = () => {
        setShowFAQs(!showFAQs);
        if (showFeedback) setShowFeedback(false); 
    };

    // Fetch the user's email when the component mounts
    useEffect(() => {
        const fetchUserEmail = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://192.168.110.205:3002/me', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setEmail(response.data.Email); // Set the email from the response
                } catch (error) {
                    console.error("Error fetching user email:", error);
                }
            }
        };

        fetchUserEmail();
    }, []);

    const handleSubmit = async () => {
        if (!comment) {
            Alert.alert("Error", "Please enter your feedback comment.");
            return;
        }

        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');

            const response = await axios.post('http://192.168.110.205:3002/feedback', {
                email,  // Include the user's email
                comment,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                Alert.alert("Success", "Feedback submitted successfully!");
                setComment(''); // Clear the comment input
            } else {
                Alert.alert("Error", response.data.message);
            }
        } catch (error) {
            console.error("Feedback submission error:", error.response?.data || error);
            Alert.alert("Error", "Failed to submit feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.background}>
            <View style={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Image source={columbaryImage} style={styles.columbary} />
                </View>
                
                <Text style={styles.settingsText}>Help Desk</Text>

                <Card style={styles.card}>
                    <Text style={styles.aboutText}>About</Text>

                    <TouchableOpacity style={styles.button} onPress={toggleFeedback}>
                        <Text style={styles.buttonText}>Give Feedback</Text>
                    </TouchableOpacity>

                    {showFeedback && (
                        <View style={styles.feedbackContainer}>
                            {email ? <></>: null}
                            <TextInput
                                style={styles.input}
                                placeholder="Your Feedback"
                                value={comment}
                                onChangeText={setComment}
                                multiline
                            />
                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Submit Feedback</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity style={styles.button} onPress={toggleFAQs}>
                        <Text style={styles.buttonText}>View FAQs</Text>
                    </TouchableOpacity>

                    {showFAQs && <FAQs />}
                </Card>
            </View>
        </View>
    );
};

const FAQs = () => {
    const faqData = [
        { question: "How do I edit my profile?", answer: "Go to settings and select 'Profile'." },
        { question: "Where can I find my account settings?", answer: "Account settings are located under your Manage account." },
    ];

    return (
        <View style={styles.faqContainer}>
            {faqData.map((item, index) => (
                <TouchableOpacity key={index} style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'grey', // Set the background color to grey
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 12,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 0,
    },
    columbary: {
        width: 100,
        height: 50,
        marginBottom: 0,
    },
    settingsText: {
        fontSize: 30,
        color: '#ffffff',
        textAlign: 'center',
        marginTop: 0,
        fontWeight: 'bold', // Make the "Help Desk" text bold
    },
    aboutText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
        textAlign: 'center',
    },
    card: {
        width: '100%',
        borderRadius: 20,
        padding: 20,
        elevation: 5,
        top: 30,
        borderWidth: 5, // Set border width to 5
        borderColor: '#000', // Border color for the card
    },
    button: {
        height: 50,
        backgroundColor: 'black',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    faqContainer: {
        padding: 20,
    },
    faqItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    faqQuestion: {
        fontWeight: 'bold',
    },
    faqAnswer: {
        color: '#666',
    },
    feedbackContainer: {
        padding: 20,
    },
    input: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});

export default Feedback;
