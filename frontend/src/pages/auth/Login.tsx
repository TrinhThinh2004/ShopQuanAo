import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  function validate() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Vui lòng nhập email hoặc số điện thoại";
    if (!password) next.password = "Vui lòng nhập mật khẩu";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // TODO: gọi API thực tế ở đây
    await new Promise((r) => setTimeout(r, 900));

    setLoading(false);
    // eslint-disable-next-line no-alert
    alert("Đăng nhập thành công (mock)!");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-neutral-100">
      {/* Nếu Header của bạn là fixed, có thể thêm pt-28 để tránh đè: */}
      {/* <div className="pt-28"> */}
      <div className="mx-auto max-w-6xl px-4">
        {/* Center wrapper */}
        <div className="min-h-[80vh] flex items-center justify-center">
          {/* Card */}
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10">
            {/* Header */}
            <div className="border-b px-6 py-6">
              <h1 className="text-center text-xl font-extrabold tracking-wide">
                ĐĂNG NHẬP TÀI KHOẢN
              </h1>
              <p className="mt-1 text-center text-sm text-neutral-600">
                Nhập email/điện thoại và mật khẩu của bạn:
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4 px-6 py-6">
              {/* Email */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700">
                  Email hoặc số điện thoại
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email hoặc số điện thoại"
                    className="h-11 w-full rounded-md border border-neutral-300 pl-10 pr-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                    autoComplete="username"
                    disabled={loading}
                    autoFocus
                    aria-label="Email hoặc số điện thoại"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-md border border-neutral-300 pl-10 pr-11 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                    autoComplete="current-password"
                    disabled={loading}
                    aria-label="Mật khẩu"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-neutral-500 hover:bg-neutral-100"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    disabled={loading}
                  >
                    {showPw ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-black font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "ĐĂNG NHẬP"
                )}
              </button>

              {/* Links */}
              <div className="pt-1 text-center text-sm">
                <div>
                  Khách hàng mới?{" "}
                  <Link
                    to="/dang-ky"
                    className="font-semibold text-sky-600 hover:underline"
                  >
                    Tạo tài khoản
                  </Link>
                </div>
                <div className="mt-1">
                  Quên mật khẩu?{" "}
                  <Link
                    to="/quen-mat-khau"
                    className="font-semibold text-sky-600 hover:underline"
                  >
                    Khôi phục mật khẩu
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
