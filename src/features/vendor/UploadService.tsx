/* src/features/vendor/UploadService.tsx */
import React, { useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import vendorsService from "../../api/vendorsService";

type Form = {
  title: string;
  description?: string;
  pricePoints?: number;
  priceCurrency?: number;
  category?: string;
  active?: boolean;
  image?: FileList;
};

export default function UploadService(): JSX.Element {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting }, watch } = useForm<Form>({
    defaultValues: { title: "", description: "", pricePoints: undefined, priceCurrency: undefined, category: "", active: true },
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const imageFiles = watch("image");

  React.useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      const file = imageFiles[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [imageFiles]);

  const onSubmit = async (data: Form) => {
    setServerError(null);
    // basic validation: require title and at least one price
    if (!data.title) {
      setError("title", { message: "Title is required" });
      return;
    }
    if (!data.pricePoints && !data.priceCurrency) {
      setError("pricePoints", { message: "Set a points price or currency price" });
      return;
    }

    try {
      // Build payload
      const payload: any = {
        title: data.title,
        description: data.description,
        pricePoints: data.pricePoints || null,
        priceCurrency: data.priceCurrency || null,
        category: data.category || "general",
        active: Boolean(data.active),
      };

      // If vendorsService.createService exists, call it (with file handling if supported)
      if ((vendorsService as any)?.createService) {
        // If the API supports multipart/form-data, you'd send FormData including image
        const res = await (vendorsService as any).createService(payload);
        
        const created = res?.data ?? res;
        navigate("/vendor/services");
      } else {
        
        await new Promise((r) => setTimeout(r, 700));
        navigate("/vendor/services");
      }
    } catch (err: any) {
      console.error("create service failed", err);
      setServerError(err?.message ?? "Failed to create service. Try again.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Upload Service</h2>
          <p className="text-sm text-slate-300">Create a new service or offer for customers to redeem with points.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-300">Service title</label>
            <input {...register("title", { required: "Title required" })} className={`mt-1 w-full rounded px-3 py-2 bg-slate-800/50 border ${errors.title ? "border-rose-500" : "border-slate-700"}`} placeholder="e.g. 2-hour spa voucher" />
            {errors.title && <p className="mt-1 text-sm text-rose-400">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-slate-300">Description</label>
            <textarea {...register("description")} rows={6} className="mt-1 w-full rounded px-3 py-2 bg-slate-800/50 border border-slate-700" placeholder="Short description for customers" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-300">Price (points)</label>
              <input type="number" {...register("pricePoints", { valueAsNumber: true })} className="mt-1 w-full rounded px-3 py-2 bg-slate-800/50 border border-slate-700" placeholder="e.g. 1200" />
              {errors.pricePoints && <p className="mt-1 text-sm text-rose-400">{errors.pricePoints.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-300">Price (USD)</label>
              <input type="number" step="0.01" {...register("priceCurrency", { valueAsNumber: true })} className="mt-1 w-full rounded px-3 py-2 bg-slate-800/50 border border-slate-700" placeholder="e.g. 15.00" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-300">Category</label>
              <input {...register("category")} className="mt-1 w-full rounded px-3 py-2 bg-slate-800/50 border border-slate-700" placeholder="e.g. spa, dining, room" />
            </div>

            <div>
              <label className="block text-sm text-slate-300">Active</label>
              <select {...register("active")} className="mt-1 w-full rounded px-3 py-2 bg-slate-800/50 border border-slate-700">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300">Service image (optional)</label>
            <input type="file" accept="image/*" {...register("image")} className="mt-1 block w-full text-sm text-slate-300" />
            {preview && <img src={preview} alt="preview" className="mt-3 w-48 h-28 object-cover rounded" />}
          </div>

          {serverError && <div className="text-sm text-rose-400">{serverError}</div>}
        </div>

        <aside className="bg-slate-900/40 border border-slate-800 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-sm text-slate-300">Preview</h3>
            <div className="mt-3 bg-slate-800/30 p-3 rounded">
              <div className="font-semibold text-white">Service preview</div>
              <div className="text-sm text-slate-400 mt-1">Price: <span className="font-medium">—</span></div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button type="submit" formNoValidate={false} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded text-white font-semibold">Create service</button>
            <button type="button" onClick={() => navigate("/vendor/services")} className="px-4 py-2 border rounded text-sm">Cancel</button>
          </div>
        </aside>
      </form>
    </div>
  );
}
