import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import useSession from "../../hooks/useSession";
import api from "../../api";

export default function MembersList() {
  const { user, loaded: sessionLoading } = useSession();
  const navigate = useNavigate();       
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [group, setGroup] = useState<any>(null);

    useEffect(() => {
        if (!sessionLoading) {
            if (!user) {
                navigate("/login");
            }   
            else if (!user.isGroupVaultAdmin) {
                navigate("/customer/dashboard");
            }
            else {
                loadGroupData();
            }
        }
    }, [user, sessionLoading, navigate]);   

    async function loadGroupData() {
        setLoading(true);   
        try {
            const groupResp = await api.get("/api/group-vault/me");
            setGroup(groupResp.data);
            const membersResp = await api.get("/api/group-vault/members");
            setMembers(membersResp.data);
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
                    <h1 className="text-2xl font-bold mb-2">Members List</h1>
                    {loading ? (
                        <p>Loading members...</p>
                    ) : (
                        <ul>
                            {members.map((member) => (
                                <li key={member.id}>{member.name}</li>
                                
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}