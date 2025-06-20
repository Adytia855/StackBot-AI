import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatList from '../components/ChatList';
import ChatInput from '../components/ChatInput';

/**
 * @file ChatPage.jsx
 * @description This component renders the main chat interface, including a sidebar for
 * conversations, a chat list for messages, and an input area for sending messages.
 * It handles fetching, creating, and deleting conversations and messages by
 * interacting with a backend API.
 */

/**
 * ChatPage component.
 * Manages the state and logic for the chat application interface.
 * @returns {JSX.Element} The ChatPage component.
 */
function ChatPage() {
  /** @state {Array<object>} conversations - List of all conversations. */
  const [conversations, setConversations] = useState([]);
  /** @state {string|null} selectedConv - ID of the currently selected conversation. */
  const [selectedConv, setSelectedConv] = useState(null);
  /** @state {Array<object>} messages - List of messages for the selected conversation. */
  const [messages, setMessages] = useState([]);
  /** @state {string} message - Current message text in the input field. */
  const [message, setMessage] = useState('');
  /** @state {boolean} loading - Indicates if an API request is in progress. */
  const [loading, setLoading] = useState(false);
  /** @state {string} error - Error message to display to the user. */
  const [error, setError] = useState('');
  /** @state {string} newConvName - Name for a new conversation being created. */
  const [newConvName, setNewConvName] = useState('');
  /** @state {boolean} sidebarOpen - Controls the visibility of the sidebar. */
  const [sidebarOpen, setSidebarOpen] = useState((false));

  /** @const {string} BACKEND - The base URL for the backend API. */
  const BACKEND = import.meta.env.VITE_BACKEND_URL ;

  /**
   * Fetches all conversations from the backend.
   * Updates the `conversations` state and selects the first conversation
   * if none is currently selected.
   * @async
   */
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/conversations`);
      // Ensure the response is JSON before parsing
      if (!res.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Received non-JSON response from server for conversations');
      }
      const data = await res.json();
      setConversations(data);
      if (data.length && !selectedConv) setSelectedConv(data[0]._id);
    } catch (err) {
      console.error(err);
      setConversations([]);
    }
  };

  /**
   * Fetches messages for a specific conversation ID.
   * Updates the `messages` state.
   * @async
   * @param {string} convId - The ID of the conversation to fetch messages for.
   */
  const fetchMessages = async (convId) => {
    if (!convId) return setMessages([]);
    try {
      const res = await fetch(`${BACKEND}/api/conversations/${convId}/messages`);
      if (!res.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Received non-JSON response from server for messages');
      }
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  // Effect to fetch conversations on component mount.
  useEffect(() => {
    fetchConversations();
  }, []);

  // Effect to fetch messages when the selected conversation changes.
  useEffect(() => {
    fetchMessages(selectedConv);
  }, [selectedConv]);


  /**
   * Safely parses a Fetch API Response object as JSON.
   * If the content type is not 'application/json', it throws an error.
   * @async
   * @param {Response} res - The Fetch API Response object.
   * @returns {Promise<object>} A promise that resolves to the parsed JSON object.
   * @throws {Error} If the response is not JSON or if parsing fails.
   */
  const parseJsonSafe = async (res) => {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();
    const text = await res.text();
    throw new Error(`Server returned non‑JSON: ${text.slice(0, 100)}…`);
  };
  
  /**
   * Creates a new conversation with an automatically generated name.
   * The name is based on the first message and the current timestamp.
   * @async
   * @param {string} firstMessage - The first message of the new conversation.
   * @returns {Promise<string>} The ID of the newly created conversation.
   * @throws {Error} If the API request fails or returns a non-ok status.
   */
  const createNewConversation = async (firstMessage) => {
    // Generate an automatic name for the conversation
    const shortMsg = firstMessage.replace(/\n/g, ' ').slice(0, 20); 
    const now = new Date();
    const tanggal = now.toLocaleDateString('id-ID');           
    const jam     = String(now.getHours()).padStart(2, '0');    
    const menit   = String(now.getMinutes()).padStart(2, '0');  
    const waktu   = `${tanggal} ${jam}:${menit}`;
    const autoName = `${shortMsg} - ${waktu}`.trim();

    // API call to create the conversation
    const res = await fetch(`${BACKEND}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: autoName })
    });
    if (!res.ok) throw new Error(`Status ${res.status} saat membuat percakapan`);
    const conv = await res.json();

    // Update state
    setSelectedConv(conv._id);
    // Add to conversations list if not already present (prevents duplicates on rapid actions)
    setConversations((prev) => {
      if (prev.some((c) => c._id === conv._id)) return prev;
      return [conv, ...prev];
    });
    return conv._id;
  };

  /**
   * Handles the creation of a new conversation with a user-provided name.
   * Makes an API call and updates the UI accordingly.
   * @async
   * @throws {Error} If the API request fails or returns a non-ok status.
   */
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
      
      // Update UI on success
      setNewConvName('');
      fetchConversations();
      setSidebarOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to add conversation');
    }
  };

  /**
   * Handles the deletion of a conversation.
   * Makes an API call and updates the UI.
   * @async
   * @param {string} id - The ID of the conversation to delete.
   */
  const handleDeleteConversation = async (id) => {
    setError('');
    try {
      await fetch(`${BACKEND}/api/conversations/${id}`, { method: 'DELETE' });
      // If the deleted conversation was selected, deselect it
      if (selectedConv === id) setSelectedConv(null);
      fetchConversations();
      // Clear messages as the conversation is gone
      setMessages([]);
    } catch (err) {
      console.error(err);
      setError('Failed to delete conversation');
    }
  };

  /**
   * Handles sending a new message.
   * If no conversation is selected, it creates a new one first.
   * @async
   */
  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError('');

    try {
      let convId = selectedConv;
      // If no conversation is selected, create a new one
      if (!convId) convId = await createNewConversation(message);

      // API call to send the message
      const res = await fetch(`${BACKEND}/api/conversations/${convId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (!res.ok) throw new Error('Failed to send message');

      // Update UI on success
      setMessage('');
      fetchMessages(convId);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send message');
    }

    setLoading(false);
  };

  /**
   * Handles the deletion of a specific message within the selected conversation.
   * @async
   * @param {string} msgId - The ID of the message to delete.
   */
  const handleDeleteMessage = async (msgId) => {
    if (!selectedConv) return;
    setError('');
    try {
      // API call to delete the message
      await fetch(`${BACKEND}/api/conversations/${selectedConv}/messages/${msgId}`, { method: 'DELETE' });
      fetchMessages(selectedConv);
      // Update UI by re-fetching messages
    } catch (err) {
      console.error(err);
      setError('Failed to delete message');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f8fc', position: 'relative' }}>
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

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{ position: 'absolute', left: 12, top: 18, zIndex: 10, background: '#EBB423', color: '#fff', border: 'none', borderRadius: 8, width: 40, height: 40, fontSize: 24, boxShadow: '0 2px 8px rgba(235,180,35,0.08)' }}
          title="Open sidebar"
        >
          ☰
        </button>
      )}

      <main
        className="app-main"
        style={{
          flex: 1, // Allow main content to take available space
          overflowX: 'hidden', // Prevent horizontal scroll within main
          marginLeft: (sidebarOpen && window.innerWidth <= 900) ? '320px' : '0', // Add margin when fixed sidebar is open on small screens
          padding: '60px 24px 0 24px'
        }}>
        <div className="main-header">Type Your Message Below!</div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: 12, borderRadius: 8, margin: '16px auto', maxWidth: 400, border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <ChatList messages={messages} handleDeleteMessage={handleDeleteMessage} />

        <ChatInput
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default ChatPage;
