import chatStore from "../store/chatStore";
import { formatMessageTime } from "../lib/utils";
import ChatSkeleton from "./skeletons/ChatSkeleton";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { authStore } from "../store/authStore";

function ChatContainer() {
  const {
    chats,
    getChats,
    selectedUser,
    isLoading,
    subscribeToMessage,
    unsubscribeToMessage,
  } = chatStore();
  const { authUser } = authStore();
  const chatEndRef = useRef(null);


  useEffect(() => {
    if (chatEndRef.current && chats) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);


  useEffect(() => {
    getChats(selectedUser._id);
    subscribeToMessage();

    return () => unsubscribeToMessage();
  }, [selectedUser._id, getChats, subscribeToMessage, unsubscribeToMessage]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <ChatSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chats?.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={chatEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
