# sketch-mosaic

This is a multiplayer drawing challenge web toy, and can be found at [mosaic-party.vercel.app](https://mosaic-party.vercel.app).

Each turn, a user is asked whether a random tile should be black or white according to a given challenge. All users see the same mosaic, and all users play at the same time. It's fun to see how quickly the image converges... or doesn't.

![image](https://github.com/partykit/sketch-mosaic/assets/265390/284a7f4e-5c86-40f5-8255-25089f3afaf9)

## Experimental!

This app was created during [Matt](https://interconnected.org)'s summer 2023 residency. The purpose is to experiment with multiplayer interactions, and simultaneously see what PartyKit can do. It's called a sketch because it's lightweight and quick, and because we learn something in making it.

## What you'll find here

This app is based on Next.js and PartyKit.

To share state, PartyKit keeps a `Mosaic` object in party-side storage. When a client connects, it receives the entire object in a websocket message called `sync`. When a client makes a turn, the new tile is added to the mosaic, and broadcast to all others in the room as an `update` message.

To see this code:

- server (party-side): `src/partykit/server.ts`
- client: `src/app/Room.ts`
