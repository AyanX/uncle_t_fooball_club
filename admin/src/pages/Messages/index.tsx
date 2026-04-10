// pages/Messages/index.tsx — Contact messages with Android-style split view
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Mail, MailOpen, Search, Clock, MapPin, Phone, User, MessageSquare } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import { ConfirmDialog } from '@/components/ui';
import styles from './Messages.module.scss';

export interface Message {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  subject?: string;
  message: string;
  location?: string;
  isRead: boolean;
  createdAt?: string;
}

const timeAgo = (date?: string) => {
  if (!date) return '';
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const formatDate = (date?: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const Messages: React.FC = () => {
  const { success, error } = useToast();
  const [messages, setMessages]   = useState<Message[]>([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState<Message | null>(null);
  const [search, setSearch]       = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [deleting, setDeleting]   = useState(false);

  // Mobile: whether we're showing detail pane
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    api.get.messages()
      .then(msgs => { setMessages(msgs); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const selectMessage = async (msg: Message) => {
    setSelected(msg);
    setShowDetail(true);
    // Mark as read if not already
    if (!msg.isRead) {
      try {
        await api.put.messageRead(msg.id);
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
      } catch { /* silent fail */ }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleting(true);
    setDeleteTarget(null);
    try {
      const res = await api.delete.message(target.id);
      setMessages(prev => prev.filter(m => m.id !== target.id));
      if (selected?.id === target.id) { setSelected(null); setShowDetail(false); }
      success((res as any)?.data?.message || 'Message deleted');
    } catch { error('Failed to delete message'); }
    finally { setDeleting(false); }
  };

  const filtered = messages.filter(m =>
    [m.name, m.email, m.subject, m.message].some(
      v => v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className={styles.page}>
      {/* ── List pane ── */}
      <div className={`${styles.listPane} ${showDetail ? styles.listHidden : ''}`}>
        {/* Header */}
        <div className={styles.listHeader}>
          <div className={styles.listTitle}>
            <MessageSquare size={18} />
            <span>Messages</span>
            {unreadCount > 0 && <span className={styles.unreadBadge}>{unreadCount}</span>}
          </div>
        </div>

        {/* Search */}
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search messages…"
          />
        </div>

        {/* List */}
        <div className={styles.list}>
          {loading && (
            <div className={styles.loadingList}>
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className={styles.skeletonRow} />)}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className={styles.emptyList}>
              <MailOpen size={40} className={styles.emptyIcon} />
              <p>{search ? 'No messages match your search' : 'No messages yet'}</p>
            </div>
          )}
          {!loading && filtered.map(msg => (
            <motion.div
              key={msg.id}
              className={`${styles.listItem} ${selected?.id === msg.id ? styles.listItemActive : ''} ${!msg.isRead ? styles.listItemUnread : ''}`}
              onClick={() => selectMessage(msg)}
              whileHover={{ backgroundColor: 'rgba(10,20,47,0.04)' }}
            >
              <div className={styles.listAvatar}>
                {msg.name[0]?.toUpperCase() ?? 'A'}
                {!msg.isRead && <div className={styles.unreadDot} />}
              </div>
              <div className={styles.listBody}>
                <div className={styles.listTop}>
                  <span className={styles.listName}>{msg.name}</span>
                  <span className={styles.listTime}>{timeAgo(msg.createdAt)}</span>
                </div>
                <p className={styles.listSubject}>{msg.subject || 'No subject'}</p>
                <p className={styles.listPreview}>{msg.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Detail pane ── */}
      <AnimatePresence>
        {(selected || !showDetail) && (
          <div className={`${styles.detailPane} ${!showDetail ? styles.detailDesktopOnly : ''}`}>
            {selected ? (
              <motion.div
                className={styles.detailContent}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                key={selected.id}
              >
                {/* Detail header */}
                <div className={styles.detailHeader}>
                  <button className={styles.backBtn} onClick={() => { setShowDetail(false); }} aria-label="Back to list">
                    <ArrowLeft size={18} />
                  </button>
                  <div className={styles.detailHeaderInfo}>
                    <span className={styles.detailHeaderName}>{selected.name}</span>
                    <span className={styles.detailHeaderTime}>{formatDate(selected.createdAt)}</span>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => setDeleteTarget(selected)}
                    title="Delete message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Sender info */}
                <div className={styles.detailMeta}>
                  <div className={styles.metaAvatar}>{selected.name[0]?.toUpperCase()}</div>
                  <div className={styles.metaInfo}>
                    <div className={styles.metaRow}><User size={13} /><span>{selected.name}</span></div>
                    <div className={styles.metaRow}><Mail size={13} /><a href={`mailto:${selected.email}`} className={styles.metaLink}>{selected.email}</a></div>
                    {selected.phone_number && <div className={styles.metaRow}><Phone size={13} /><a href={`tel:${selected.phone_number}`} className={styles.metaLink}>{selected.phone_number}</a></div>}
                    {selected.location && <div className={styles.metaRow}><MapPin size={13} /><span>{selected.location}</span></div>}
                  </div>
                </div>

                {/* Subject */}
                {selected.subject && (
                  <div className={styles.detailSubject}>{selected.subject}</div>
                )}

                {/* Message body */}
                <div className={styles.detailBody}>
                  <p>{selected.message}</p>
                </div>

                {/* Reply link */}
                <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your message')}`} className={styles.replyBtn}>
                  Reply via Email
                </a>
              </motion.div>
            ) : (
              <div className={styles.detailEmpty}>
                <MessageSquare size={48} className={styles.detailEmptyIcon} />
                <p>Select a message to read it</p>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Message?"
        message={`Delete message from ${deleteTarget?.name}? This cannot be undone.`}
      />
    </div>
  );
};

export default Messages;
