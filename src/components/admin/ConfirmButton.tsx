"use client";

export default function ConfirmButton({ message, children, className = "a-btn danger" }: { message: string; children: React.ReactNode; className?: string }) {
  return (
    <button suppressHydrationWarning
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
