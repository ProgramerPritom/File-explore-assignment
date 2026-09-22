"use client";

import dynamic from "next/dynamic";

const Explorer = dynamic(
  () => import("@/components/Explorer").then((mod) => mod.Explorer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-dvh items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading workspace platform…
      </div>
    ),
  },
);

export default function Home() {
  return <Explorer />;
}