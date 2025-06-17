// =========================
// ChatPage.jsx (refactor)
// =========================
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
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 900);

  const BACKEND = import.meta.env.VITE_BACKEND_URL ;

  /** Fetch daftar percakapan */
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/conversations`);
      const data = await res.json();
      setConversations(data);
      if (data.length && !selectedConv) setSelectedConv(data[0]._id);
    } catch (err) {
      console.error(err);
      setConversations([]);
    }
  };

  /** Fetch pesan sebuah percakapan */
  const fetchMessages = async (convId) => {
    if (!convId) return setMessages([]);
    try {
      const res = await fetch(`${BACKEND}/api/conversations/${convId}/messages`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  /* Initial load */
  useEffect(() => {
    fetchConversations();
  }, []);

  /* Load pesan ketika conversation berganti */
  useEffect(() => {
    fetchMessages(selectedConv);
  }, [selectedConv]);


  const parseJsonSafe = async (res) => {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();
    const text = await res.text();
    throw new Error(`Server returned non‑JSON: ${text.slice(0, 100)}…`);
  };

  /** Buat percakapan baru otomatis ketika user kirim pesan pertama */
  const createNewConversation = async (firstMessage) => {
    const shortMsg = firstMessage.replace(/\n/g, ' ').slice(0, 20); // ambil 20 karakter pertama, hapus newline
    const now = new Date();
    const tanggal = now.toLocaleDateString('id-ID');            // 17/06/2025
    const jam     = String(now.getHours()).padStart(2, '0');    // 15
    const menit   = String(now.getMinutes()).padStart(2, '0');  // 42
    const waktu   = `${tanggal} ${jam}:${menit}`;
    const autoName = `${shortMsg} - ${waktu}`.trim();
    const res = await fetch(`${BACKEND}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: autoName })
    });
    if (!res.ok) throw new Error(`Status ${res.status} saat membuat percakapan`);
    const conv = await res.json();
    setSelectedConv(conv._id);
    setConversations((prev) => {
      if (prev.some((c) => c._id === conv._id)) return prev;
      return [conv, ...prev];
    });
    return conv._id;
  };

  /** Tambah percakapan via sidebar */
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
      setSidebarOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to add conversation');
    }
  };

  /** Hapus percakapan */
  const handleDeleteConversation = async (id) => {
    setError('');
    try {
      await fetch(`${BACKEND}/api/conversations/${id}`, { method: 'DELETE' });
      if (selectedConv === id) setSelectedConv(null);
      fetchConversations();
      setMessages([]);
    } catch (err) {
      console.error(err);
      setError('Failed to delete conversation');
    }
  };

  /** Kirim pesan */
  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError('');

    try {
      let convId = selectedConv;
      if (!convId) convId = await createNewConversation(message);

      const res = await fetch(`${BACKEND}/api/conversations/${convId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (!res.ok) throw new Error('Gagal mengirim pesan');

      setMessage('');
      fetchMessages(convId);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send message');
    }

    setLoading(false);
  };

  /** Hapus pesan */
  const handleDeleteMessage = async (msgId) => {
    if (!selectedConv) return;
    setError('');
    try {
      await fetch(`${BACKEND}/api/conversations/${selectedConv}/messages/${msgId}`, { method: 'DELETE' });
      fetchMessages(selectedConv);
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

      {/** Tombol hamburger global */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{ position: 'absolute', left: 12, top: 18, zIndex: 10, background: '#EBB423', color: '#fff', border: 'none', borderRadius: 8, width: 40, height: 40, fontSize: 24, boxShadow: '0 2px 8px rgba(235,180,35,0.08)' }}
          title="Buka sidebar"
        >
          ☰
        </button>
      )}

      <main className="app-main" style={{ width: '100%', marginLeft: (!sidebarOpen && window.innerWidth <= 900) ? 0 : undefined, padding: '0 24px' }}>
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
