'use client'
import dynamic from 'next/dynamic';

import Link from "next/link";
// import Room from "./Room";
import { POETRY_ROOM_ID } from "@/partykit/shared";
const Room = dynamic(() => import('./Room'), { ssr: false });

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-start p-6"
      style={{ minHeight: "100dvh" }}
    >
      <h1 className="text-4xl font-semibold pb-6">Magnetic Poetry</h1>
      <Room roomId={POETRY_ROOM_ID} />

      <div className="fixed bottom-3 left-3 text-sm">
        Made with{" "}
        <Link className="underline" href="https://partykit.io">
          PartyKit
        </Link>{" "}
        (
        <Link
          className="underline"
          href="https://github.com/partykit/sketch-magnetic-poetry"
        >
          GitHub
        </Link>
        )
      </div>
    </main>
  );
}
