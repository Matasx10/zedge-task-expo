import { createVideoPlayer, VideoPlayer } from "expo-video";

class VideoManager {
  private pool: VideoPlayer[];

  constructor(size = 6) {
    console.log("POOO:::??");
    this.pool = Array.from({ length: size }).map(() => createVideoPlayer(null));
  }

  getPlayer(index: number) {
    return this.pool[index % this.pool.length];
  }
}

export const videoManager = new VideoManager(6);
