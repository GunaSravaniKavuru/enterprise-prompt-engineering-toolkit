import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const handleLogin = (e) => {
  e.preventDefault();
  localStorage.setItem("userName", name);
  navigate("/dashboard");
};
  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-6xl rounded-3xl overflow-hidden border border-white/10 bg-[#111827] shadow-2xl">

        <div className="grid md:grid-cols-2">

          {/* Left Side */}

          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-12 flex flex-col justify-center">


            <h1 className="text-4xl font-bold text-white leading-tight">
              Enterprise Prompt
              <br />
              Engineering Toolkit
            </h1>

            <p className="mt-8 text-xl font-semibold text-cyan-300">
              Welcome Back
            </p>

            <p className="mt-3 text-blue-100 text-lg leading-8">
              Sign in to continue managing your enterprise prompt engineering workspace.
            </p>

          </div>

          {/* Right Side */}

          <div className="bg-[#111827] p-12 flex items-center">

            <div className="w-full">

              <h2 className="text-4xl font-bold text-white">
                Sign In
              </h2>

              <p className="mt-3 text-slate-400">
                Enter your credentials to access your account.
              </p>
              <form
                onSubmit={handleLogin}
                className="mt-10 space-y-6"
              >
{/* Name */}
<div>
  <label className="block text-sm text-slate-300 mb-2">
    Name
  </label>

  <input
    type="text"
    placeholder="Enter your name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
    className="w-full rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
  />
</div>
                {/* Email */}

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your college email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  />
                </div>

                {/* Password */}

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between">

                  <label className="flex items-center gap-2 text-slate-300 text-sm">
                    <input type="checkbox" />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    Forgot Password?
                  </button>

                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-lg font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg"
                >
                  Sign In
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}