import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crash Game - High Stakes Betting',
  description: 'Experience the thrill of our crash betting game. Watch the multiplier rise and cash out before it crashes!',
  keywords: 'crash game, betting, gambling, multiplier, casino',
};

export default function CrashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="crash-game-layout">
      {children}
    </div>
  );
}