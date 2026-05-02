import { useState, useEffect } from "react";

const splashStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@900&display=swap');

  @keyframes flexPulse {
    0%   { transform: scale(1) rotate(-10deg); }
    20%  { transform: scale(1.3) rotate(10deg); }
    40%  { transform: scale(1.1) rotate(-5deg); }
    60%  { transform: scale(1.4) rotate(8deg); }
    80%  { transform: scale(1.2) rotate(-3deg); }
    100% { transform: scale(1) rotate(-10deg); }
  }

  @keyframes shockwave {
    0%   { transform: scale(0.5); opacity: 0.8; }
    100% { transform: scale(3.5); opacity: 0; }
  }

  @keyframes letterDrop {
    0%   { transform: translateY(-80px) scaleY(2); opacity: 0; filter: blur(8px); }
    60%  { transform: translateY(8px) scaleY(0.9); opacity: 1; filter: blur(0); }
    80%  { transform: translateY(-4px) scaleY(1.05); }
    100% { transform: translateY(0) scaleY(1); opacity: 1; }
  }

  @keyframes taglineFade {
    0%   { opacity: 0; letter-spacing: 12px; }
    100% { opacity: 1; letter-spacing: 4px; }
  }

  @keyframes fadeOut {
    0%   { opacity: 1; }
    100% { opacity: 0; }
  }

  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  @keyframes bgPulse {
    0%, 100% { opacity: 0.03; }
    50%       { opacity: 0.07; }
  }

  .splash-wrap {
    position: fixed; inset: 0; z-index: 9999;
    background: #0A0A0A;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    overflow: hidden;
  }

  .splash-wrap.fade-out {
    animation: fadeOut 0.6s ease forwards;
    pointer-events: none;
  }

  .bg-grid {
    position: absolute; inset: 0;
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,85,0,0.05) 40px),
      repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,85,0,0.05) 40px);
    animation: bgPulse 2s ease-in-out infinite;
  }

  .scanline {
    position: absolute; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255,85,0,0.3), transparent);
    animation: scanline 2s linear infinite;
  }

  .emoji-wrap {
    position: relative;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 32px;
  }

  .emoji {
    font-size: 80px;
    animation: flexPulse 1.2s ease-in-out infinite;
    filter: drop-shadow(0 0 20px rgba(255,85,0,0.6));
    position: relative; z-index: 2;
  }

  .wave {
    position: absolute;
    width: 80px; height: 80px;
    border-radius: 50%;
    border: 2px solid rgba(255, 85, 0, 0.6);
    animation: shockwave 1.2s ease-out infinite;
  }
  .wave:nth-child(2) { animation-delay: 0.4s; }
  .wave:nth-child(3) { animation-delay: 0.8s; }

  .title-wrap {
    display: flex; gap: 4px;
    margin-bottom: 16px;
  }

  .letter {
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 72px;
    font-weight: 900;
    line-height: 1;
    background: linear-gradient(135deg, #FF5500 0%, #FFD600 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0;
    animation: letterDrop 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    filter: drop-shadow(0 0 30px rgba(255,85,0,0.4));
  }

  .tagline {
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 11px;
    font-weight: 900;
    color: #555;
    letter-spacing: 4px;
    text-transform: uppercase;
    opacity: 0;
    animation: taglineFade 0.6s ease forwards;
  }

  .bar-wrap {
    margin-top: 48px;
    width: 120px;
    height: 2px;
    background: #1A1A1A;
    border-radius: 2px;
    overflow: hidden;
    opacity: 0;
    animation: taglineFade 0.4s ease forwards;
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #FF5500, #FFD600);
    border-radius: 2px;
    transition: width 0.05s linear;
  }
`;

const LETTERS = ["K", "I", "N", "T", "A", "N"];

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    const barTimer = setTimeout(() => setBarVisible(true), 800);
    return () => clearTimeout(barTimer);
  }, []);

  useEffect(() => {
    if (!barVisible) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onFinish, 600);
          }, 300);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [barVisible]);

  return (
    <>
      <style>{splashStyles}</style>
      <div className={`splash-wrap${fadeOut ? " fade-out" : ""}`}>
        <div className="bg-grid" />
        <div className="scanline" />

        <div className="emoji-wrap">
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
          <div className="emoji">💪</div>
        </div>

        <div className="title-wrap">
          {LETTERS.map((l, i) => (
            <span
              key={l}
              className="letter"
              style={{ animationDelay: `${0.3 + i * 0.08}s` }}
            >
              {l}
            </span>
          ))}
        </div>

        <div
          className="tagline"
          style={{ animationDelay: "0.9s" }}
        >
          筋トレ計測アプリ
        </div>

        <div
          className="bar-wrap"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </>
  );
}
