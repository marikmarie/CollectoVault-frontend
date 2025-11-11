// src/features/auth/LoginForm.tsx
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/authService";

type FormValues = {
  type: "business" | "client" | "staff";
  id?: string;
  // uid?: string;
};

type OtpValues = {
  vaultOTP: string;
  vaultOTPToken: string | null;
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
    setValue,
  } = useForm<FormValues>({
    defaultValues: { type: "client", id: "" },
  });

  useEffect(() => {
    setValue("type", selectedType);
  }, [selectedType, setValue]);

  const [pendingPayload, setPendingPayload] =
    useState<Partial<FormValues> | null>(null);

  const onIdentifiersSubmit = async (data: FormValues) => {
    setServerMessage(null);
    setIsProcessing(true);

    try {
      const payload: any = { type: data.type };

      if (data.type === "staff") {
        if (!data.id) throw new Error("UID is required for staff");
        payload.id = data.id;
      } else {
        if (!data.id) throw new Error("ID is required");
        payload.id = data.id;
      }

      const res = await authService.startCollectoAuth(payload);

      console.log(res);

      if (res?.data.status === "error") {
        setServerMessage(res?.data.message || "Authorization failed");
        return;
      }
      if (res?.data == null) {
        setServerMessage("User Not found.");
        return;
      }
      if (res?.data?.auth == false) {
        setServerMessage(res?.message || "Authorization failed");
        return;
      }

      if (res?.status == 500) {
        setServerMessage("Server Error. Please try again later.");
        return;
      }

      // add(payload);
      if (res?.data.data.vaultOTPSent === true) {
        setPendingPayload({
          ...payload,
          vaultOTPToken: res?.data.data.vaultOTPToken,
        });
        setStep("otp");
        setServerMessage(res?.message ?? "OTP sent — enter it below");
      }
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
      const verifyPayload: any = { ...pendingPayload, vaultOTP: data.vaultOTP };
      const res = await authService.verifyCollectoOtp(verifyPayload);

      const verified = res?.data?.data?.verified;
      if (!verified) {
        setServerMessage(res?.data?.message ?? "OTP verification failed");
        return;
      }

        const userType = res?.type ?? (pendingPayload.type as FormValues["type"]);
        if (userType === "business") {
          if (res?.isNewBusiness) return navigate("/business/setup");
          return navigate("/vendor/dashboard");
        }
        if (userType === "client") return navigate("/customer/dashboard");
        if (userType === "staff") return navigate("/staff/dashboard");
        return navigate("/");
     
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

  const typeOptions: { value: FormValues["type"]; label: string }[] = [
    { value: "business", label: "Business" },
    { value: "client", label: "Client" },
    { value: "staff", label: "Staff" },
  ];

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <div className="flex gap-2 justify-center">
          {typeOptions.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setSelectedType(t.value);
              }}
              className={`px-3 py-2 rounded-full text-sm font-medium ${
                selectedType === t.value
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-700 text-slate-200"
              }`}
              type="button"
            >
              {t.label}
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
          {/* keep the hidden field (value set via useEffect/setValue) */}
          <input type="hidden" {...register("type")} />

          {selectedType === "client" ? (
            <>
              <div>
                <label className="block text-sm text-slate-200">
                  Id (Client ID)
                </label>
                <input
                  {...register("id", { required: "id is required" })}
                  className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${
                    errors.id ? "border-rose-500" : "border-slate-700"
                  } placeholder-slate-400 placeholder:font-normal`}
                  placeholder="Client user ID"
                />
              </div>
            </>
          ) : selectedType === "staff" ? (
            <div>
              <label className="block text-sm text-slate-200">UID</label>
              <input
                {...register("id", { required: "UID is required for staff" })}
                className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${
                  errors.id ? "border-rose-500" : "border-slate-700"
                } placeholder-slate-400 placeholder:font-normal`}
                placeholder="staff uid"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm text-slate-200">
                Business ID
              </label>
              <input
                {...register("id", { required: "Business ID is required" })}
                className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${
                  errors.id ? "border-rose-500" : "border-slate-700"
                } placeholder-slate-400 placeholder:font-normal`}
                placeholder="Collecto ID"
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
              {isProcessing ? "Starting..." : "Authorize"}
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
                {...registerOtp("vaultOTP", { required: "OTP is required" })}
                className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${
                  otpErrors.vaultOTP ? "border-rose-500" : "border-slate-700"
                }  placeholder-slate-400 placeholder:font-normal`}
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
