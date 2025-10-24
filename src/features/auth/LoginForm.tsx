/* src/features/auth/LoginForm.tsx */
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./useAuth";

type Form = {
  email: string;
  password: string;
};

export default function LoginForm(): JSX.Element {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Form>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: Form) => {
    try {
      const user = await login({ email: data.email, password: data.password });
      // redirect depending on role
      if (user.role === "vendor") navigate("/vendor/dashboard");
      else navigate("/customer/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("password", { message: err?.message ?? "Login failed. Check credentials." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-200">Email</label>
        <input
          id="email"
          type="email"
          {...register("email", { required: "Email is required" })}
          className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${errors.email ? "border-rose-500" : "border-slate-700"}`}
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-rose-400">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-200">Password</label>
        <input
          id="password"
          type="password"
          {...register("password", { required: "Password is required" })}
          className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${errors.password ? "border-rose-500" : "border-slate-700"}`}
          placeholder="Your password"
        />
        {errors.password && <p className="mt-1 text-sm text-rose-400">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between text-sm">
        <Link to="/customer/forgot-password" className="text-slate-300 hover:underline">Forgot password?</Link>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-md font-semibold shadow-sm ${isSubmitting ? "bg-slate-600 cursor-wait" : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </div>

      <div className="text-sm text-slate-400 text-center">
        Don't have an account? <Link to="/customer/register" className="underline text-white">Create one</Link>
      </div>
    </form>
  );
}
