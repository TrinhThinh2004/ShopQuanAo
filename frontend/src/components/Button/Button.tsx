import type {
  ReactElement,
  ReactNode,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";

type CommonProps = {
  children?: ReactNode; // mặc định "Xem tất cả"
  className?: string; // thêm class ngoài nếu cần
};

// Nếu có href => render <a>, ngược lại render <button>
type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type Props = ButtonAsLink | ButtonAsButton;

export default function Button(props: Props): ReactElement {
  const base =
    // kích thước & layout
    "inline-flex items-center justify-center w-[120px] h-[40px] py-2 px-3 " +
    // màu & hover đảo màu
    "bg-neutral-900 text-white hover:bg-white hover:text-black " +
    // bo góc, bóng, viền, focus ring
    "rounded shadow-sm ring-1 ring-black/10 hover:ring-black/20 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 " +
    // hiệu ứng
    "transition-all duration-200 ease-out active:scale-[0.98] " +
    // typo
    "text font-semibold tracking-wide select-none cursor-pointer";

  const content = <span>{props.children ?? "Xem tất cả"}</span>;

  if ("href" in props && props.href) {
    const { className = "", href, ...rest } = props as ButtonAsLink; // ❌ không destructure children
    return (
      <a href={href} className={`${base} ${className}`} {...rest}>
        {content}
      </a>
    );
  }

  const { className = "", ...rest } = props as ButtonAsButton; // ❌ không destructure children
  return (
    <button className={`${base} ${className}`} {...rest}>
      {content}
    </button>
  );
}
