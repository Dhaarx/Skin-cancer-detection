import { StyleSheet, Text, View, Button, TextInput, Alert, ScrollView } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';

const Busstand = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const scrollViewRef = useRef();

  useEffect(() => {
    if (chatHistory.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    try {
      const res = await axios.post('http://192.168.181.77:5000/chat', { message: message });
      const updatedHistory = [
        ...chatHistory,
        { text: message, sender: 'user' },
        { text: res.data.response, sender: 'bot' }
      ];
      setChatHistory(updatedHistory);
    } catch (error) {
      console.error(error);
      const errorMessage = 'Error communicating with the server.';
      setChatHistory([...chatHistory, { text: message, sender: 'user' }, { text: errorMessage, sender: 'bot' }]);
    }
    setMessage(''); // Clear input after sending
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContainer}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        {chatHistory.map((item, index) => (
          <View key={index} style={[styles.messageBubble, item.sender === 'user' ? styles.userMessageBubble : styles.botMessageBubble]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message"
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  userMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#02DBC4',
  },
  botMessageBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e6e6e6',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 10,
  },

});

export default Busstand;
