import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function extractErrorMessage(detail) {
  if (!detail) {
    return "Registration failed. Please try again.";
  }

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg || item?.message || "Validation error")
      .join(" ");
  }

  return "Registration failed. Please try again.";
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    org: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      navigate("/login");
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [navigate, successMessage]);

  const updateField = (field) => (event) => {
    const value = event.target.value;

    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
    setSubmitError("");
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    try {
      await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        org: formData.org.trim() || undefined,
        role: formData.role.trim() || undefined,
      });

      setSuccessMessage("Registration successful. Redirecting to sign in...");
    } catch (error) {
      const responseDetail = error?.response?.data?.detail;
      const responseMessage = error?.response?.data?.message;
      const fallbackMessage = error?.message || "Registration failed. Please try again.";

      setSubmitError(extractErrorMessage(responseDetail) || responseMessage || fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl rounded-3xl overflow-hidden border border-white/10 bg-[#111827] shadow-2xl">
        <div className="grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Enterprise Prompt
              <br />
              Engineering Toolkit
            </h1>

            <p className="mt-8 text-xl font-semibold text-cyan-300">
              Create Your Account
            </p>

            <p className="mt-3 text-blue-100 text-lg leading-8">
              Register to start managing prompts, evaluations, and optimized workflows in one place.
            </p>
          </div>

          <div className="bg-[#111827] p-12 flex items-center">
            <div className="w-full">
              <h2 className="text-4xl font-bold text-white">Register</h2>

              <p className="mt-3 text-slate-400">
                Create your account to get started.
              </p>

              {successMessage ? (
                <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  {successMessage}
                </div>
              ) : null}

              {submitError ? (
                <div className="mt-8 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  {submitError}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={updateField("name")}
                    className="w-full rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
                  />
                  {errors.name ? <p className="mt-2 text-sm text-rose-300">{errors.name}</p> : null}
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={updateField("email")}
                    className="w-full rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
                  />
                  {errors.email ? <p className="mt-2 text-sm text-rose-300">{errors.email}</p> : null}
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={updateField("password")}
                      className="w-full rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 pr-12 text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password ? <p className="mt-2 text-sm text-rose-300">{errors.password}</p> : null}
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={updateField("confirmPassword")}
                      className="w-full rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 pr-12 text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword ? (
                    <p className="mt-2 text-sm text-rose-300">{errors.confirmPassword}</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">Organization</label>
                  <input
                    type="text"
                    placeholder="Optional organization name"
                    value={formData.org}
                    onChange={updateField("org")}
                    className="w-full rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">Role</label>
                  <input
                    type="text"
                    placeholder="Optional role"
                    value={formData.role}
                    onChange={updateField("role")}
                    className="w-full rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-lg font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </button>

                <p className="text-center text-sm text-slate-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Sign In
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