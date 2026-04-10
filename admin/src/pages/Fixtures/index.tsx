
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Calendar, MapPin, Users } from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useToast } from "@/context/ToastContext";
import { api } from "@/services/api";
import { Fixture } from "@/data/dummyData";
import {
  Modal,
  ConfirmDialog,
  Field,
  Input,
  Select,
  Btn,
  Badge,
} from "@/components/ui";
import styles from "./Fixtures.module.scss";

const STATUS_OPTIONS = ["upcoming", "completed", "live"] as const;
const TABS = ["All", "upcoming", "completed", "live"] as const;

const statusColors: Record<string, string> = {
  upcoming: "#2563eb",
  completed: "#16a34a",
  live: "#C8102E",
};

//guard against ISO timestamps
const toDateValue = (d?: string): string => {
  if (!d) return "";
  return d.slice(0, 10);
};

const FixtureForm: React.FC<{
  value: Omit<Fixture, "id">;
  onChange: (v: Omit<Fixture, "id">) => void;
}> = ({ value, onChange }) => {
  const set = (k: keyof typeof value, v: any) => onChange({ ...value, [k]: v });
  const isCompleted = value.status === "completed";

  return (
    <div className={styles.formGrid}>
      <Field label="Home Team" required>
        <Input
          value={value.homeTeam}
          onChange={(e) => set("homeTeam", e.target.value)}
          placeholder="Uncle T FC"
        />
      </Field>
      <Field label="Away Team" required>
        <Input
          value={value.awayTeam}
          onChange={(e) => set("awayTeam", e.target.value)}
          placeholder="Opponent team name"
        />
      </Field>
      <Field label="Date" required>
        <Input
          type="date"
          value={toDateValue(value.date)}
          onChange={(e) => set("date", e.target.value)}
        />
      </Field>
      <Field label="Kick-off Time">
        <Input
          type="time"
          value={value.time || ""}
          onChange={(e) => set("time", e.target.value)}
          placeholder="15:00"
        />
      </Field>
      <Field label="Venue" required>
        <Input
          value={value.venue}
          onChange={(e) => set("venue", e.target.value)}
          placeholder="Stadium name, City"
        />
      </Field>
      <Field label="Competition">
        <Input
          value={value.competition}
          onChange={(e) => set("competition", e.target.value)}
          placeholder="Tanzania Premier League"
        />
      </Field>
      <Field label="Status">
        <Select
          value={value.status}
          onChange={(e) => set("status", e.target.value as any)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Fans Attended">
        <Input
          type="number"
          value={value.fans === 0 && !isCompleted ? "" : (value.fans ?? "")}
          onChange={(e) =>
            set("fans", e.target.value === "" ? 0 : +e.target.value)
          }
          min={0}
          placeholder="e.g. 24500"
        />
      </Field>
      {isCompleted && (
        <>
          <Field label="Home Score">
            <Input
              type="number"
              value={
                value.homeScore !== undefined && value.homeScore !== null
                  ? value.homeScore
                  : ""
              }
              onChange={(e) =>
                set(
                  "homeScore",
                  e.target.value === "" ? undefined : +e.target.value,
                )
              }
              min={0}
              placeholder="0"
            />
          </Field>
          <Field label="Away Score">
            <Input
              type="number"
              value={
                value.awayScore !== undefined && value.awayScore !== null
                  ? value.awayScore
                  : ""
              }
              onChange={(e) =>
                set(
                  "awayScore",
                  e.target.value === "" ? undefined : +e.target.value,
                )
              }
              min={0}
              placeholder="0"
            />
          </Field>
        </>
      )}
    </div>
  );
};

const Fixtures: React.FC = () => {
  const { fixtures, setFixtures, teamname, loading } = useAdminData();
  const { success, error } = useToast();

  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Fixture | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Fixture | null>(null);
  const [form, setForm] = useState<Omit<Fixture, "id">>({
    homeTeam: teamname,
    awayTeam: "",
    homeTeamLogo: "",
    awayTeamLogo: "",
    date: new Date().toISOString().slice(0, 10),
    time: "15:00",
    venue: "",
    competition: "",
    status: "upcoming",
    fans: 0,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered =
    tab === "All" ? fixtures : fixtures.filter((f) => f.status === tab);

  const openAdd = () => {
    setForm({
      homeTeam: teamname,
      awayTeam: "",
      homeTeamLogo: "",
      awayTeamLogo: "",
      date: new Date().toISOString().slice(0, 10),
      time: "15:00",
      venue: "",
      competition: "",
      status: "upcoming",
      fans: 0,
    });
    setAddOpen(true);
  };

  // When editing, copy ALL existing fields including date and scores
  const openEdit = (f: Fixture) => {
    setForm({
      homeTeam: f.homeTeam || "",
      awayTeam: f.awayTeam || "",
      homeTeamLogo: f.homeTeamLogo || "",
      awayTeamLogo: f.awayTeamLogo || "",
      date: toDateValue(f.date),
      time: f.time || "",
      venue: f.venue || "",
      competition: f.competition || "",
      status: f.status || "upcoming",
      fans: f.fans ?? 0,
      homeScore: f.homeScore ?? undefined,
      awayScore: f.awayScore ?? undefined,
    });
    setEditItem(f);
  };

  const handleSave = async () => {
    if (!form.awayTeam || !form.venue) {
      error("Away team and venue are required");
      return;
    }
    setSaving(true);
    try {
      if (editItem) {
        const res = await api.put.fixture(editItem.id, form);
        const updated = res.data?.data ?? { ...editItem, ...form };
        setFixtures(fixtures.map((f) => (f.id === editItem.id ? updated : f)));
        success(res.data?.message || "Fixture updated");
        setEditItem(null);
      } else {
        const res = await api.post.fixture(form);
        const created = res.data?.data ?? { id: Date.now(), ...form };
        setFixtures([created, ...fixtures]);
        success(res.data?.message || "Fixture added");
        setAddOpen(false);
      }
    } catch {
      error("Failed to save fixture");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleting(true);
    setDeleteTarget(null);
    try {
      const res = await api.delete.fixture(target.id);
      setFixtures(fixtures.filter((f) => f.id !== target.id));
      success((res as any)?.data?.message || "Fixture deleted");
    } catch {
      error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const isKFC = (t: string) => t.toLowerCase().trim() === teamname.toLowerCase().trim();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Fixtures & Results</h1>
          <p className={styles.pageSub}>{fixtures.length} matches total</p>
        </div>
        <Btn onClick={openAdd}>
          <Plus size={14} /> Add Fixture
        </Btn>
      </div>

      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.active : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "All" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            <span className={styles.tabCount}>
              {t === "All"
                ? fixtures.length
                : fixtures.filter((f) => f.status === t).length}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {loading && <div className={styles.skeleton} />}
        {!loading &&
          filtered.map((f, i) => {
            const won =
              (isKFC(f.homeTeam) && (f.homeScore ?? 0) > (f.awayScore ?? 0)) ||
              (isKFC(f.awayTeam) && (f.awayScore ?? 0) > (f.homeScore ?? 0));
            const drew =
              f.status === "completed" && f.homeScore === f.awayScore;
            return (
              <motion.div
                key={f.id}
                className={styles.row}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <div className={styles.rowHead}>
                  <span className={styles.comp}>{f.competition}</span>
                  <Badge text={f.status} color={statusColors[f.status]} />
                </div>
                <div className={styles.matchup}>
                  <span
                    className={`${styles.team} ${isKFC(f.homeTeam) ? styles.us : ""}`}
                  >
                    {f.homeTeam}
                  </span>
                  <div className={styles.scoreWrap}>
                    {f.status === "completed" ? (
                      <>
                        <span className={styles.score}>
                          {f.homeScore} – {f.awayScore}
                        </span>
                        <span
                          className={`${styles.result} ${won ? styles.win : drew ? styles.draw : styles.loss}`}
                        >
                          {won ? "W" : drew ? "D" : "L"}
                        </span>
                      </>
                    ) : (
                      <span className={styles.vs}>VS</span>
                    )}
                  </div>
                  <span
                    className={`${styles.team} ${styles.right} ${isKFC(f.awayTeam) ? styles.us : ""}`}
                  >
                    {f.awayTeam}
                  </span>
                </div>
                <div className={styles.rowMeta}>
                  <span className={styles.metaItem}>
                    <Calendar size={12} />
                    {new Date(f.date).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                    {f.time && ` · ${f.time}`}
                  </span>
                  <span className={styles.metaItem}>
                    <MapPin size={12} /> {f.venue}
                  </span>
                  {f.status === "completed" && f.fans > 0 && (
                    <span className={`${styles.metaItem} ${styles.fans}`}>
                      <Users size={12} /> {f.fans.toLocaleString()} fans
                    </span>
                  )}
                </div>
                <div className={styles.rowActions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => openEdit(f)}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => setDeleteTarget(f)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        {!loading && filtered.length === 0 && (
          <div className={styles.empty} onClick={openAdd}>
            <Plus size={24} />
            <span>No {tab === "All" ? "" : tab} fixtures — add one</span>
          </div>
        )}
      </div>

      <Modal
        open={addOpen || !!editItem}
        onClose={() => {
          setAddOpen(false);
          setEditItem(null);
        }}
        title={editItem ? "Edit Fixture" : "Add Fixture"}
      >
        <FixtureForm value={form} onChange={setForm} />
        <div className={styles.modalFooter}>
          <Btn
            variant="secondary"
            onClick={() => {
              setAddOpen(false);
              setEditItem(null);
            }}
          >
            Cancel
          </Btn>
          <Btn loading={saving} onClick={handleSave}>
            {editItem ? "Save Changes" : "Add Fixture"}
          </Btn>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Fixture?"
        message={`Delete ${deleteTarget?.homeTeam} vs ${deleteTarget?.awayTeam}?`}
      />
    </div>
  );
};

export default Fixtures;
