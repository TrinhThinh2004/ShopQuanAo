import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
  A11y,
  Keyboard,
} from "swiper/modules";

// import ảnh
import banner1 from "../../assets/Banner/banner1.jpg";
import banner2 from "../../assets/Banner/banner2.jpg";
import banner3 from "../../assets/Banner/banner3.jpg";

const BANNERS = [
  { id: 1, url: banner1, alt: "Banner 1" },
  { id: 2, url: banner2, alt: "Banner 2" },
  { id: 3, url: banner3, alt: "Banner 3" },
];

export default function Banner() {
  return (
    // KHUNG GIỐNG FOOTER: max-w-7xl + px-4
    <section className="mx-auto max-w-7xl px-4 py-4">
      {/* Khung chiều cao cố định theo breakpoint */}
      <div className="relative h-[220px] sm:h-[280px] lg:h-[360px]">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, A11y, Keyboard]}
          slidesPerView={1}
          loop
          speed={700}
          keyboard={{ enabled: true }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          navigation={{ prevEl: ".banner-prev", nextEl: ".banner-next" }}
          className="h-full rounded-xl"
        >
          {BANNERS.map((b) => (
            <SwiperSlide key={b.id} className="h-full">
              <BannerImage src={b.url} alt={b.alt} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* arrows */}
        <button
          className="banner-prev absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
          aria-label="Banner trước"
        >
          ‹
        </button>
        <button
          className="banner-next absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
          aria-label="Banner sau"
        >
          ›
        </button>
      </div>
    </section>
  );
}

function BannerImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      {/* bỏ aspect-ratio, dùng chiều cao từ khung cha */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
