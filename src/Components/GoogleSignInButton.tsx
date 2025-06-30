"use client"

interface GoogleSignInButtonProps {
  onClick?: () => void
  disabled?: boolean
  variant?: "standard" | "icon-only"
  size?: "small" | "medium" | "large"
  text?: "signin" | "continue"
}

export default function GoogleSignInButton({
  onClick,
  disabled = false,
  variant = "standard",
  size = "medium",
  text = "signin",
}: GoogleSignInButtonProps) {
  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <path
        fill="#4285F4"
        d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z"
      />
      <path
        fill="#34A853"
        d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-2.7.75c-2.09 0-3.86-1.4-4.49-3.29H1.83v2.07A8 8 0 0 0 8.98 17Z"
      />
      <path
        fill="#FBBC05"
        d="M4.49 10.48A4.77 4.77 0 0 1 4.25 9a4.9 4.9 0 0 1 .24-1.48V5.45H1.83A8 8 0 0 0 .98 9c0 1.3.31 2.52.85 3.55l2.66-2.07Z"
      />
      <path
        fill="#EA4335"
        d="M8.98 3.77c1.18 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 8.98.98a8 8 0 0 0-7.15 4.47l2.66 2.06c.63-1.89 2.4-3.29 4.49-3.29Z"
      />
    </svg>
  )

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-8 px-3 text-sm"
      case "large":
        return "h-12 px-6 text-base"
      default:
        return "h-10 px-4 text-sm"
    }
  }

  const getTextContent = () => {
    if (variant === "icon-only") return null
    return text === "continue" ? "Continue with Google" : "Sign in with Google"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getSizeClasses()}
        bg-white 
        btn
        border-gray-300 
        text-gray-700 
        font-medium 
        hover:bg-gray-50 
        hover:border-gray-400
        focus:bg-gray-50
        disabled:opacity-50 
        disabled:cursor-not-allowed
        transition-all 
        duration-200
        flex 
        items-center 
        justify-center 
        gap-3
        ${variant === "icon-only" ? "w-10" : "min-w-fit"}
      `}
      type="button"
      aria-label={variant === "icon-only" ? "Sign in with Google" : undefined}
    >
      <GoogleIcon />
      {getTextContent()}
    </button>
  )
}
