import { Shuffle } from "lucide-react";
import { useState } from "react";

export default function OptionsButton({
  playbackSpeed,
  isShuffleMode,
  toggleShuffleMode,
  togglePlaybackSpeed,
}: {
  playbackSpeed: string;
  isShuffleMode: boolean;
  toggleShuffleMode: () => void;
  togglePlaybackSpeed: () => void;
}) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="relative">
      {/* Main Options Button */}
      <div
        className="ios-glass rounded-full p-1.5 backdrop-blur-md bg-white/10 border border-white/15 shadow-lg shadow-black/20 
      hover:shadow-xl hover:shadow-black/30 transition-all duration-300 hover:bg-white/15 w-12 h-12 flex items-center justify-center"
      >
        <button
          className="text-white/70 hover:text-white rounded-full transition-all duration-200 hover:scale-105 active:scale-95 w-10 h-10 flex items-center justify-center"
          onClick={() => setShowOptions((v) => !v)}
          title="Player Options"
        >
          {/* Dots or Gear icon or menu icon */}
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <circle cx="4" cy="10" r="2" fill="#fff" />
            <circle cx="10" cy="10" r="2" fill="#fff" />
            <circle cx="16" cy="10" r="2" fill="#fff" />
          </svg>
        </button>
      </div>
      {/* Option Popup */}
      {showOptions && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 min-w-max">
          <div className="ios-glass rounded-xl p-3 backdrop-blur-md bg-white/10 border border-white/15 shadow-lg flex flex-col gap-2">
            {/* Speed Control */}
            <button
              className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-white/15 transition-all"
              onClick={() => {
                togglePlaybackSpeed();
                setShowOptions(false);
              }}
              title={`Playback speed: ${playbackSpeed} ${
                playbackSpeed === "slow"
                  ? "(0.75x)"
                  : playbackSpeed === "normal"
                  ? "(1x)"
                  : "(1.25x)"
              }`}
            >
              <span className="font-medium text-white/80">Speed</span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/80 font-semibold">
                {/* Dynamic speed text */}
                {playbackSpeed === "slow"
                  ? "0.75x (Slow)"
                  : playbackSpeed === "normal"
                  ? "1x (Normal)"
                  : "1.25x (Fast)"}
              </span>
            </button>
            {/* Shuffle Toggle */}
            <button
              className={`flex items-center gap-2 rounded-full px-3 py-2 transition-all ${
                isShuffleMode
                  ? "bg-white/15 text-white"
                  : "hover:bg-white/10 text-white/80"
              }`}
              onClick={() => {
                toggleShuffleMode();
                setShowOptions(false);
              }}
              title={isShuffleMode ? "Shuffle: ON" : "Shuffle: OFF"}
            >
              <Shuffle className="h-4 w-4" />
              <span className="font-medium">
                {isShuffleMode ? "Shuffle (ON)" : "Shuffle (OFF)"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
