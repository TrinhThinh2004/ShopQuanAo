import { MapPin, Clock, Phone, MapPinned } from "lucide-react";

export type Store = {
  id: string;
  name: string;
  city: string; // Tỉnh/Thành phố
  district: string; // Quận/Huyện
  address: string;
  phone: string;
  hours: string;
  open: boolean;
  image: string;
  lat?: number;
  lng?: number;
  isNew?: boolean;
};

type Props = {
  store: Store;
};

export default function StoreCard({ store }: Props) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    store.address
  )}`;

  return (
    <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-[16/10] w-full overflow-hidden">
        <img
          src={store.image}
          alt={store.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-snug">
            {store.name}
            {store.isNew && (
              <span className="ml-2 align-middle rounded bg-sky-100 px-2 py-[2px] text-[10px] font-bold text-sky-700">
                New
              </span>
            )}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-[2px] text-[10px] font-semibold ${
              store.open
                ? "bg-emerald-100 text-emerald-700"
                : "bg-neutral-200 text-neutral-700"
            }`}
            title={store.open ? "Đang mở" : "Tạm đóng"}
          >
            {store.open ? "Đang mở" : "Đã đóng"}
          </span>
        </div>

        <p className="flex items-start gap-2 text-sm text-neutral-700">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-600" />
          <span>{store.address}</span>
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-700">
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-neutral-600" /> {store.hours}
          </span>
          <a
            href={`tel:${store.phone}`}
            className="inline-flex items-center gap-2 hover:underline"
          >
            <Phone className="h-4 w-4 text-neutral-600" /> {store.phone}
          </a>
        </div>

        <div className="pt-1">
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-semibold hover:border-black hover:bg-neutral-50"
          >
            <MapPinned className="h-4 w-4" />
            Xem bản đồ
          </a>
        </div>
      </div>
    </article>
  );
}
