import { AnimatePresence, motion } from 'framer-motion';

/**
 * Sidebar component for navigating and managing conversations.
 * Displays a list of conversations, allows adding new ones, and deleting existing ones.
 * It also includes a toggle button to open/close the sidebar.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.sidebarOpen - State indicating if the sidebar is currently open.
 * @param {function} props.setSidebarOpen - Function to set the sidebar open state.
 * @param {Array<object>} props.conversations - List of conversation objects to display. Each object should have an `_id` and `name`.
 * @param {string | null} props.selectedConv - The ID of the currently selected conversation.
 * @param {function} props.setSelectedConv - Function to set the selected conversation ID.
 * @param {string} props.newConvName - The current value of the input field for a new conversation name.
 * @param {function} props.setNewConvName - Function to set the new conversation name input value.
 * @param {function} props.handleAddConversation - Function to call when adding a new conversation.
 * @param {function} props.handleDeleteConversation - Function to call when deleting a conversation. Takes the conversation ID as an argument.
 * @returns {JSX.Element} The Sidebar component.
 */
function Sidebar({ sidebarOpen, setSidebarOpen, conversations, selectedConv, setSelectedConv, newConvName, setNewConvName, handleAddConversation, handleDeleteConversation }) {

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside className="app-sidebar" initial={{ x: -320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -320, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} 
        style={{ display: 'flex', position: 'fixed', zIndex: 100, left: 0, top: 0, height: '100vh', minWidth: 270, maxWidth: 320, }} >
          <button onClick={() => setSidebarOpen(false)} style={{
            position: 'absolute', 
            right: -18, 
            top: '50%', 
            transform: 'translateY(-50%)', 
            zIndex: 30, 
            background: '#EBB423', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '50%', 
            width: 36, 
            height: 36, 
            fontSize: 20, 
            boxShadow: '0 2px 8px rgba(235,180,35,0.10)'}} title="Close sidebar" >
            <span style={{display: 'inline-block', transform: 'rotate(180deg)'}}>&#10094;</span>
          </button>
          <div className="sidebar-header">
            <img src="stackbot.svg" className='sidebar-logo' alt="StackBot Logo" />
            <span className="sidebar-title">StackBot AI+</span>
          </div>
          <form onSubmit={e => { e.preventDefault(); handleAddConversation(); }} style={{margin: '20px 24px 12px 24px'}}>
            <div className="input-group" style={{height: 48}}>
              <input className="main-input" style={{height: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0}} type="text" value={newConvName} onChange={e => setNewConvName(e.target.value)} placeholder="New chat name" />
              <button className="sidebar-newchat" type="submit" aria-label="Add new chat"
                style={{ height: '100%', minHeight: 0, width: 60, minWidth: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 30, borderBottomRightRadius: 30, background: 'linear-gradient(135deg, #EBB423 60%, #f59e42 100%)', boxShadow: '0 2px 8px rgba(235,180,35,0.10)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s, box-shadow 0.2s', cursor: 'pointer', marginLeft: 0 }}
                onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(135deg, #f59e42 80%, #EBB423 100%)'} onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(135deg, #EBB423 60%, #f59e42 100%)'} >
                <span style={{fontSize: 24, color: '#fff', fontWeight: 800, lineHeight: 1, marginTop: -2}}>+</span>
              </button>
            </div>
          </form>
          <div className="sidebar-convs">
            <AnimatePresence>
              {conversations.length === 0 ? (
                <motion.div style={{ color: '#94a3b8', textAlign: 'center', marginTop: 32 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  No conversations
                </motion.div>
              ) : (
                conversations.map((conv) => (
                  <motion.div
                    key={conv._id}
                    className={`sidebar-conv-item${selectedConv === conv._id ? ' selected' : ''}`}
                    onClick={() => setSelectedConv(conv._id)}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    layout
                    transition={{ duration: 0.18 }}
                  >
                    <span title={conv.name} style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.name}</span>
                    <button
                      onClick={e => { e.stopPropagation(); handleDeleteConversation(conv._id); }}
                      style={{ marginLeft: 8, color: '#ef4444', background: 'none', border: 'none', fontSize: 14, cursor: 'pointer' }}
                      title="Delete conversation"
                    >
                      ×
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
          <div className="sidebar-bottom">
            <div style={{ fontSize: '0.93rem' }}>👤 Adytia Griansyah</div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default Sidebar;
