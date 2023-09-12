import { useEffect, useState } from "react";
import type { Tile } from "@/partykit/shared";

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
  }, [turnDue, size]);

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
          : tile?.color === "black"
          ? `bg-black`
          : "bg-white/50";
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
      <div className="h-10 flex flex-row gap-3 justify-center items-center">
        {turnDue && (
          <>
            <div>
              <span className="font-semibold">Choose!</span> Should the red tile
              be...
            </div>
            <button
              className="w-8 h-8 bg-black outline outline-4 outline-red-500/20 hover:outline-red-500"
              onClick={() => handleTileDecision("black")}
            ></button>
            <button
              className="w-8 h-8 bg-white/50 outline outline-4 outline-red-500/20 hover:outline-red-500"
              onClick={() => handleTileDecision("white")}
            ></button>
          </>
        )}
        {!turnDue && <span className="italic">Waiting...</span>}
      </div>
    </div>
  );
}
