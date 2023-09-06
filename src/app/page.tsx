import Room from "./Room";
import { MOSAIC_ROOM_ID } from "@/partykit/shared";

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-start p-6"
      style={{ minHeight: "100dvh" }}
    >
      <h1 className="text-4xl font-semibold pb-6">Mosaic Challenge</h1>
      <Room roomId={MOSAIC_ROOM_ID} />
    </main>
  );
}
