import { useEffect, useRef } from "react";
type Node = { x: number; y: number; vx: number; vy: number };

export default function Login() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const nodesRef = useRef<Node[]>([]); // ✅ thay cho useState

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const DPI = window.devicePixelRatio || 1;
    canvas.width = w * DPI;
    canvas.height = h * DPI;
    ctx.scale(DPI, DPI);

    const N = Math.round((w * h) / 12000);
    const speed = 0.4;
    const rnd = (min: number, max: number) => Math.random() * (max - min) + min;

    // khởi tạo nodes vào ref, KHÔNG dùng setState
    nodesRef.current = Array.from({ length: N }, () => ({
      x: rnd(0, w),
      y: rnd(0, h),
      vx: rnd(-speed, speed),
      vy: rnd(-speed, speed),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(0, 255, 255, 0.8)";
      ctx.shadowColor = "rgba(0, 255, 255, 0.6)";
      ctx.shadowBlur = 8;
      const maxDist = Math.min(w, h) * 0.15;

      // dùng nodesRef.current
      const nodes = nodesRef.current;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i],
            b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < maxDist) {
            const alpha = 1 - d / maxDist;
            ctx.strokeStyle = `rgba(0,255,255,${0.25 * alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      const dpi = window.devicePixelRatio || 1;
      canvas.width = w * dpi;
      canvas.height = h * dpi;
      ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ... phần JSX giữ nguyên
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-cyan-100">
      {/* moving polygon background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />

      {/* subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.08),transparent_60%)]" />

      {/* title */}
      <div className="relative z-10 flex justify-center pt-10">
        <h1 className="select-none text-3xl font-semibold tracking-wide text-white/90">
          Login Store
        </h1>
      </div>

      {/* card */}
      <div className="relative z-10 mx-auto mt-10 w-[90%] max-w-[420px]">
        <div className="rounded-3xl border border-cyan-500/30 bg-black/40 p-8 backdrop-blur-md shadow-[0_0_40px_rgba(0,255,255,0.25)]">
          <h2 className="mb-1 text-center text-cyan-300 tracking-[0.2em]">
            LOGIN
          </h2>
          <p className="mb-6 text-center text-sm text-cyan-100/70">
            Welcome Back
          </p>

          {/* Username */}
          <label className="mb-1 block text-xs uppercase tracking-widest text-cyan-100/70">
            Username
          </label>
          <div className="relative mb-5">
            <input
              type="text"
              className="peer input-neon w-full rounded-md bg-transparent px-0 py-2
               text-cyan-50 placeholder:text-cyan-200/30 caret-neon text-neon
               selection:bg-cyan-500/20"
              placeholder=" "
            />
            <span className="uline-track"></span>
            {/* chạy khi focus */}
            <span className="uline-sweep peer-focus:animate-uline"></span>
          </div>

          {/* Password */}
          <label className="mb-1 block text-xs uppercase tracking-widest text-cyan-100/70">
            Password
          </label>
          <div className="relative mb-4">
            <input
              type="password"
              className="peer input-neon w-full rounded-md bg-transparent px-0 py-2
               text-cyan-50 placeholder:text-cyan-200/30 caret-neon text-neon
               selection:bg-cyan-500/20"
              placeholder=" "
            />
            <span className="uline-track"></span>
            <span className="uline-sweep peer-focus:animate-uline"></span>
          </div>

          {/* options */}
          <div className="mb-6 flex items-center justify-between text-sm">
            <label className="inline-flex select-none items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 appearance-none rounded-[4px] border border-cyan-400/50 bg-transparent checked:bg-cyan-400 checked:shadow-[0_0_10px_rgba(0,255,255,0.8)]"
              />
              <span className="text-cyan-100/80">Remember me</span>
            </label>
            <button className="text-cyan-300/80 underline-offset-4 hover:text-cyan-200 hover:underline">
              Forgot Password?
            </button>
          </div>

          {/* button */}
          <button className="group relative w-full overflow-hidden rounded-xl border border-cyan-400/50 bg-cyan-400/10 px-6 py-3 font-medium tracking-wide text-cyan-50 shadow-[0_0_20px_rgba(0,255,255,0.25)] transition-colors hover:bg-cyan-400/20">
            <span className="relative z-10">SIGN IN</span>
            {/* sweep light */}
            <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/20 blur-sm transition-transform duration-500 group-hover:translate-x-[250%]" />
          </button>

          {/* footer */}
          <p className="mt-6 text-center text-sm text-cyan-100/70">
            Don’t have an account?{" "}
            <a className="text-cyan-300 hover:underline" href="/dang-ky">
              Register
            </a>
          </p>
        </div>

        {/* glowing frame */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl blur-2xl [box-shadow:0_0_120px_20px_rgba(0,255,255,0.15)]" />
      </div>
    </div>
  );
}
