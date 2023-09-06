"use client";

import { useState, useEffect } from "react";
import usePartySocket from "partysocket/react";
import type { Mosaic, Message, Tile } from "@/partykit/shared";
import Grid from "./Grid";
import Reset from "./Reset";

const host = process.env.NEXT_PUBLIC_PARTYKIT_HOST!;
const protocol =
  host?.startsWith("localhost") || host?.startsWith("127.0.0.1")
    ? "http"
    : "https";

const party = "sketch-mosaic";

export default function Room(props: { roomId: string }) {
  const { roomId } = props;
  const [mosaic, setMosaic] = useState<null | Mosaic>(null);
  const [turnDue, setTurnDue] = useState(false);
  const [time, setTime] = useState(new Date());

  const socket = usePartySocket({
    host: host,
    //party: party,
    room: roomId,
    onMessage: (message) => {
      const msg = JSON.parse(message.data as string) as Message;
      if (msg.type === "sync") {
        setMosaic(msg.mosaic);
        setTurnDue(true);
      } else if (msg.type === "update") {
        if (!mosaic) return;
        const newTiles = { ...mosaic.tiles };
        newTiles[`${msg.tile.i},${msg.tile.j}`] = msg.tile;
        const newMosaic = {
          ...mosaic,
          tiles: newTiles,
          turns: msg.turns,
          players: msg.players,
        };
        setMosaic(newMosaic);
        setTurnDue(true);
      }
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mosaic) {
    return <div>Loading...</div>;
  }

  const handleTurn = (tile: Tile) => {
    setTurnDue(false);
    socket.send(
      JSON.stringify({
        type: "turn",
        tile: tile,
      })
    );
  };

  const handleReset = () => {
    socket.send(
      JSON.stringify({
        type: "reset",
      })
    );
  };

  const startedAgo = Math.floor(
    (time.getTime() - new Date(mosaic.startedAt).getTime()) / 1000
  );

  return (
    <div className="flex flex-col gap-4 justify-start items-center">
      <h2 className="text-3xl font-semibold">
        Draw... <span className="bg-white">{mosaic.challenge}</span>
      </h2>
      <div className="flex flex-row gap-2 text-sm">
        <p>Turns: {mosaic.turns}</p>
        <p>Players: {mosaic.players}</p>
        <p>Started: {startedAgo}s ago</p>
      </div>
      <Grid
        size={mosaic.size}
        tiles={mosaic.tiles}
        turnDue={turnDue}
        handleTurn={handleTurn}
      />
      <div className="mt-12">
        <Reset handleReset={handleReset} />
      </div>
    </div>
  );
}
