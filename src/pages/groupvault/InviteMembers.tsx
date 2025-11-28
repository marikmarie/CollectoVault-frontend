import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

import useSession from "../../hooks/useSession";
import { a } from "framer-motion/client";
import api from "../../api";

export default function InviteMembers() {
  const { user, loaded: sessionLoading, setUser } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionLoading) {
      if (!user) {
        navigate("/login");
      } else if (!user.isGroupVaultAdmin) {
        navigate("/customer/dashboard");
      }
    }
  }, [user, sessionLoading, navigate]);

  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    if (user && !sessionLoading) {
      loadGroupData();
    }   
    }, [user, sessionLoading]);
 async function loadGroupData() {
    setLoading(true);
    try {
      const groupResp = await api.get("/api/group-vault/me");
      setGroup(groupResp.data);
    } catch (err) {
      console.error(err);
    }   
    setLoading(false);
  }
  

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6 text-gray-900">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Invite Members to Group Vault
          </h1>
          <p className="text-gray-600">
            Share the invite link below to add members to your Group Vault.
          </p>
          <section className="bg-slate-800/40 rounded-lg p-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="invite-link"
            >
              Invite Link
            </label>
            <input
              type="text"
              id="invite-link"
              readOnly
              value={
                group
                  ? `${window.location.origin}/join-group/${group.inviteCode}`
                  : "Loading..."
              }
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </section>
        </div>
      </main>
    </div>
  );
}
