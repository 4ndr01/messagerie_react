import react, {useRef} from "react";
import {useEffect, useState} from "react";
import socketIOClient from "socket.io-client";


const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event
const SOCKET_SERVER_URL = "http://localhost:3000";

const useChat = (roomId) => {
    const [messages, setMessages] = useState([]); // Sent and received messages
    const socketRef = useRef();


    useEffect(() => {
        socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
            query: {roomId}
        });

        socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
            const incomingMessage={
                ...message,
                ownedByCurrentUser: message.senderId === socketRef.current.id
            }
            setMessages((messages) => [...messages, incomingMessage]);
        })
        return () => {
            socketRef.current.disconnect();
        }
    }, [roomId]);

    const sendMessage = (messageBody) => {
        socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
            body: messageBody,
            senderId: socketRef.current.id
        });
    }

    return {messages, sendMessage};




}

export default useChat;