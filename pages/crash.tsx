// route for rendering the Crash Game component in a Next.js application.
import dynamic from "next/dynamic";

// Load CrashGame only on the client
const CrashGame = dynamic(() => import("../components/CrashGame/App"), {
  ssr: false,
});

export default function CrashGamePage() {
  return (
    <div
      style={{
        overflowY: "auto",
        maxHeight: "100vh",
      }}
    >
      <CrashGame />
    </div>
  );
}
