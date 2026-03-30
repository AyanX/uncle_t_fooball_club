// pages/Team/index.tsx — Player management: add, edit (popup), delete (confirm)
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Flag, Star } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import { Player } from '@/data/dummyData';
import { Modal, ConfirmDialog, Field, Input, Textarea, Select, Btn, Badge, Toggle } from '@/components/ui';
import styles from './Team.module.scss';

const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
const FILTERS = ['All', 'First Team', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

const emptyPlayer: Omit<Player, 'id'> = {
  name: '', slug: '', position: 'Midfielder', number: 0,
  nationality: '', age: 0, image: '', blur_image: '',
  goals: 0, assists: 0, appearances: 0, bio: '', first_team: false,
};

const PlayerForm: React.FC<{
  value: Omit<Player, 'id'>;
  onChange: (v: Omit<Player, 'id'>) => void;
}> = ({ value, onChange }) => {
  const set = (k: keyof typeof value, v: any) => onChange({ ...value, [k]: v });
  return (
    <div className={styles.formGrid}>
      <Field label="Full Name" required>
        <Input value={value.name} onChange={e => set('name', e.target.value)} placeholder="Player full name" />
      </Field>
      <Field label="Slug" required>
        <Input value={value.slug} onChange={e => set('slug', e.target.value)} placeholder="kofi-mensah" />
      </Field>
      <Field label="Position" required>
        <Select value={value.position} onChange={e => set('position', e.target.value)}>
          {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </Select>
      </Field>
      <Field label="Jersey Number">
        <Input type="number" value={value.number} onChange={e => set('number', +e.target.value)} min={1} max={99} />
      </Field>
      <Field label="Nationality">
        <Input value={value.nationality} onChange={e => set('nationality', e.target.value)} placeholder="Ghana" />
      </Field>
      <Field label="Age">
        <Input type="number" value={value.age} onChange={e => set('age', +e.target.value)} min={14} max={50} />
      </Field>
      <Field label="Goals">
        <Input type="number" value={value.goals} onChange={e => set('goals', +e.target.value)} min={0} />
      </Field>
      <Field label="Assists">
        <Input type="number" value={value.assists} onChange={e => set('assists', +e.target.value)} min={0} />
      </Field>
      <Field label="Appearances">
        <Input type="number" value={value.appearances} onChange={e => set('appearances', +e.target.value)} min={0} />
      </Field>
      <Field label="Image URL" required>
        <Input value={value.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
      </Field>
      <Field label="Blur Image URL">
        <Input value={value.blur_image} onChange={e => set('blur_image', e.target.value)} placeholder="https://... (tiny placeholder)" />
      </Field>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Biography">
          <Textarea value={value.bio} onChange={e => set('bio', e.target.value)} rows={4} placeholder="Player biography..." />
        </Field>
      </div>
      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <Toggle checked={value.first_team} onChange={v => set('first_team', v)} label="First Team Player" />
      </div>
    </div>
  );
};

const Team: React.FC = () => {
  const { players, setPlayers, loading } = useAdminData();
  const { success, error } = useToast();

  const [filter, setFilter] = useState('All');
  const [addOpen, setAddOpen]       = useState(false);
  const [editPlayer, setEditPlayer]  = useState<Player | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null);
  const [form, setForm] = useState<Omit<Player, 'id'>>(emptyPlayer);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = players.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'First Team') return p.first_team;
    return p.position === filter;
  });

  const openAdd = () => { setForm(emptyPlayer); setAddOpen(true); };
  const openEdit = (p: Player) => { setForm({ ...p }); setEditPlayer(p); };

  const handleSave = async () => {
    if (!form.name || !form.slug) { error('Name and slug are required'); return; }
    setSaving(true);
    try {
      if (editPlayer) {
        await api.put.player(editPlayer.id, form);
        setPlayers(players.map(p => p.id === editPlayer.id ? { ...editPlayer, ...form } : p));
        success('Player updated successfully');
        setEditPlayer(null);
      } else {
        await api.post.player(form);
        const newP: Player = { id: Date.now(), ...form };
        setPlayers([newP, ...players]);
        success('Player added successfully');
        setAddOpen(false);
      }
    } catch { error('Failed to save player'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete.player(deleteTarget.id);
      setPlayers(players.filter(p => p.id !== deleteTarget.id));
      success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
    } catch { error('Failed to delete player'); }
    finally { setDeleting(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Squad Management</h1>
          <p className={styles.pageSub}>{players.length} players registered</p>
        </div>
        <Btn onClick={openAdd}><Plus size={16} /> Add Player</Btn>
      </div>

      {/* Filter pills */}
      <div className={styles.filters}>
        {FILTERS.map(f => (
          <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* Add player — empty card at top */}
      {filter === 'All' && (
        <motion.div className={styles.addCard} onClick={openAdd}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Plus size={32} className={styles.addIcon} />
          <span className={styles.addLabel}>Add New Player</span>
        </motion.div>
      )}

      {/* Player grid */}
      <div className={styles.grid}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className={styles.skeleton} />)
        ) : filtered.map((player, i) => (
          <motion.div key={player.id} className={styles.card}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}>
            {/* Same layout as frontend */}
            <div className={styles.imgWrap}>
              <img src={player.image} alt={player.name} className={styles.playerImg} />
              <div className={styles.numberBadge}>#{player.number}</div>
              <span className={styles.posBadge}>{player.position}</span>
              {player.first_team && <span className={styles.firstTeamBadge}><Star size={10} /> First XI</span>}
              {/* Action overlay */}
              <div className={styles.imgActions}>
                <button className={styles.editBtn} onClick={() => openEdit(player)} title="Edit"><Pencil size={14} /></button>
                <button className={styles.deleteBtn} onClick={() => setDeleteTarget(player)} title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.nameRow}>
                <h3 className={styles.name}>{player.name}</h3>
                <Flag size={13} className={styles.flag} />
              </div>
              <span className={styles.nat}>{player.nationality}</span>
              <div className={styles.statsRow}>
                <div className={styles.stat}><span className={styles.statVal}>{player.goals}</span><span className={styles.statLbl}>Goals</span></div>
                <div className={styles.stat}><span className={styles.statVal}>{player.assists}</span><span className={styles.statLbl}>Assists</span></div>
                <div className={styles.stat}><span className={styles.statVal}>{player.appearances}</span><span className={styles.statLbl}>Apps</span></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Player" size="lg">
        <PlayerForm value={form} onChange={setForm} />
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}><Plus size={14} /> Add Player</Btn>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editPlayer} onClose={() => setEditPlayer(null)} title="Edit Player" size="lg">
        <PlayerForm value={form} onChange={setForm} />
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => setEditPlayer(null)}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>Save Changes</Btn>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Player?"
        message={`Are you sure you want to remove ${deleteTarget?.name} from the squad? This cannot be undone.`}
      />
    </div>
  );
};

export default Team;
