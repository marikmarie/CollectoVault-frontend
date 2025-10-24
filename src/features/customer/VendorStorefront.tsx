/* src/features/customer/VendorStorefront.tsx */
import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { useParams, Link } from "react-router-dom";
import vendorsService from "../../api/vendorsService";
import RewardCard from "../../components/common/RewardCard";
import Spinner from "../../components/common/Spinner";

type Service = {
  id: string;
  title: string;
  description?: string;
  pointsPrice?: number | null;
  currencyPrice?: number | null;
  imageUrl?: string | null;
};

export default function VendorStorefront(): JSX.Element {
  const params = useParams<{ vendorId?: string }>();
  const vendorId = params.vendorId ?? "";
  const [vendorName, setVendorName] = useState<string>("Vendor");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        if ((vendorsService as any)?.getServicesByVendor) {
          const resp = await (vendorsService as any).getServicesByVendor(vendorId);
          const data = resp?.data ?? resp;
          if (mounted) setServices(data || []);
        } else if ((vendorsService as any)?.getVendor) {
          const v = await (vendorsService as any).getVendor(vendorId);
          if (mounted) setVendorName(v?.data?.name ?? v?.name ?? "Vendor");
          const svc = await (vendorsService as any).getAllServices();
          if (mounted) setServices((svc?.data ?? svc ?? []).slice(0, 6));
        } else {
          // demo fallback
          if (mounted) {
            setVendorName("Forest Park Resort");
            setServices([
              { id: "s1", title: "2-hour spa", description: "Relaxing package", pointsPrice: 1200, currencyPrice: 15 },
              { id: "s2", title: "Romantic dinner", description: "Three-course menu", pointsPrice: 800, currencyPrice: 10 },
              { id: "s3", title: "Room upgrade", description: "Upgrade to premium", pointsPrice: 2000, currencyPrice: 25 },
            ]);
          }
        }
      } catch (err) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [vendorId]);

  return (
    <MainLayout title={vendorName} subtitle="Browse services and redeem with points">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-slate-300">Vendor: {vendorName}</div>
        <div>
          <Link to="/customer/rewards" className="text-sm underline">View all rewards</Link>
        </div>
      </div>

      {loading ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-6 text-center"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <RewardCard
              key={s.id}
              id={s.id}
              title={s.title}
              description={s.description}
              pointsPrice={s.pointsPrice ?? null}
              currencyPrice={s.currencyPrice ?? null}
              vendorName={vendorName}
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
}
