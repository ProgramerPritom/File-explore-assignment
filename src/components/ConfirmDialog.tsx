"use client";

import { Modal } from "./Modal";

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  danger = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm leading-6 text-slate-600">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium text-white ${
            danger
              ? "bg-rose-600 hover:bg-rose-700"
              : "bg-sky-600 hover:bg-sky-700"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
