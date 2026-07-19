import { useState } from "react";

export default function Profile() {
  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [email] = useState(localStorage.getItem("userEmail") || "");
  const [role] = useState("Prompt Engineer");
  const [organization, setOrganization] = useState("Enterprise Prompt Engineering Toolkit");

  const handleSave = () => {
    localStorage.setItem("userName", name);
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-white mb-6">
          My Profile
        </h1>

        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-cyan-500 flex items-center justify-center text-3xl font-bold text-white">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        <div className="space-y-5">

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 text-white focus:border-cyan-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Role
            </label>
            <input
              type="text"
              value={role}
              readOnly
              className="w-full rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Organization
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 text-white focus:border-cyan-400 outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-white font-semibold hover:opacity-90"
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}