"use client";

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string>(`session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);

  const sentSound = useRef<HTMLAudioElement | null>(null);
  const receivedSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    sentSound.current = new Audio('/sounds/sent.mp3');
    receivedSound.current = new Audio('/sounds/received.mp3');
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'bot', text: 'Hello! How can I help you today?' }]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { sender: 'user', text: input.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    sentSound.current?.play();

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text, sessionId: sessionId.current }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = { sender: 'bot', text: data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      receivedSound.current?.play();
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { sender: 'bot', text: 'Oops! Something went wrong. Please try again later.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl flex flex-col w-80 h-96 overflow-hidden border border-gray-200">
          <div className="flex justify-between items-center bg-orange-500 text-white p-3 rounded-t-lg shadow-md">
            <h3 className="text-lg font-semibold">Sunshine Chat</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-100 focus:outline-none transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block p-3 rounded-xl ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
                >
                  {(() => {
                    const linkRegex = /(\/collections\/[a-zA-Z0-9-]+|\/sale|\/new-arrivals)/;
                    const match = msg.text.match(linkRegex);

                    if (match) {
                      const url = match[0];
                      const parts = msg.text.split(url);
                      return (
                        <>
                          {parts[0]}
                          <a href={url} className="text-orange-800 underline hover:text-orange-600">
                            {url}
                          </a>
                          {parts[1]}
                        </>
                      );
                    } else {
                      return msg.text;
                    }
                  })()}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-200 flex items-center bg-gray-50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
