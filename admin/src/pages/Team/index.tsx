import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Flag, Star, Users } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { api, buildFormData } from '@/services/api';
import { Player } from '@/data/dummyData';
import { Modal, ConfirmDialog, Field, Input, Textarea, Select, Btn, Toggle } from '@/components/ui';
import ImageInput from '@/components/ui/ImageInput';
import BlurImage from '@/components/ui/BlurImage';
import styles from './Team.module.scss';

const POSITIONS = ['Goalkeeper','Defender','Midfielder','Forward'];
const FILTERS   = ['All','First Team','Goalkeeper','Defender','Midfielder','Forward'];

type PlayerForm = Omit<Player,'id'|'blur_image'>;
const empty: PlayerForm = {
  name:'', slug:'', position:'Midfielder', number:0,
  nationality:'', age:0, image:'',
  goals:0, assists:0, appearances:0, bio:'', first_team:false,
};

const Form: React.FC<{
  value: PlayerForm;
  imageFile: File|null;
  onImageChange:(f:File|null)=>void;
  onChange:(v:PlayerForm)=>void;
  isEdit:boolean;
}> = ({ value, imageFile, onImageChange, onChange, isEdit }) => {
  const set = (k:keyof PlayerForm, v:any) => onChange({...value,[k]:v});
  return (
    <div className={styles.formGrid}>
      <div style={{gridColumn:'1/-1'}}>
        <ImageInput currentUrl={isEdit ? value.image||undefined : undefined} onFileChange={onImageChange} label="Player Photo" required aspectRatio="3/4"/>
      </div>
      <Field label="Full Name" required><Input value={value.name} onChange={e=>set('name',e.target.value)} placeholder="Kofi Mensah"/></Field>
      <Field label="Slug" required><Input value={value.slug} onChange={e=>set('slug',e.target.value)} placeholder="kofi-mensah"/></Field>
      <Field label="Position" required>
        <Select value={value.position} onChange={e=>set('position',e.target.value)}>
          {POSITIONS?.map(p=><option key={p} value={p}>{p}</option>)}
        </Select>
      </Field>
      <Field label="Jersey Number"><Input type="number" value={value.number} onChange={e=>set('number',+e.target.value)} min={1} max={99}/></Field>
      <Field label="Nationality"><Input value={value.nationality} onChange={e=>set('nationality',e.target.value)} placeholder="Ghana"/></Field>
      <Field label="Age"><Input type="number" value={value.age} onChange={e=>set('age',+e.target.value)} min={14} max={50}/></Field>
      <Field label="Goals"><Input type="number" value={value.goals} onChange={e=>set('goals',+e.target.value)} min={0}/></Field>
      <Field label="Assists"><Input type="number" value={value.assists} onChange={e=>set('assists',+e.target.value)} min={0}/></Field>
      <Field label="Appearances"><Input type="number" value={value.appearances} onChange={e=>set('appearances',+e.target.value)} min={0}/></Field>
      <div style={{gridColumn:'1/-1'}}>
        <Field label="Biography"><Textarea value={value.bio} onChange={e=>set('bio',e.target.value)} rows={3} placeholder="Player biography…"/></Field>
      </div>
      <div style={{gridColumn:'1/-1'}}>
        <Toggle checked={value.first_team} onChange={v=>set('first_team',v)} label="First Team Player"/>
      </div>
    </div>
  );
};

const Team: React.FC = () => {
  const { players, setPlayers, loading } = useAdminData();
  const { success, error } = useToast();
  const [filter, setFilter] = useState('All');
  const [addOpen, setAddOpen]   = useState(false);
  const [editPlayer, setEditPlayer] = useState<Player|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Player|null>(null);
  const [form, setForm]         = useState<PlayerForm>(empty);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = players?.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'First Team') return p.first_team;
    return p.position === filter;
  });

  const openAdd  = () => { setForm({...empty}); setImageFile(null); setAddOpen(true); };
  const openEdit = (p:Player) => { setForm({...p}); setImageFile(null); setEditPlayer(p); };

  // Toggle first team via POST req
  const toggleFirstTeam = async (player: Player) => {
    try {
      const res = await api.post.toggleFirstTeam(player.id);
      const updated = res.data?.data ?? { ...player, first_team: !player.first_team, id: player.id };
      setPlayers(players?.map(p => p.id === player.id ? updated : p));
      success(res.data?.message || (updated.first_team ? 'Added to first team' : 'Removed from first team'));
    } catch { error('Failed to update'); }
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) { error('Name and slug required'); return; }
    setSaving(true);
    try {
      const payload = buildFormData({...form}, imageFile);
      if (editPlayer) {
        const res = await api.put.player(editPlayer.id, payload);
        const updated = res.data?.data ?? { ...editPlayer, ...form };
        setPlayers(players?.map(p => p.id === editPlayer.id ? updated : p));
        success(res.data?.message || 'Player updated');
        setEditPlayer(null);
      } else {
        const res = await api.post.player(payload);
        const created = res.data?.data ?? { id:Date.now(), blur_image:'', ...form };
        setPlayers([created, ...players]);
        success(res.data?.message || 'Player added');
        setAddOpen(false);
      }
    } catch { error('Failed to save player'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleting(true);
    setDeleteTarget(null);
    try {
      const res = await api.delete.player(target.id);
      setPlayers(players?.filter(p => p.id !== target.id));
      success((res as any)?.data?.message || `${target.name} deleted`);
    } catch { error('Failed to delete player'); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Squad Management</h1>
          <p className={styles.pageSub}>{players?.length} players · {players?.filter(p=>p.first_team)?.length} first team</p>
        </div>
        <Btn onClick={openAdd}><Plus size={15}/> Add Player</Btn>
      </div>

      <div className={styles.filters}>
        {FILTERS?.map(f => (
          <button key={f} className={`${styles.filterBtn} ${filter===f ? styles.active:''}`} onClick={() => setFilter(f)}>
            {f} {f==='First Team' && <span className={styles.filterCount}>{players?.filter(p=>p.first_team)?.length}</span>}
          </button>
        ))}
      </div>

      {/* Add slot at top */}
      <motion.div className={styles.addCard} onClick={openAdd} whileHover={{scale:1.01}} whileTap={{scale:0.99}}>
        <Plus size={28} className={styles.addIcon}/>
        <span className={styles.addLabel}>Add New Player</span>
      </motion.div>

      {loading ? (
        <div className={styles.grid}>{Array.from({length:6})?.map((_,i)=><div key={i} className={styles.skeleton}/>)}</div>
      ) : (
        <div className={styles.grid}>
          {filtered?.map((player,i) => (
            <motion.div key={player.id} className={styles.card} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.3,delay:i*0.04}}>
              {/* Image */}
              <div className={styles.imgWrap}>
                {player.image && <BlurImage src={player.image} blurSrc={player.blur_image||undefined} alt={player.name} objectPosition="center top"/>}
                <div className={styles.numberBadge}>#{player.number}</div>
                <span className={styles.posBadge}>{player.position}</span>
                {player.first_team && <span className={styles.firstTeamBadge}><Star size={9}/> First XI</span>}
              </div>
              {/* Info */}
              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <h3 className={styles.name}>{player.name}</h3>
                  <Flag size={12} className={styles.flag}/>
                </div>
                <span className={styles.nat}>{player.nationality}</span>
                <div className={styles.statsRow}>
                  <div className={styles.stat}><span className={styles.statVal}>{player.goals}</span><span className={styles.statLbl}>G</span></div>
                  <div className={styles.stat}><span className={styles.statVal}>{player.assists}</span><span className={styles.statLbl}>A</span></div>
                  <div className={styles.stat}><span className={styles.statVal}>{player.appearances}</span><span className={styles.statLbl}>App</span></div>
                </div>
                {/* Always-visible actions */}
                <div className={styles.cardActions}>
                  <button
                    className={`${styles.actionBtn} ${player.first_team ? styles.firstTeamActive : ''}`}
                    onClick={() => toggleFirstTeam(player)}
                    title={player.first_team ? 'Remove from first team':'Add to first team'}
                  >
                    <Star size={13} style={{fill: player.first_team ? 'currentColor':'none'}}/>
                  </button>
                  <button className={styles.actionBtn} onClick={() => openEdit(player)}><Pencil size={13}/></button>
                  <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => setDeleteTarget(player)}><Trash2 size={13}/></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Player" size="lg">
        <Form value={form} imageFile={imageFile} onImageChange={setImageFile} onChange={setForm} isEdit={false}/>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}><Plus size={13}/> Add Player</Btn>
        </div>
      </Modal>

      <Modal open={!!editPlayer} onClose={() => setEditPlayer(null)} title="Edit Player" size="lg">
        <Form value={form} imageFile={imageFile} onImageChange={setImageFile} onChange={setForm} isEdit={true}/>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => setEditPlayer(null)}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>Save Changes</Btn>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Remove Player?" message={`Remove ${deleteTarget?.name} from the squad?`}/>
    </div>
  );
};

export default Team;
