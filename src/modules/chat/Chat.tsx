import React, { useEffect, useState } from "react";
import { useRef } from "react";
import SocketIOClient from "socket.io-client";
import colors from "../../shared/constants/colors.const";
import { KeyboardKeys } from "../../shared/enums/keyboard-keys.enum";
import * as localStorage from "../../shared/helpers/local-storage.helper";
import styled from "../../shared/libs/styled-components.lib";
import ChatMessage from "./ChatMessage";
import { IMessage } from "./message.interface";
/**
 * Local storage values
 */
const userName = localStorage.getUserName();
const userId = localStorage.resetUserId();

/**
 * Styles
 */
const MessagesWrapper = styled("div")({
  backgroundColor: colors.common.white,
  color: "black",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  height: "500px",
  overflowY: "scroll",
});
const Wrapper = styled("div")({});

/**
 * Sockets
 */
enum SocketMessage {
  SendMessage = "send-message",
  MessageSent = "message-sent",
  JoinRoom = "join-room",
  RoomJoined = "room-joined",
  LeaveRoom = "leave-room",
  RoomLeft = "room-left",
}

enum SocketRoom {
  None = "none",
  Memes = "memes",
  Frontend = "frontend",
  Backend = "backend",
}

const socketIOClient = SocketIOClient("http://localhost:3000/chat");

const Chat = () => {
  /**
   * Handle messages
   */
  const [messages, setMessages] = useState<IMessage[]>([]);
  useEffect(() => {
    socketIOClient.on(SocketMessage.MessageSent, (message: IMessage) => {
      console.log(message);
      setMessages((state) => [...state, message]);
      scrollMessagesWrapperToBottom();
    });
    return () => {
      socketIOClient.off(SocketMessage.MessageSent);
    };
  }, []);

  /**
   * Handle sending messages
   */
  const [input, setInput] = useState<string>("");
  const handleSendMessage = () => {
    const body: IMessage = {
      userId: userId,
      userName: userName,
      time: Date.now(),
      message: input,
      room: room,
    };
    socketIOClient.emit(SocketMessage.SendMessage, body);
    setInput("");
  };

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (key: string) => {
    if (key === KeyboardKeys.Enter) {
      handleSendMessage();
    }
  };

  /**
   * Room selection
   */
  const [room, setRoom] = useState<SocketRoom>(SocketRoom.None);
  useEffect(() => {
    socketIOClient.on(SocketMessage.RoomJoined, (room: SocketRoom) => {
      setRoom(room);
      scrollMessagesWrapperToBottom();
    });
    return () => {
      socketIOClient.off(SocketMessage.RoomJoined);
    };
  }, []);
  const handleRoomSelect = (newRoom: SocketRoom) => {
    if (room !== SocketRoom.None)
      socketIOClient.emit(SocketMessage.LeaveRoom, room);
    socketIOClient.emit(SocketMessage.JoinRoom, newRoom);
  };

  /**
   * Messages wrapper
   */
  const messagesWrapperRef = useRef<HTMLDivElement>(null);
  const scrollMessagesWrapperToBottom = () => {
    if (messagesWrapperRef.current) {
      const element = messagesWrapperRef.current;
      element.scrollTop = element.scrollHeight;
    }
  };

  return (
    <Wrapper onKeyDown={(e) => handleKeyPress(e.key)}>
      <button onClick={() => handleSendMessage()}>Send Message</button>
      <div>User id: {userId}</div>
      <div>User name: {userName}</div>
      <div>Room: {room}</div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <div>
        {Object.values(SocketRoom).map((socketRoom: SocketRoom) => (
          <button key={socketRoom} onClick={() => handleRoomSelect(socketRoom)}>
            {socketRoom}
          </button>
        ))}
      </div>
      <MessagesWrapper ref={messagesWrapperRef}>
        {messages
          .filter((message) => message.room === room)
          .map((message, i) => (
            <ChatMessage
              key={i}
              message={message}
              isFromMe={message.userId === userId}
            />
          ))}
      </MessagesWrapper>
    </Wrapper>
  );
};

export default Chat;
