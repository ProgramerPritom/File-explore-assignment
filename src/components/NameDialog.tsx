"use client";

import { useEffect, useRef, useState } from "react";
import { nameErrorMessage } from "@/lib/names";
import type { NameError } from "@/lib/types";
import { Modal } from "./Modal";

type NameDialogProps = {
  title: string;
  label: string;
  initialValue: string;
  confirmLabel: string;
  onCancel: () => void;
  onSubmit: (name: string) => NameError;
};

export function NameDialog({
  title,
  label,
  initialValue,
  confirmLabel,
  onCancel,
  onSubmit,
}: NameDialogProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<NameError>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = onSubmit(value);
    if (result) {
      setError(result);
      return;
    }
  }

  return (
    <Modal title={title} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm text-slate-700">
          {label}
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError(null);
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </label>
        {error ? (
          <p className="text-sm text-rose-600">{nameErrorMessage(error)}</p>
        ) : null}
        <div className="mt-1 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-700"
          >
            {confirmLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
