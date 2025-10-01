// src/pages/Login.tsx
import CanvasPolygons from "./_Components/CanvasPolygons";

export default function Login() {
  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-black text-cyan-100">
      {/* Nền đa giác động */}
      <CanvasPolygons />

      {/* Vignette nhẹ */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.08),transparent_60%)]" />

      {/* Căn giữa dọc/ngang cho cân đối */}
      <div className="relative z-10 grid min-h-svh place-items-center px-4">
        <section className="relative w-[min(92svw,360px)] md:w-[min(70svw,420px)]">
          <div className="rounded-2xl border border-cyan-500/30 bg-black/40 p-5 md:p-6 backdrop-blur-md shadow-[0_0_28px_rgba(0,255,255,0.22)]">
            {/* Title */}
            <h1 className="mb-1 text-center text-[clamp(1.1rem,3.4vw,1.4rem)] font-semibold text-white/90">
              Login Store
            </h1>
            <p className="mb-4 text-center text-[clamp(.8rem,2.4vw,.9rem)] text-cyan-100/70">
              Welcome back
            </p>

            {/* Username */}
            <label className="mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70">
              Username
            </label>
            <div className="relative mb-3.5">
              <input
                type="text"
                autoComplete="username"
                className="peer input-neon w-full rounded-md bg-transparent px-0 py-2
                           text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-50 placeholder:text-cyan-200/30
                           caret-neon text-neon selection:bg-cyan-500/20"
                placeholder=" "
              />
              <span className="uline-track uline-slim"></span>
              <span className="uline-sweep uline-slim peer-focus:animate-uline"></span>
            </div>

            {/* Password */}
            <label className="mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70">
              Password
            </label>
            <div className="relative mb-4">
              <input
                type="password"
                autoComplete="current-password"
                className="peer input-neon w-full rounded-md bg-transparent px-0 py-2
                           text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-50 placeholder:text-cyan-200/30
                           caret-neon text-neon selection:bg-cyan-500/20"
                placeholder=" "
              />
              <span className="uline-track uline-slim"></span>
              <span className="uline-sweep uline-slim peer-focus:animate-uline"></span>
            </div>

            {/* options */}
            <div className="mb-5 flex items-center justify-between text-[clamp(.82rem,2.4vw,.9rem)]">
              <label className="inline-flex select-none items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 appearance-none rounded-[4px] border border-cyan-400/50 bg-transparent
                             checked:bg-cyan-400 checked:shadow-[0_0_8px_rgba(0,255,255,0.8)]"
                />
                <span className="text-cyan-100/80">Remember me</span>
              </label>
              <button className="text-cyan-300/80 underline-offset-4 hover:text-cyan-200 hover:underline">
                Forgot Password?
              </button>
            </div>

            {/* CTA */}
            <button
              className="group relative w-full overflow-hidden rounded-xl border border-cyan-400/50
                         bg-cyan-400/10 px-5 py-2.5 text-[clamp(.9rem,2.6vw,.95rem)] font-medium tracking-wide text-cyan-50
                         shadow-[0_0_16px_rgba(0,255,255,0.22)] transition-colors hover:bg-cyan-400/20"
            >
              <span className="relative z-10">SIGN IN</span>
              <span
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/20 blur-sm
                               transition-transform duration-500 group-hover:translate-x-[250%]"
              />
            </button>

            {/* footer */}
            <p className="mt-4 text-center text-[clamp(.82rem,2.4vw,.9rem)] text-cyan-100/70">
              Don’t have an account?{" "}
              <a className="text-cyan-300 hover:underline" href="/dang-ky">
                Register
              </a>
            </p>
          </div>

          {/* outer glow gọn */}
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-xl [box-shadow:0_0_80px_14px_rgba(0,255,255,0.13)]" />
        </section>
      </div>
    </div>
  );
}
