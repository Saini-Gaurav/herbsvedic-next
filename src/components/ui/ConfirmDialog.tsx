"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onCancel} />
      <div className="relative bg-sand rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <h3 className="font-display text-xl text-bark mb-2">{title}</h3>
        <p className="font-body text-sm text-bark/60 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 font-body text-sm text-bark/60 hover:text-bark transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-5 py-2 bg-red-700 text-sand font-body text-sm rounded-full hover:bg-red-800 transition disabled:opacity-50"
          >
            {isConfirming ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}