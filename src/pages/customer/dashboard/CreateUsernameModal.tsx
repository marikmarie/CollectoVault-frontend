// src/features/customer/CreateUsernameModal.tsx
import type { JSX } from "react";
import { useState } from "react";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import api from "../../../api";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function CreateUsernameModal({ open, onClose, onCreated }: Props): JSX.Element {
  const [username, setUsername] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    if (!username || username.length < 3) {
      setMessage("Choose a username with at least 3 characters");
      return;
    }
    setProcessing(true);
    setMessage(null);
    try {
      const resp = await api.post("/api/customer/create-username", { username });
      if (resp.data?.ok) {
        setMessage("Username created");
        if (onCreated) onCreated();
        onClose();
      } else {
        setMessage(resp.data?.message ?? "Unable to create username");
      }
    } catch (err: any) {
      setMessage(err?.message ?? "Request failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal open={open} onClose={() => { if (!processing) onClose(); }}>
      <div className="p-4 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-2">Create a username</h3>
        <p className="text-sm text-slate-400 mb-3">A short username makes logging in faster. You can still use your client id if you prefer.</p>

        <label className="block text-sm text-slate-200 mb-2">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
          placeholder="choose a username"
          className="w-full mb-3 px-3 py-2 rounded bg-slate-800 text-white"
        />

        {message && <div className="text-sm text-amber-300 mb-2">{message}</div>}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={processing}>Cancel</Button>
          <Button onClick={submit} disabled={processing}>{processing ? "Creating..." : "Create"}</Button>
        </div>
      </div>
    </Modal>
  );
}
