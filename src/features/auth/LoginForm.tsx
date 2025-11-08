// src/features/auth/LoginForm.tsx
import type { JSX } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/authService";

type FormValues = {
  type: "business" | "client" | "staff";
  collectoId?: string;
  cid?: string;
  uid?: string;
};

type OtpValues = {
  otpCode: string;
};

export default function LoginForm(): JSX.Element {
  const navigate = useNavigate();
  const [step, setStep] = useState<"identifiers" | "otp">("identifiers");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedType, setSelectedType] =
    useState<FormValues["type"]>("client");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { type: "client", collectoId: "", cid: "", uid: "" },
  });

  const [pendingPayload, setPendingPayload] =
    useState<Partial<FormValues> | null>(null);

const onIdentifiersSubmit = async (data: FormValues) => {
  setServerMessage(null);
  setIsProcessing(true);

  try {
    const payload: any = { type: data.type };

    if (data.type === "staff") {
      if (!data.uid) throw new Error("UID is required for staff");
      payload.uid = data.uid;
    } else {
      if (!data.collectoId) throw new Error("Collecto ID is required");
      if (!data.cid) throw new Error("CID is required");
      payload.collectoId = data.collectoId;
      payload.cid = data.cid;
    }

    const res = await authService.startCollectoAuth(payload);
    console.log(res);

    if (res?.data == null) {
      setServerMessage("User Not found.");
      return;
    }

    
    setPendingPayload(payload);
    setStep("otp");
    setServerMessage(res?.message ?? "OTP sent — enter it below");

  } catch (err: any) {
    setServerMessage(err?.message ?? String(err));
  } finally {
    setIsProcessing(false);
  }
};

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm<OtpValues>();

  const onOtpSubmit = async (data: OtpValues) => {
    if (!pendingPayload) {
      setServerMessage("No pending authentication. Start again.");
      setStep("identifiers");
      return;
    }
    setIsProcessing(true);
    try {
      const verifyPayload: any = { ...pendingPayload, otpCode: data.otpCode };
      const res = await authService.verifyCollectoOtp(verifyPayload);

      if (res?.token) {
        const userType = res?.type ?? pendingPayload.type;
        if (userType === "business") {
          if (res?.isNewBusiness) return navigate("/business/setup");
          return navigate("/vendor/dashboard");
        }
        if (userType === "client") return navigate("/customer/dashboard");
        if (userType === "staff") return navigate("/staff/dashboard");
        return navigate("/");
      } else {
        setServerMessage(res?.message ?? "OTP verification failed");
      }
    } catch (err: any) {
      setServerMessage(err?.message ?? "Verification failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const onBackToIdentifiers = () => {
    setStep("identifiers");
    setPendingPayload(null);
    setServerMessage(null);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <div className="flex gap-2 justify-center">
          {(["business", "client", "staff"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelectedType(t);
              }}
              className={`px-3 py-2 rounded-full text-sm font-medium ${
                selectedType === t
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-700 text-slate-200"
              }`}
              type="button"
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Select account type
        </p>
      </div>

      {step === "identifiers" && (
        <form
          onSubmit={handleSubmit(onIdentifiersSubmit)}
          className="space-y-4"
          noValidate
        >
          <input type="hidden" {...register("type")} value={selectedType} />

          {selectedType !== "staff" ? (
            <>
              <div>
                <label className="block text-sm text-slate-200">
                  Collecto ID
                </label>
                <input
                  {...register("collectoId", {
                    required: "Collecto ID is required",
                  })}
                  className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${
                    errors.collectoId ? "border-rose-500" : "border-slate-700"
                  }`}
                  placeholder="collecto_shop_123"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-200">
                  CID (Client ID)
                </label>
                <input
                  {...register("cid", { required: "CID is required" })}
                  className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${
                    errors.cid ? "border-rose-500" : "border-slate-700"
                  }`}
                  placeholder="Client user ID"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm text-slate-200">UID</label>
              <input
                {...register("uid", { required: "UID is required for staff" })}
                className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${
                  errors.uid ? "border-rose-500" : "border-slate-700"
                }`}
                placeholder="staff uid"
              />
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isProcessing}
              className={`px-5 py-2 rounded-md font-semibold shadow-sm ${
                isProcessing
                  ? "bg-slate-600 cursor-wait"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              {isProcessing ? "Starting..." : "Send OTP"}
            </button>
          </div>

          {serverMessage && (
            <div className="text-sm text-center text-amber-300">
              {serverMessage}
            </div>
          )}
        </form>
      )}

      {step === "otp" && (
        <div className="space-y-4">
          <form onSubmit={handleSubmitOtp(onOtpSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-200">OTP Code</label>
              <input
                {...registerOtp("otpCode", { required: "OTP is required" })}
                className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${
                  otpErrors.otpCode ? "border-rose-500" : "border-slate-700"
                }`}
                placeholder="123456"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onBackToIdentifiers}
                className="text-sm text-slate-300 hover:underline"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className={`px-5 py-2 rounded-md font-semibold shadow-sm ${
                  isProcessing
                    ? "bg-slate-600 cursor-wait"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white"
                }`}
              >
                {isProcessing ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-slate-400">
            Didn’t get it?{" "}
            <button
              className="underline text-slate-100"
              onClick={async () => {
                if (!pendingPayload) return;
                setIsProcessing(true);
                try {
                  const r = await authService.startCollectoAuth(
                    pendingPayload as any
                  );
                  console.log(r);
                  setServerMessage(r?.message ?? "OTP resent");
                } catch (e: any) {
                  setServerMessage(e?.message ?? "Unable to resend OTP");
                } finally {
                  setIsProcessing(false);
                }
              }}
            >
              Resend
            </button>
          </div>

          {serverMessage && (
            <div className="mt-2 text-center text-amber-300">
              {serverMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
