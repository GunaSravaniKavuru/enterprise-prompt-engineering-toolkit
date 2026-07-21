import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("access_token", response.data.access_token);

    login({
  name: email,
  email,
});

    navigate("/dashboard");
  } catch (error) {
    alert(error.response?.data?.detail || "Invalid email or password");
  }
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

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="w-full rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 pr-12 text-white outline-none transition focus:border-cyan-400"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
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

                <p className="text-center text-sm text-slate-400">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Register
                  </button>
                </p>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}