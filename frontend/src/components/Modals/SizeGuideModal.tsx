import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export type SizeGuideModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** link ảnh – sau này bạn lấy từ API */
  src: string;
};

export default function SizeGuideModal({
  open,
  onClose,
  title = "Bảng size",
  src,
}: SizeGuideModalProps) {
  // khóa scroll & lắng nghe ESC
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose} // click nền để đóng
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()} // chặn nổi bọt
      >
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            className="grid h-9 w-9 place-content-center rounded-full hover:bg-neutral-100 cursor-pointer"
            aria-label="Đóng"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* content */}
        <div className="p-4">
          <div className="grid place-items-center">
            <img
              src={src}
              alt={title}
              className="max-h-[75vh] w-auto max-w-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // render ra <body> để tránh bị ảnh hưởng bởi z-index/overflow của layout
  return createPortal(modal, document.body);
}
