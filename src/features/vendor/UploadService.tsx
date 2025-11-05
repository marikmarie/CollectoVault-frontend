// src/features/vendor/UploadService.tsx
import { useEffect, useRef, useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {vendorService} from "../../api/vendorService";

type Form = {
  title: string;
  description?: string;
  pricePoints?: number;
  priceCurrency?: number;
  category?: string;
  active?: boolean | string;
  image?: FileList | null;
};

export default function UploadService(): JSX.Element {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
    watch,
  } = useForm<Form>({
    defaultValues: {
      title: "",
      description: "",
      pricePoints: undefined,
      priceCurrency: undefined,
      category: "",
      active: "true",
      image: undefined,
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // watch fields for live preview
  const watchedTitle = watch("title");
  const watchedDescription = watch("description");
  const watchedPricePoints = watch("pricePoints");
  const watchedPriceCurrency = watch("priceCurrency");
  const watchedCategory = watch("category");
  const watchedActive = watch("active");
  const imageFiles = watch("image");

  // ref so we can trigger hidden file input from a styled button
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // create / revoke preview URL when image changes
  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      const file = imageFiles[0];
      try {
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
      } catch {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [imageFiles]);

  const onSubmit = async (data: Form) => {
    setServerError(null);
    // basic validation: require title and at least one price
    if (!data.title || data.title.trim().length === 0) {
      setError("title", { message: "Title is required" });
      return;
    }
    if (!data.pricePoints && !data.priceCurrency) {
      setError("pricePoints", {
        message: "Set a points price or currency price",
      });
      return;
    }

    setSubmitting(true);
    try {
      if ((vendorService as any)?.createService) {
        // const formData = new FormData();
        // formData.append("title", data.title);
        // formData.append("description", data.description ?? "");
        // if (data.pricePoints) formData.append("pricePoints", String(data.pricePoints));
        // if (data.priceCurrency) formData.append("priceCurrency", String(data.priceCurrency));
        // formData.append("category", data.category ?? "general");
        // formData.append("active", String(data.active === "true" || data.active === true));
        // if (data.image && data.image.length > 0) formData.append("image", data.image[0]);
        // const res = await (vendorsService as any).createService(formData);
        // const created = res?.data ?? res;
        navigate("/services");
      } else {
        // simulate server latency for demo
        await new Promise((r) => setTimeout(r, 700));
        navigate("/services");
      }
    } catch (err: any) {
      console.error("create service failed", err);
      setServerError(err?.message ?? "Failed to create service. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setValue("image", undefined);
    setPreview(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Upload Service</h2>
          <p className="text-sm text-slate-300">
            Create a new service or offer for customers to redeem with points.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => navigate("/services")}
            className="px-3 py-2 rounded bg-slate-800/40 border border-slate-700 text-sm hover:bg-slate-800 transition"
          >
            Back to services
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main form */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-2 bg-`linear`-to-b from-slate-900/50 to-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg"
        >
          <div>
            <label className="block text-sm text-slate-300">
              Service title
            </label>
            <input
              {...register("title", { required: "Title required" })}
              className={`mt-2 w-full rounded-lg px-4 py-2 bg-slate-800/60 border ${
                errors.title ? "border-rose-500" : "border-slate-700"
              } focus:outline-none focus:ring-2 focus:ring-emerald-400/20 font-normal placeholder:text-slate-400 placeholder:font-normal`}
              placeholder="e.g. 2-hour spa voucher"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <p id="title-error" className="mt-1 text-sm text-rose-400">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-300">Description</label>
            <textarea
              {...register("description")}
              rows={6}
              className="mt-2 w-full rounded-lg px-4 py-3 bg-slate-800/60 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 font-normal placeholder:text-slate-400 placeholder:font-normal"
              placeholder="Short description for customers"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300">
                Price (points)
              </label>
              <input
                type="number"
                {...register("pricePoints", { valueAsNumber: true })}
                className="mt-2 w-full rounded-lg px-4 py-2 bg-slate-800/60 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 font-normal placeholder:text-slate-400 placeholder:font-normal"
                placeholder="e.g. 1200"
              />
              {errors.pricePoints && (
                <p className="mt-1 text-sm text-rose-400">
                  {errors.pricePoints.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-300">
                Price (UGX)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("priceCurrency", { valueAsNumber: true })}
                className="mt-2 w-full rounded-lg px-4 py-2 bg-slate-800/60 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 font-normal placeholder:text-slate-400 placeholder:font-normal"
                placeholder="e.g. 50000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300">Category</label>
              <input
                {...register("category")}
                className="mt-2 w-full rounded-lg px-4 py-2 bg-slate-800/60 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 font-normal placeholder:text-slate-400 placeholder:font-normal"
                placeholder="e.g. spa, dining, room"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300">Active</label>
              <select
                {...register("active")}
                className="mt-2 w-full rounded-lg px-4 py-2 bg-slate-800/60 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 font-normal"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* Image upload: hidden input + styled button */}
          <div>
            <label className="block text-sm text-slate-300">
              Service image (optional)
            </label>

            <div className="mt-3 flex items-center gap-3">
              <input
                {...register("image")}
                ref={(e) => {
                  // register returns an object with ref; react-hook-form handles value assignment
                  // we also store the element in fileInputRef so we can trigger it programmatically
                  const reg = register("image");
                  if (
                    reg &&
                    typeof reg === "object" &&
                    "ref" in reg &&
                    typeof reg.ref === "function"
                  ) {
                    reg.ref(e);
                  }
                  fileInputRef.current = e ?? null;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                aria-hidden
              />

              <button
                type="button"
                onClick={openFilePicker}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 hover:bg-slate-800 transition shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 3v14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 10l7-7 7 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="3"
                    y="13"
                    width="18"
                    height="8"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="text-sm text-slate-200">Upload image</span>
              </button>

              {preview ? (
                <div className="flex items-center gap-3">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-28 h-20 object-cover rounded-md border border-slate-700"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={clearImage}
                      className="px-3 py-1 rounded bg-rose-600/80 text-white text-sm hover:bg-rose-600 transition"
                    >
                      Remove
                    </button>
                    <span className="text-xs text-slate-400">
                      Preview of selected file
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-400">PNG, JPG up to 5MB</div>
              )}
            </div>
          </div>

          {serverError && (
            <div className="text-sm text-rose-400">{serverError}</div>
          )}
        </motion.div>

        {/* Sidebar / Preview & actions */}
        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06 }}
          className="bg-linear-to-b from-slate-900/40 to-slate-900/30 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between"
        >
          <div>
            <h3 className="text-sm text-slate-300">Live preview</h3>

            <div className="mt-4 bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-lg bg-linear-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center text-emerald-300 font-semibold">
                  {watchedTitle ? watchedTitle.charAt(0).toUpperCase() : "S"}
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {watchedTitle || "Service title"}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 max-w-52 ">
                    {watchedDescription
                      ? `${watchedDescription.slice(0, 80)}${
                          watchedDescription.length > 80 ? "…" : ""
                        }`
                      : "Short description goes here."}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="text-sm text-slate-300">
                  <div className="text-xs text-slate-400">Points</div>
                  <div className="font-medium text-white">
                    {watchedPricePoints ?? "—"}
                  </div>
                </div>
                <div className="text-sm text-slate-300">
                  <div className="text-xs text-slate-400">Price (UGX)</div>
                  <div className="font-medium text-white">
                    {watchedPriceCurrency ? `UGX ${watchedPriceCurrency}` : "—"}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
                <div>
                  Category:{" "}
                  <span className="text-slate-200 font-medium">
                    {watchedCategory || "General"}
                  </span>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs ${
                    watchedActive === "true" || watchedActive === true
                      ? "bg-emerald-600/10 text-emerald-300"
                      : "bg-rose-600/10 text-rose-300"
                  }`}
                >
                  {watchedActive === "true" || watchedActive === true
                    ? "Active"
                    : "Inactive"}
                </div>
              </div>

              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="service preview"
                    className="w-full h-36 object-cover rounded-md border border-slate-700"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="submit"
              className={`w-full px-4 py-2 rounded-lg text-white font-semibold shadow-sm transition transform ${
                submitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:scale-[1.02] bg-emerald-500 hover:bg-emerald-600"
              }`}
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create service"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/services")}
              className="w-full px-4 py-2 rounded-lg border border-slate-700 text-sm hover:bg-slate-800 transition"
            >
              Cancel
            </button>
          </div>
        </motion.aside>
      </form>
    </div>
  );
}
