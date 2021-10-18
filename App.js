//@refresh reset
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCoBueRgq4eORgTFtUYb7jOyz6i6SQVe6Y",
  authDomain: "chatapp-c9d7f.firebaseapp.com",
  projectId: "chatapp-c9d7f",
  storageBucket: "chatapp-c9d7f.appspot.com",
  messagingSenderId: "880897446299",
  appId: "1:880897446299:web:4ed7e7a4df2e371bb8113e"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const chatRef = db.collection('chats');

export default function App() {

  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('Baruh');

  useEffect(() => {
    const unsubscribe = chatRef.onSnapshot((querySnapshot) => {
      const messageFirestore = querySnapshot
      .docChanges()
      .filter(({ type }) => type === 'added')
      .map(({ doc }) => {
        const message = doc.data();
        return { ...message, createdAt: message.createdAt.toDate() }
      })
      .sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())
      appendMessages(messageFirestore);
    });
    return () => unsubscribe();
  },[]);

  const appendMessages = useCallback((messageFirestore) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messageFirestore))
  },[messages]);

  const sendMessage = async (messages) => {
    const newMessage = messages.map((m) => chatRef.add(m));
    await Promise.all(newMessage);
  }

  return (
    <GiftedChat 
      messages={messages}
      user={user}
      onSend={sendMessage}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});