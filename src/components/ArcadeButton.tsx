import type { ReactNode } from "react";

function playArcadeSound(variant: "primary" | "secondary") {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

  const play = () => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (variant === "primary") {
      osc.type = "square";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else {
      osc.type = "square";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  };

  if (ctx.state === "suspended") {
    ctx.resume().then(play);
  } else {
    play();
  }
}

interface ArcadeButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

/**
 * Botón estilo arcade de los 90.
 * - "primary": botón grande JUGAR, con relieve y vibración al hover.
 * - "secondary": botones más pequeños (Ver intro, Opciones...).
 */
export function ArcadeButton({
  children,
  onClick,
  variant = "secondary",
  disabled = false,
}: ArcadeButtonProps) {
  const base =
    "font-pixel uppercase tracking-wider transition-transform duration-100 select-none border-4 active:translate-y-1";

  const primary =
    "px-10 py-4 text-xl sm:text-2xl text-[var(--pi-bg)] bg-[var(--pi-orange)] border-[var(--pi-cream)] shadow-[0_6px_0_var(--pi-orange-dim)] active:shadow-none pi-shake-hover";

  const secondary =
    "px-4 py-2 text-[10px] sm:text-xs text-[var(--pi-cream)] bg-[var(--pi-brown)] border-[var(--pi-brown-dark)] shadow-[0_4px_0_var(--pi-brown-dark)] active:shadow-none hover:bg-[var(--pi-brown-dark)] hover:text-[var(--pi-orange)]";

  const disabledStyles = "opacity-40 cursor-not-allowed pointer-events-none";

  const handleClick = () => {
    playArcadeSound(variant);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${base} ${variant === "primary" ? primary : secondary} ${
        disabled ? disabledStyles : "cursor-pointer"
      }`}
    >
      {children}
    </button>
  );
}
