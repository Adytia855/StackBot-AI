import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

/**
 * ChatList component for displaying a list of chat messages.
 * It renders messages from both the user and the bot, with animations.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.messages - An array of message objects to display. Each object should have an `_id` (or use index as fallback key), `user` (string, user's message), and `bot` (string, bot's response, supports Markdown).
 * @param {function} [props.handleDeleteMessage] - Optional function to handle message deletion. Takes the message ID as an argument. (Currently not used in the component's rendering logic but defined as a prop).
 * @returns {JSX.Element} The ChatList component.
 */
function ChatList({ messages, handleDeleteMessage }) {
  return (
    <div className="main-chat-list" style={{maxWidth: 1200, margin: '0 auto'}}>
      <AnimatePresence initial={false}>
        {messages.length === 0 ? (
          <motion.div style={{color: '#94a3b8', textAlign: 'center', marginTop: 32}} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}> No messages </motion.div>
        ) : (
          messages.map((item, idx) => (
              <motion.div key={item._id || idx} style={{position: 'relative'}} className="chat-anim-wrapper" initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -30}} transition={{duration: 0.22}} layout>
              <motion.div className="chat-bubble user" layout initial={false} animate={{scale: 1}} whileHover={{scale: 1.02}}>
                <span className="bubble-label-user">You:</span> {item.user}
              </motion.div>
              <motion.div className="chat-bubble bot" layout initial={false} animate={{scale: 1}} whileHover={{scale: 1.01}} style={{ whiteSpace: 'pre-wrap' }}>
                <span className="bubble-label-bot">StackBot:</span> <ReactMarkdown>{item.bot}</ReactMarkdown>
              </motion.div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatList;
