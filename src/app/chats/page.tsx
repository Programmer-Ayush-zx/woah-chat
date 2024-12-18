"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Image from "next/image";
// Initialize Firebase (ensure you replace with your actual config)
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyAVI0slRkZY_Uqy9XO5se_x-C7n-A2p2zE",
    authDomain: "messenger-app-32b09.firebaseapp.com",
    projectId: "messenger-app-32b09",
  });
} else {
  firebase.app();
}

const db = firebase.firestore();

type Message = {
  text: string;
  createdAt: firebase.firestore.Timestamp | null;
  userName: string;
  replyTo?: string;
};

const Chat: React.FC = () => {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract username from query parameters using useSearchParams
  const username = searchParams.get("username") || "";

  useEffect(() => {
    const unsubscribe = db
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot(
        (snapshot) => {
          const messagesData = snapshot.docs.map((doc) => doc.data() as Message);
          setMessages(messagesData);
        },
        (error) => {
          console.error("Error fetching messages:", error);
          alert("Failed to fetch messages. Please check your Firebase setup.");
        }
      );

    return () => unsubscribe();
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    try {
      await db.collection("messages").add({
        text: newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userName: username,
        replyTo: replyMessage ? replyMessage.text : null,
      });
      setNewMessage("");
      setReplyMessage(null);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleDoubleClick = (message: Message) => {
    setReplyMessage(message);
  };

  const formatTimestamp = (timestamp: firebase.firestore.Timestamp | null) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-900">
        <div className="titlebar flex flex-row justify-center items-center">
            <p className="text-3xl font-bold mb-4 m-4">WOAH Chats</p>
            <Image src="/spikes.png" alt="Email Icon" className="h-12 w-12" width={30} height={30} />
        </div>
      
      <div className="overflow-y-auto flex-1 bg-neutral-900 p-4 rounded-lg shadow-inner">
        <ul className="space-y-2">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`flex ${
                message.userName === username ? "justify-end" : "justify-start"
              }`}
              onDoubleClick={() => handleDoubleClick(message)}
            >
              <div
                className={`${
                  message.userName === username
                    ? "bg-green-500 text-neutral-100 border-green-800 border-r-4 rounded-l-lg"
                    : "bg-slate-300 text-neutral-900 border-slate-600 rounded-r-lg border-l-4"
                } p-2  max-w-xs`}
              >
                {message.replyTo && (
                  <div className="bg-black bg-opacity-45 rounded-full p-2 mb-1">
                    <span className="italic">{message.replyTo}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="block font-bold">{message.userName}</span>
                  <span className="timestamp text-black text-sm font-mono font-extralight">
                    {formatTimestamp(message.createdAt)}
                  </span>
                </div>
                <span>{message.text}</span>
              </div>
            </li>
          ))}
          <div ref={messagesEndRef}></div>
        </ul>
      </div>
      <div className="flex my-6 mx-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border-gray-600 border-b-4 text-black rounded-l-2xl"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="border-emerald-950 border-b-4 bg-emerald-500 active:bg-emerald-700 active:border-b-2 text-white font-bold py-2 px-4 rounded-r-2xl"
        >
          Send
        </button>
      </div>
      {replyMessage && (
        <div className="mx-4 mb-2 p-2 bg-neutral-900 rounded text-white">
          Replying to: <span className="font-bold">{replyMessage.text}</span>
          <button onClick={() => setReplyMessage(null)} className="ml-4 text-red-500">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const ChatPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chat />
    </Suspense>
  );
};

export default ChatPage;
