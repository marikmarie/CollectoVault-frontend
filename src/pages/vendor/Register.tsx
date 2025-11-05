// src/pages/Vendor/Register.tsx
import { useEffect, useState, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useSession from "../../hooks/useSession";
import { fetchCollectoVendor, type CollectoVendor } from "../../api/collectoPayments";
import { authService } from "../../api/authService";
import ROUTES from "../../constants/routes";

type Step = "lookup" | "form" | "not-found";

type LookupForm = {
  collectoId: string;
};

type VendorForm = {
  collectoId: string;
  businessName: string;
  contactEmail: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  acceptTerms?: boolean;
};

export default function VendorRegisterPage(): JSX.Element {
  // useSession returns { user, loading, refresh, isAuthenticated, ... }
  const { user, isAuthenticated, refresh } = useSession() as any;
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === "vendor") {
      navigate(ROUTES.VENDOR.DASHBOARD, { replace: true });
    } else if (isAuthenticated && user?.role && user.role !== "vendor") {
      navigate(ROUTES.ROOT, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  // lookup step
  const {
    register: registerLookup,
    handleSubmit: handleLookupSubmit,
    formState: { errors: lookupErrors, isSubmitting: isLookupSubmitting },
  } = useForm<LookupForm>({ defaultValues: { collectoId: "" } });

  const [step, setStep] = useState<Step>("lookup");
  const [collectoData, setCollectoData] = useState<CollectoVendor | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const onLookup = async (data: LookupForm) => {
    setLookupError(null);
    setCollectoData(null);
    try {
      const got = await fetchCollectoVendor(data.collectoId);
      if (!got) {
        setStep("not-found");
      } else {
        setCollectoData(got);
        setStep("form");
      }
    } catch (err: any) {
      setLookupError("Failed to contact Collecto. Please try again.");
    }
  };

  // vendor registration form
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<VendorForm>({
    defaultValues: { collectoId: "", businessName: "", contactEmail: "", phone: "", password: "", confirmPassword: "", acceptTerms: false }
  });

  useEffect(() => {
    if (collectoData) {
      setValue("collectoId", collectoData.collectoId);
      setValue("businessName", collectoData.businessName);
      setValue("contactEmail", collectoData.contactEmail);
      setValue("phone", collectoData.phone ?? "");
    }
  }, [collectoData, setValue]);

  const onSubmitVendor = async (data: VendorForm) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!data.acceptTerms) {
      alert("You must accept the terms to continue");
      return;
    }

    try {
      // call backend register and include role
      await authService.register({
        firstName: data.businessName,
        lastName: undefined,
        email: data.contactEmail,
        phone: data.phone,
        password: data.password,
        role: "vendor",
        collectoId: data.collectoId
      });

      // refresh session so app knows the user is logged-in
      if (refresh) await refresh();

      // navigate to vendor dashboard
      navigate(ROUTES.VENDOR.DASHBOARD, { replace: true });
    } catch (err: any) {
      console.error("Register failed", err);
      const message = err?.response?.data?.message ?? err?.message ?? "Registration failed. Please try again.";
      alert(message);
    }
  };

  return (
    <div className="space-y-6">
      {step === "lookup" && (
        <div>
          <p className="text-sm text-slate-300 mb-3">
            Enter your Collecto ID to fetch registered business details. If you don't have a Collecto ID, you'll need to create one at Collecto first.
          </p>

          <form onSubmit={handleLookupSubmit(onLookup)} className="grid grid-cols-1 gap-3">
            <div>
              <label htmlFor="collectoId" className="block text-sm font-medium text-slate-200">Collecto ID</label>
              <input id="collectoId" {...registerLookup("collectoId", { required: "Collecto ID is required" })} placeholder="e.g. C-1001" className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${lookupErrors.collectoId ? "border-rose-500" : "border-slate-700"}`} />
              {lookupErrors.collectoId && <p className="mt-1 text-sm text-rose-400">{lookupErrors.collectoId.message}</p>}
            </div>

            {lookupError && <div className="text-sm text-rose-400">{lookupError}</div>}

            <div className="flex items-center justify-between">
              <button type="submit" disabled={isLookupSubmitting} className={`px-4 py-2 rounded-md ${isLookupSubmitting ? "bg-slate-600" : "bg-emerald-500 hover:bg-emerald-600"}`}>
                {isLookupSubmitting ? "Looking up..." : "Lookup Collecto ID"}
              </button>

              <Link to="/vendor/login" className="text-sm text-slate-300 underline">Already registered? Sign in</Link>
            </div>

            <div className="pt-4 text-sm text-slate-400">
              <div>If you don't have a Collecto account, create one here:</div>
              <a href="https://collecto.cissytech.com/" target="_blank" rel="noreferrer" className="text-white underline">Create a Collecto account</a>
            </div>
          </form>
        </div>
      )}

      {step === "not-found" && (
        <div className="bg-slate-800/40 border border-slate-700 rounded p-4">
          <h3 className="font-semibold text-lg">Collecto ID not found</h3>
          <p className="text-sm text-slate-300 mt-2">We couldn't find a Collecto account with that ID. Please create a Collecto account first, then return here to complete vendor registration.</p>
          <div className="mt-4 flex gap-3">
            <a href="https://collecto.cissytech.com/" target="_blank" rel="noreferrer" className="px-4 py-2 bg-emerald-500 rounded text-black font-semibold">Create Collecto account</a>
            <button onClick={() => setStep("lookup")} className="px-4 py-2 border rounded">Try another ID</button>
            <button onClick={() => setStep("form")} className="px-4 py-2 bg-slate-700 rounded">Continue manual registration</button>
          </div>
        </div>
      )}

      {step === "form" && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Complete vendor registration</h3>

          <form onSubmit={handleSubmit(onSubmitVendor)} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-200">Collecto ID</label>
              <input readOnly {...register("collectoId")} className="mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/30 border border-slate-700" />
              <div className="text-xs text-slate-400 mt-1">This is fetched from Collecto and links your vendor account.</div>
            </div>

            <div>
              <label className="block text-sm text-slate-200">Business name</label>
              <input {...register("businessName", { required: "Business name is required" })} className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${errors.businessName ? "border-rose-500" : "border-slate-700"}`} />
              {errors.businessName && <p className="mt-1 text-sm text-rose-400">{errors.businessName.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-slate-200">Contact email</label>
              <input {...register("contactEmail", { required: "Contact email is required" })} className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${errors.contactEmail ? "border-rose-500" : "border-slate-700"}`} />
              {errors.contactEmail && <p className="mt-1 text-sm text-rose-400">{errors.contactEmail.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-slate-200">Phone (optional)</label>
              <input {...register("phone")} className="mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border border-slate-700" />
            </div>

            <div>
              <label className="block text-sm text-slate-200">Password</label>
              <input type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })} className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${errors.password ? "border-rose-500" : "border-slate-700"}`} />
              {errors.password && <p className="mt-1 text-sm text-rose-400">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-slate-200">Confirm password</label>
              <input type="password" {...register("confirmPassword", { required: "Please confirm password" })} className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${errors.confirmPassword ? "border-rose-500" : "border-slate-700"}`} />
              {errors.confirmPassword && <p className="mt-1 text-sm text-rose-400">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-3">
              <input id="acceptTerms" type="checkbox" {...register("acceptTerms")} className="mt-2 h-4 w-4 rounded border-slate-700 bg-slate-900/40" />
              <label htmlFor="acceptTerms" className="text-sm text-slate-300">I confirm connection to the Collecto account and accept the <Link to="/terms" className="underline">Terms</Link>.</label>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={() => setStep("lookup")} className="px-4 py-2 rounded border">Back</button>
              <button type="submit" disabled={isSubmitting} className={`px-4 py-2 rounded ${isSubmitting ? "bg-slate-600" : "bg-emerald-500 hover:bg-emerald-600"}`}>
                {isSubmitting ? "Creating account..." : "Create vendor account"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
