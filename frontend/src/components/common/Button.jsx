import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

const variantStyles = {
  primary: "bg-primary text-white hover:bg-secondary",
  outline:
    "border border-primary bg-transparent text-primary hover:bg-primary hover:text-white",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
};

const Button = ({
  to,
  href,
  title,
  children,
  className,
  variant = "primary",
  leftIcon,
  rightIcon,
  type = "button",
  ...props
}) => {
  const mergedClassName = twMerge(
    baseStyles,
    variantStyles[variant] || variantStyles.primary,
    className,
  );

  const content = (
    <>
      {leftIcon}
      <span>{children || title}</span>
      {rightIcon}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={mergedClassName} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={mergedClassName} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={mergedClassName} {...props}>
      {content}
    </button>
  );
};

export default Button;
