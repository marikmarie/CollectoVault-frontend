/* src/features/customer/VendorStorefront.tsx */
import  { useEffect, useState, type JSX } from "react";
import { useParams, Link } from "react-router-dom";
import {vendorService} from "../../api/vendorService";
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
        if ((vendorService as any)?.getServicesByVendor) {
          const resp = await (vendorService as any).getServicesByVendor(vendorId);
          const data = resp?.data ?? resp;
          if (mounted) setServices(data || []);
        } else if ((vendorService as any)?.getVendor) {
          const v = await (vendorService as any).getVendor(vendorId);
          if (mounted) setVendorName(v?.data?.name ?? v?.name ?? "Vendor");
          const svc = await (vendorService as any).getAllServices();
          if (mounted) setServices((svc?.data ?? svc ?? []).slice(0, 6));
        } else {
          
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
    <div>
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
      </div>
  );
}
