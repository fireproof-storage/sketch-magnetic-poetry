"use client";

import { useState, useEffect } from "react";
import {
  HumanizeDurationLanguage,
  HumanizeDuration,
} from "humanize-duration-ts";
import usePartySocket from "partysocket/react";
import type { Mosaic, Message, Tile } from "@/partykit/shared";
import ConnectionStatus from "./ConnectionStatus";
import Grid from "./Grid";
import Reset from "./Reset";

const humanizer = new HumanizeDuration(new HumanizeDurationLanguage());
humanizer.addLanguage("shortEn", {
  y: () => "y",
  mo: () => "mo",
  w: () => "w",
  d: () => "d",
  h: () => "h",
  m: () => "m",
  s: () => "s",
  ms: () => "ms",
  decimal: ".",
});

export default function Room(props: { roomId: string }) {
  const { roomId } = props;
  const [mosaic, setMosaic] = useState<null | Mosaic>(null);
  const [turnDue, setTurnDue] = useState(false);
  const [time, setTime] = useState(new Date());

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
    //party: "main",
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

  const startedAgo = Math.max(
    0,
    Math.floor((time.getTime() - new Date(mosaic.startedAt).getTime()) / 1000)
  );
  const startedAgoHuman = humanizer.humanize(startedAgo * 1000, {
    language: "shortEn",
    spacer: "",
  });

  return (
    <>
      <ConnectionStatus socket={socket} />
      <div className="flex flex-col gap-4 justify-start items-center">
        <h2 className="text-3xl font-semibold">
          Draw... <span className="bg-white">{mosaic.challenge}</span>
        </h2>
        <div className="flex flex-row flex-wrap gap-2 text-sm">
          <p>Turns: {mosaic.turns}</p>
          <p>Players: {mosaic.players}</p>
          <p>Started: {startedAgoHuman} ago</p>
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
    </>
  );
}
