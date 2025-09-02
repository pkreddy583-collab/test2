import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon, PaperAirplaneIcon, XMarkIcon } from './Icons';
import { RUNBOOKS } from '../data/runbookData';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen) {
        setMessages([
            { sender: 'bot', text: "Hello! I'm the Smart Assistant. Ask me about a ticket (e.g., 'status INC001005') or for available runbooks." }
        ]);
    }
  }, [isOpen]);
  
  const getBotResponse = (userInput: string): string => {
      const lowerInput = userInput.toLowerCase();
      
      const ticketIdMatch = lowerInput.match(/inc\d+/);
      if (ticketIdMatch) {
          const ticketId = ticketIdMatch[0].toUpperCase();
          return `Fetching information for ${ticketId}... In a real scenario, I would show you the current status, assignee, and recent history. For now, you can click on any ticket card to see its full details.`;
      }

      if (lowerInput.includes('runbook')) {
          const runbookList = RUNBOOKS.map(r => `- ${r.title}`).join('\n');
          return `Of course! Here are the available runbooks:\n${runbookList}\n\nI can provide details on any of them if you'd like.`;
      }
      
      if (lowerInput.includes('deploy')) {
          return "You can view the most recent deployments in the 'Recent Deployments' module on the Operations dashboard. It shows the service, version, and time of each deployment to help correlate incidents with changes.";
      }
      
      return "I'm still in training. You can ask me about a ticket by its ID (e.g., 'status INC001001'), ask for 'runbooks', or ask about recent 'deployments'.";
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessages: Message[] = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    const userInput = input;
    setInput('');

    setTimeout(() => {
      const botResponse = getBotResponse(userInput);
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-xl shadow-2xl flex flex-col z-50 animate-fade-in">
          {/* Header */}
          <header className="bg-brand-accent text-white p-4 rounded-t-xl flex justify-between items-center">
            <h3 className="font-bold">Smart Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/20">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </header>
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-brand-accent text-white rounded-br-none'
                        : 'bg-gray-200 text-brand-text rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center bg-gray-100 rounded-full px-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about a ticket..."
                className="flex-1 bg-transparent p-2 text-sm text-brand-text placeholder-gray-500 focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="p-2 rounded-full bg-brand-accent text-white hover:bg-opacity-90 transition-colors disabled:opacity-50"
                disabled={!input.trim()}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-brand-accent text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-110"
      >
        {isOpen ? <XMarkIcon className="w-7 h-7" /> : <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7" />}
      </button>
    </>
  );
};

export default Chatbot;