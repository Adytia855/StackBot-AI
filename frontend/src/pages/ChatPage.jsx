import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatList from '../components/ChatList';
import ChatInput from '../components/ChatInput';

function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newConvName, setNewConvName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);

  const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/conversations`);
      const data = await res.json();
      setConversations(data);
      if (data.length > 0 && !selectedConv) setSelectedConv(data[0]._id);
    } catch {
      setConversations([]);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (convId) => {
    if (!convId) return setMessages([]);
    try {
      const res = await fetch(`${BACKEND}/api/conversations/${convId}/messages`);
      const data = await res.json();
      setMessages(data);
    } catch {
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages(selectedConv);
    // eslint-disable-next-line
  }, [selectedConv]);

  // Add new conversation
  const handleAddConversation = async () => {
    if (!newConvName.trim()) return;
    setError('');
    try {
      const res = await fetch(`${BACKEND}/api/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newConvName })
      });
      if (!res.ok) throw new Error('Failed to add conversation');
      setNewConvName('');
      fetchConversations();
    } catch {
      setError('Failed to add conversation');
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (id) => {
    setError('');
    try {
      await fetch(`${BACKEND}/api/conversations/${id}`, { method: 'DELETE' });
      if (selectedConv === id) setSelectedConv(null);
      fetchConversations();
      setMessages([]);
    } catch {
      setError('Failed to delete conversation');
    }
  };

  // Send message in selected conversation
  const handleSend = async () => {
    if (!selectedConv || !message.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND}/api/conversations/${selectedConv}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (!res.ok) throw new Error('Failed to send message');
      setMessage('');
      fetchMessages(selectedConv);
    } catch {
      setError('Failed to send message');
    }
    setLoading(false);
  };

  // Delete message in selected conversation
  const handleDeleteMessage = async (msgId) => {
    if (!selectedConv) return;
    setError('');
    try {
      await fetch(`${BACKEND}/api/conversations/${selectedConv}/messages/${msgId}`, { method: 'DELETE' });
      fetchMessages(selectedConv);
    } catch {
      setError('Failed to delete message');
    }
  };

  return (
    <div style={{display: 'flex', minHeight: '100vh', background: '#f6f8fc', position: 'relative'}}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        conversations={conversations}
        selectedConv={selectedConv}
        setSelectedConv={setSelectedConv}
        newConvName={newConvName}
        setNewConvName={setNewConvName}
        handleAddConversation={handleAddConversation}
        handleDeleteConversation={handleDeleteConversation}
      />
      {/* Hamburger button for open sidebar (all screen size) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{position: 'absolute', left: 12, top: 18, zIndex: 10, background: '#EBB423', color: '#fff', border: 'none', borderRadius: 8, width: 40, height: 40, fontSize: 24, boxShadow: '0 2px 8px rgba(235,180,35,0.08)'}}
          title="Buka sidebar"
        >
          ☰
        </button>
      )}
      <main className="app-main" style={{width: '100%', marginLeft: (!sidebarOpen && window.innerWidth <= 900) ? 0 : undefined, padding: '0 24px'}}>
        <div className="main-header">Type Your Message Bellow!</div>
        {error && (
          <div style={{background: '#fee2e2', color: '#991b1b', padding: 12, borderRadius: 8, margin: '16px auto', maxWidth: 400, border: '1px solid #fecaca'}}>
            {error}
          </div>
        )}
        <ChatList messages={messages} handleDeleteMessage={handleDeleteMessage} />
        <ChatInput
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          selectedConv={selectedConv}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default ChatPage;
