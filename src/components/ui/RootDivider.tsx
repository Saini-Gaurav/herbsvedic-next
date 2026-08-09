export default function RootDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center py-2 ${className}`} aria-hidden="true">
      <svg width="160" height="16" viewBox="0 0 160 16" fill="none">
        <path
          d="M0 8 C 20 8, 25 2, 45 8 S 70 14, 80 8 S 105 2, 120 8 S 145 14, 160 8"
          stroke="#C89B3C"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  );
}