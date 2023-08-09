import { useEffect, useState } from "react";
import type { Tile } from "@/partykit/types";

export default function Grid(props: {
  size: number;
  tiles: Record<string, Tile>;
  turnDue: boolean;
  handleTurn: (tile: Tile) => void;
}) {
  const { size, tiles, turnDue, handleTurn } = props;
  // tile key in the form of "i,j"
  const [tileInPlay, setTileInPlay] = useState<null | [number, number]>(null);

  useEffect(() => {
    if (turnDue) {
      // Choose a random tile to play
      const i = Math.floor(Math.random() * size);
      const j = Math.floor(Math.random() * size);
      setTileInPlay([i, j]);
    } else {
      setTileInPlay(null);
    }
  }, [turnDue]);

  const tileInPlayKey = tileInPlay?.join(",");
  // grid is an array of JSX elements, and it needs to be typed properly
  const grid: JSX.Element[] = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const tileKey = `${i},${j}`;
      const tile = tiles[tileKey];
      const tileColor =
        tileKey === tileInPlayKey
          ? "bg-red-500"
          : tile?.color
          ? `bg-${tile.color}`
          : "bg-black/10";
      row.push(<div key={`${i},${j}`} className={`w-5 h-5 ${tileColor}`} />);
    }
    grid.push(
      <div key={i} className="flex flex-row gap-1">
        {row}
      </div>
    );
  }

  const handleTileDecision = (color: "black" | "white") => {
    if (!tileInPlay) return;
    const tile = {
      i: tileInPlay[0],
      j: tileInPlay[1],
      color: color,
    } as Tile;
    console.log("tile", tile);
    handleTurn(tile);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">{grid}</div>
      {turnDue && (
        <div className="flex flex-row gap-1 justify-center items-center">
          <div className="">Should the highlighted tile be...</div>
          <button
            className="w-8 h-8 bg-black"
            onClick={() => handleTileDecision("black")}
          ></button>
          <button
            className="w-8 h-8 bg-white"
            onClick={() => handleTileDecision("white")}
          ></button>
        </div>
      )}
    </div>
  );
}
