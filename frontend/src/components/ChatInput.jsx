import { motion } from 'framer-motion';

/**
 * ChatInput component for users to type and send messages.
 * It includes an input field and a send button, with loading state handling.
 *
 * @param {object} props - The component props.
 * @param {string} props.message - The current value of the message input field.
 * @param {function} props.setMessage - Function to set the message input field's value.
 * @param {function} props.handleSend - Function to call when the send button is clicked or form is submitted.
 * @param {boolean} props.loading - State indicating if a message is currently being sent (disables input and button).
 * @returns {JSX.Element} The ChatInput component.
 */
function ChatInput({ message, setMessage, handleSend, loading }) {
  return (
    <form className="main-input-area"
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
    >
      <input className="main-input" type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." disabled={loading} autoFocus />
      <motion.button className="main-send-btn" type="submit" disabled={loading || !message.trim()} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} >
        {loading ? 'Sending...' : 'Send'}
      </motion.button>
    </form>
  );
}

export default ChatInput;