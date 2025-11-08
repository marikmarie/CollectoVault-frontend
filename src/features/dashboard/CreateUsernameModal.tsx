// src/features/customer/dashboard/CreateUsernameModal.tsx
import type { JSX } from "react";
import { useState } from "react";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import api from "../../api";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (username: string) => void;
};

export default function CreateUsernameModal({ open, onClose, onCreated }: Props): JSX.Element {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!username || username.length < 3) {
      setMessage("Username must be at least 3 characters.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const resp = await api.post("/api/user/username", { username });
      if (resp.data?.ok) {
        setMessage("Username created");
        if (onCreated) onCreated(username);
      } else {
        setMessage(resp.data?.message ?? "Unable to create username");
      }
    } catch (err: any) {
      setMessage(err?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={() => !loading && onClose()}>
      <div className="p-4 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Create a username</h3>
        <p className="text-sm text-slate-400 mb-4">Create a short username so you can login with it next time instead of the long client id.</p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="choose a username"
          className="w-full rounded-md px-3 py-2 bg-slate-900/40 border border-slate-700 text-white mb-3"
        />

        {message && <div className="text-sm text-amber-300 mb-3">{message}</div>}

        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={() => onClose()} disabled={loading}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Saving..." : "Create username"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
