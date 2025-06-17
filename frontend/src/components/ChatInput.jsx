// =========================
// ChatInput.jsx (refactor)
// =========================
import { motion } from 'framer-motion';

function ChatInput({ message, setMessage, handleSend, loading }) {
  return (
    <form
      className="main-input-area"
      style={{ maxWidth: 800, margin: '0 auto' }}
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
    >
      <input
        className="main-input"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={loading}
        autoFocus
      />
      <motion.button
        className="main-send-btn"
        type="submit"
        disabled={loading || !message.trim()}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {loading ? 'Sending...' : 'Send'}
      </motion.button>
    </form>
  );
}

export default ChatInput;