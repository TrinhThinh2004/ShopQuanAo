import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckSquare,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);

  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirm?: string;
    agree?: string;
  }>({});

  function validate() {
    const next: typeof errors = {};
    if (!fullName.trim()) next.fullName = "Vui lòng nhập họ và tên";
    if (!email.trim()) next.email = "Vui lòng nhập email";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Email không hợp lệ";

    if (!password) next.password = "Vui lòng nhập mật khẩu";
    else if (password.length < 6) next.password = "Tối thiểu 6 ký tự";

    if (!confirm) next.confirm = "Vui lòng nhập lại mật khẩu";
    else if (confirm !== password) next.confirm = "Mật khẩu không khớp";

    if (!agree) next.agree = "Bạn cần đồng ý điều khoản";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // TODO: gọi API đăng ký thật tại đây
    await new Promise((r) => setTimeout(r, 900));

    setLoading(false);
    // eslint-disable-next-line no-alert
    alert("Đăng ký thành công (mock)!");
    navigate("/dang-nhap");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-neutral-100">
      <div className="mx-auto max-w-6xl px-4">
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10 mt-10">
            <div className="border-b px-6 py-6">
              <h1 className="text-center text-xl font-extrabold tracking-wide">
                TẠO TÀI KHOẢN
              </h1>
              <p className="mt-1 text-center text-sm text-neutral-600">
                Hoàn tất thông tin bên dưới để bắt đầu mua sắm.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 px-6 py-6">
              {/* Họ tên */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700">
                  Họ và tên
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <User className="h-5 w-5" />
                  </span>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="h-11 w-full rounded-md border border-neutral-300 pl-10 pr-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                    autoComplete="name"
                    autoFocus
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700">
                  Email
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-md border border-neutral-300 pl-10 pr-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Mật khẩu */}
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
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-neutral-500 hover:bg-neutral-100"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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

              {/* Nhập lại mật khẩu */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700">
                  Nhập lại mật khẩu
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    type={showPw2 ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-md border border-neutral-300 pl-10 pr-11 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-neutral-500 hover:bg-neutral-100"
                    onClick={() => setShowPw2((v) => !v)}
                    aria-label={showPw2 ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPw2 ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirm && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>
                )}
              </div>

              {/* Agree */}
              <label className="mt-1 flex cursor-pointer select-none items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  className="size-4 accent-black"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span className="inline-flex items-center gap-1">
                  <CheckSquare className="h-4 w-4 text-neutral-400" />
                  Tôi đồng ý với{" "}
                  <a
                    className="font-semibold text-sky-600 hover:underline"
                    href="#"
                  >
                    điều khoản & chính sách
                  </a>
                </span>
              </label>
              {errors.agree && (
                <p className="mt-1 text-xs text-red-600">{errors.agree}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                onClick={onSubmit}
                disabled={loading}
                className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-black font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  "ĐĂNG KÝ"
                )}
              </button>

              <div className="pt-1 text-center text-sm">
                Đã có tài khoản?{" "}
                <Link
                  to="/dang-nhap"
                  className="font-semibold text-sky-600 hover:underline"
                >
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
