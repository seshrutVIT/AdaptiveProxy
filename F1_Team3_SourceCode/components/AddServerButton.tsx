"use client";

import { addServer } from "@/lib/api-client";

interface AddServerButtonProps {
  isDisabled: boolean;
  onAdded: () => void;
}

export default function AddServerButton({ isDisabled, onAdded }: AddServerButtonProps) {
  async function handleClick() {
    await addServer();
    onAdded();
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className="rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
    >
      Add server
    </button>
  );
}
