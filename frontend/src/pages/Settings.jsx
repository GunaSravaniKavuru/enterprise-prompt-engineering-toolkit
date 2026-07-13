import { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { Input, Select } from "../components/common/Input";
import { useToast } from "../components/common/Toast";
import { currentUser } from "../data/dummyData";

function Toggle({ checked, onChange, label, hint }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm text-ink">{label}</p>
        {hint && <p className="text-xs text-ink-faint">{hint}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-ring ${
          checked ? "bg-gradient-to-r from-violet-500 to-cyan-400" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const showToast = useToast();
  const [compact, setCompact] = useState(false);
  const [autosave, setAutosave] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSlack, setNotifSlack] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink-dim">Manage your workspace preferences.</p>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-sm font-semibold text-ink">Appearance</h2>
        <div className="mt-1 divide-y divide-[var(--color-border-soft)]">
          <Toggle checked={compact} onChange={setCompact} label="Compact layout" hint="Reduce spacing across dashboard cards" />
          <Toggle checked={true} onChange={() => {}} label="Dark theme" hint="Phase 1 ships dark theme only" />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-sm font-semibold text-ink">Prompt Defaults</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Default output format" options={["Bullet list", "JSON", "Plain paragraph", "Table"]} />
          <Select label="Default tone" options={["Neutral", "Formal", "Conversational", "Technical"]} />
        </div>
        <div className="mt-4 divide-y divide-[var(--color-border-soft)]">
          <Toggle checked={autosave} onChange={setAutosave} label="Autosave drafts" hint="Save Prompt Builder drafts every 30 seconds" />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-sm font-semibold text-ink">API Settings (UI only)</h2>
        <p className="mt-1 text-xs text-ink-faint">Not connected in this prototype — for layout purposes only.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="API Base URL" placeholder="https://api.yourcompany.com" disabled />
          <Input label="API Key" type="password" placeholder="••••••••••••••••" disabled />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-sm font-semibold text-ink">Notifications</h2>
        <div className="mt-1 divide-y divide-[var(--color-border-soft)]">
          <Toggle checked={notifEmail} onChange={setNotifEmail} label="Email notifications" hint="Quality drops, restored versions, comparisons" />
          <Toggle checked={notifSlack} onChange={setNotifSlack} label="Slack notifications" hint="Requires a connected workspace" />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-sm font-semibold text-ink">User Preferences</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Display name" defaultValue={currentUser.name} />
          <Input label="Organization" defaultValue={currentUser.org} />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => showToast("Settings saved")}>Save Changes</Button>
      </div>
    </div>
  );
}
