import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

function ChatList({ messages, handleDeleteMessage }) {
  return (
    <div className="main-chat-list" style={{maxWidth: 1200, margin: '0 auto'}}>
      <AnimatePresence initial={false}>
        {messages.length === 0 ? (
          <motion.div style={{color: '#94a3b8', textAlign: 'center', marginTop: 32}} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}> No messages </motion.div>
        ) : (
          messages.map((item, idx) => {
            console.log('--- BOT MSG ---');
            console.log(item.bot);
            return (

              <motion.div key={item._id || idx} style={{position: 'relative'}} className="chat-anim-wrapper" initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -30}} transition={{duration: 0.22}} layout>
              <motion.div className="chat-bubble user" layout initial={false} animate={{scale: 1}} whileHover={{scale: 1.02}}>
                <span className="bubble-label-user">You:</span> {item.user}
              </motion.div>
              <motion.div className="chat-bubble bot" layout initial={false} animate={{scale: 1}} whileHover={{scale: 1.01}} style={{ whiteSpace: 'pre-wrap' }}>
                <span className="bubble-label-bot">StackBot:</span> <ReactMarkdown>{item.bot}</ReactMarkdown>
              </motion.div>
            </motion.div>
            )
})
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatList;
