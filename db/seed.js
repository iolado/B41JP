import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUserWithPassword } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const users = await Promise.all([
    createUserWithPassword("alice", "password123"),
    createUserWithPassword("bob", "password123"),
  ]);

  for (let i = 1; i <= 20; i++) {
    await createTrack("Track " + i, i * 50000);
  }

  const playlists = await Promise.all([
    createPlaylist("Alice Favorites", "lorem ipsum playlist description", users[0].id),
    createPlaylist("Alice Roadtrip", "lorem ipsum playlist description", users[0].id),
    createPlaylist("Bob Gym Mix", "lorem ipsum playlist description", users[1].id),
    createPlaylist("Bob Chill", "lorem ipsum playlist description", users[1].id),
  ]);

  for (let playlistIndex = 0; playlistIndex < playlists.length; playlistIndex++) {
    const playlist = playlists[playlistIndex];
    const startTrackId = playlistIndex * 5 + 1;

    for (let offset = 0; offset < 5; offset++) {
      await createPlaylistTrack(playlist.id, startTrackId + offset);
    }
  }
}
