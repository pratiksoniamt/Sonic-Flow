import React from 'react';
import ReactPlayer from 'react-player';
import { useMusicStore } from '../store/useMusicStore';

const Player = ReactPlayer as any;

export function CorePlayer() {
  const { currentTrack, isPlaying, volume, isMuted, playNext, setProgress } = useMusicStore();
  const playerRef = React.useRef<any>(null);
  const [isReady, setIsReady] = React.useState(false);

  // Reset ready state when track changes
  React.useEffect(() => {
    setIsReady(false);
  }, [currentTrack?.id]);

  if (!currentTrack) return null;

  return (
    <div className="hidden pointer-events-none w-0 h-0 overflow-hidden">
      <Player
        ref={playerRef}
        url={currentTrack.url}
        playing={isPlaying && isReady}
        volume={volume}
        muted={isMuted}
        onReady={() => setIsReady(true)}
        onEnded={playNext}
        onProgress={(state: any) => setProgress(state.played)}
        config={{
          youtube: {
            playerVars: { 
              autoplay: 1,
              controls: 0,
              modestbranding: 1,
              rel: 0
            }
          }
        }}
        width="0"
        height="0"
      />
    </div>
  );
}
