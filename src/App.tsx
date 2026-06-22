import { useEffect, useRef, useState } from "react";
import { StartScreen } from "./components/StartScreen";
import { IntroSequence } from "./components/IntroSequence";
import { LevelPreview } from "./components/LevelPreview";
import { CharacterSelect } from "./components/CharacterSelect";

type Screen = "start" | "select" | "intro" | "level";

// Pantallas donde suena la música
const MUSIC_SCREENS: Screen[] = ["start", "select", "intro", "level"];

function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (MUSIC_SCREENS.includes(screen)) {
      audio.volume = 0.6;
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [screen]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    setMuted(!muted);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-black p-2 sm:p-6">
      <audio ref={audioRef} src="/music-start.mpeg" loop />
      {/* Marco "monitor arcade" — formato 16:9 en escritorio, fluido en móvil */}
      <div className="crt-screen w-full max-w-5xl h-[92vh] sm:h-auto sm:aspect-video border-4 sm:border-8 border-[var(--pi-brown-dark)] rounded-md">
        {screen === "start" && (
          <StartScreen
            onPlay={() => setScreen("intro")}
            onSelectCharacter={() => setScreen("select")}
            onToggleMute={toggleMute}
            muted={muted}
          />
        )}

        {screen === "select" && (
          <CharacterSelect
            onConfirm={() => setScreen("intro")}
            onBack={() => setScreen("start")}
          />
        )}

        {screen === "intro" && (
          <IntroSequence
            onFinished={() => setScreen("level")}
            onToggleMute={toggleMute}
            muted={muted}
          />
        )}

        {screen === "level" && (
          <LevelPreview onBackToStart={() => setScreen("start")} />
        )}
      </div>
    </div>
  );
}

export default App;
