import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

interface PlaneProps {
  gameState: string;
  multiplier: number;
  cashoutMultiplier: number;
}

export function Plane({
  gameState,
  multiplier,
  cashoutMultiplier,
}: PlaneProps) {
  const controls = useAnimationControls();
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const prevMultiplierRef = useRef(1);
  const [planePosition, setPlanePosition] = useState({ x: 50, y: 450 });

  // Create flight path (simpler path for better visualization)
  const flightPath = "M50,450 Q200,300 400,200 Q600,100 800,50";

  // Update plane position based on multiplier
  useEffect(() => {
    if (gameState !== "flying") return;

    // Calculate the position along the path
    // Using logarithmic scale for better visualization
    const progress = Math.log(multiplier) / Math.log(50); // log base 50
    const normalizedProgress = Math.min(1, Math.max(0, progress));

    // Update plane position
    if (pathRef.current) {
      const path = pathRef.current;
      const pathLength = path.getTotalLength();
      const point = path.getPointAtLength(pathLength * normalizedProgress);

      // Update plane position
      setPlanePosition({ x: point.x, y: point.y });

      // Get tangent by using nearby points
      const epsilon = 0.01;
      const point1 = path.getPointAtLength(
        pathLength * Math.max(0, normalizedProgress - epsilon)
      );
      const point2 = path.getPointAtLength(
        pathLength * Math.min(1, normalizedProgress + epsilon)
      );

      // Calculate angle from tangent
      const angle =
        Math.atan2(point2.y - point1.y, point2.x - point1.x) * (180 / Math.PI);

      // Apply rotation to plane
      if (planeRef.current) {
        planeRef.current.style.transform = `rotate(${angle}deg)`;
      }
    }

    prevMultiplierRef.current = multiplier;
  }, [multiplier, gameState]);

  // Reset plane on game state change
  useEffect(() => {
    if (gameState === "betting" || gameState === "idle") {
      // Reset to starting position
      if (pathRef.current) {
        const path = pathRef.current;
        const startPoint = path.getPointAtLength(0);
        setPlanePosition({ x: startPoint.x, y: startPoint.y });
      }

      if (planeRef.current) {
        planeRef.current.style.transform = "rotate(0deg)";
      }
    }

    // Add crash animation
    if (gameState === "crashed") {
      controls.start({
        y: 300, // Move down
        rotate: 90, // Rotate downward
        opacity: [1, 0.8, 0.6, 0.4, 0], // Fade out
        transition: {
          duration: 1,
          ease: "easeIn",
        },
      });
    } else {
      controls.start({
        y: 0,
        rotate: 0,
        opacity: 1,
        transition: { duration: 0.3 },
      });
    }
  }, [gameState, controls]);

  // Console log to debug plane position
  // useEffect(() => {
  //   console.log("Plane position:", planePosition);
  // }, [planePosition]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Flight path (visible dotted line) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 900 500"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d={flightPath}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="3"
          strokeDasharray="5,5"
        />
      </svg>

      {/* Container for the plane */}
      <div className="absolute top-0 left-0 w-full h-full overflow-visible">
        {/* Plane - positioned absolutely based on SVG coordinates */}
        <motion.div
          animate={controls}
          style={{
            position: "absolute",
            left: planePosition.x,
            top: planePosition.y,
            transformOrigin: "center center",
            zIndex: 50,
          }}
        >
          <motion.div
            ref={planeRef}
            className={`w-28 h-28 flex items-center justify-center -mt-14 -ml-14
              ${
                gameState === "crashed"
                  ? "text-red-500"
                  : cashoutMultiplier > 0
                  ? "text-green-500"
                  : "text-yellow-300"
              }`}
          >
            {/* Glow effect behind bird for visibility */}
            <div className="absolute inset-0 rounded-full bg-white/40 blur-md" />

            {/* Bird SVG - Much larger and more visible */}
            <svg
              viewBox="0 0 24 24"
              width="100%"
              height="100%"
              fill="currentColor"
              strokeWidth="0.5"
              stroke="#000"
              className={
                gameState === "crashed" ? "animate-spin" : "animate-fly"
              }
              style={{ filter: "drop-shadow(0 0 15px rgba(255,255,255,0.9))" }}
            >
              <path d="M23,11C22.14,11 21.35,11.32 20.75,11.83C20.38,11.32 19.89,10.91 19.31,10.63C19.75,10.33 20.09,9.89 20.27,9.37C20.45,8.84 20.45,8.28 20.27,7.76C20.09,7.24 19.75,6.8 19.31,6.5C18.87,6.2 18.35,6.03 17.8,6.03C17.24,6.03 16.73,6.2 16.29,6.5C15.84,6.8 15.5,7.23 15.33,7.76C15.15,8.29 15.15,8.85 15.33,9.37C15.5,9.89 15.84,10.33 16.29,10.63C15.57,10.97 15,11.57 14.68,12.32C14.15,12.12 13.58,12 13,12C12.24,12 11.5,12.18 10.85,12.5L14.68,8.68C14.86,8.5 15,8.28 15.08,8.03C15.14,7.79 15.14,7.53 15.08,7.28C15,7.04 14.86,6.82 14.68,6.64C14.5,6.46 14.28,6.32 14.03,6.24C13.79,6.18 13.53,6.18 13.28,6.24C13.04,6.32 12.82,6.46 12.64,6.64L10.87,8.41C10.82,8.17 10.78,7.92 10.73,7.67C10.64,7.17 10.5,6.67 10.3,6.19C10.1,5.71 9.85,5.27 9.54,4.86C9.24,4.45 8.89,4.09 8.5,3.77C8.12,3.44 7.68,3.18 7.23,2.97C6.77,2.76 6.28,2.62 5.79,2.55C5.29,2.47 4.79,2.47 4.29,2.54C3.79,2.61 3.31,2.75 2.85,2.96C3.09,3.78 3.44,4.55 3.89,5.26C4.24,5.83 4.66,6.36 5.13,6.81C5.46,7.15 5.81,7.44 6.19,7.7L4.12,9.77C3.91,9.97 3.76,10.24 3.69,10.53C3.62,10.83 3.64,11.14 3.75,11.42C3.86,11.71 4.04,11.97 4.29,12.15C4.54,12.34 4.83,12.46 5.14,12.5C5.38,12.74 5.68,12.92 6,13C6.83,14.74 8.77,16 11,16C12.96,16 14.69,15.07 15.58,13.67C15.92,13.25 16.17,12.76 16.33,12.24C16.65,12.09 16.94,11.87 17.17,11.6C17.39,11.33 17.56,11.02 17.67,10.69C17.77,10.36 17.8,10.01 17.75,9.67C18.81,9.95 19.94,9.65 20.72,8.86C21.35,9.37 22.14,9.69 23,9.69V11Z" />
            </svg>

            {/* Wing flap animation */}
            {gameState === "flying" && (
              <div className="absolute -left-5 -top-2 w-12 h-12 opacity-75">
                <div className="w-full h-full animate-pulse">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="animate-fly"
                  >
                    <path d="M13,4A4,4 0 0,1 17,8A4,4 0 0,1 13,12A4,4 0 0,1 9,8A4,4 0 0,1 13,4M13,14C16.67,14 24,15.5 24,19V22H2V19C2,15.5 9.33,14 13,14Z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Trail effect when flying */}
            {gameState === "flying" && cashoutMultiplier === 0 && (
              <div className="absolute -bottom-20 left-0 transform -translate-x-16 z-10">
                <div className="w-44 h-10 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full blur-md opacity-60" />
              </div>
            )}

            {/* Green trail when cashed out */}
            {cashoutMultiplier > 0 && (
              <div className="absolute -bottom-16 -left-24 z-20">
                <div className="w-48 h-14 bg-gradient-to-r from-transparent to-green-500/70 rounded-full blur-md" />
              </div>
            )}

            {/* Smoke/fire when crashed */}
            {gameState === "crashed" && (
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="w-20 h-20 bg-gradient-to-t from-red-600 to-orange-400 rounded-full blur-md animate-pulse" />
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs font-bold text-red-500">
                  CRASH!
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Debug info for development */}
      <div className="absolute bottom-2 left-2 text-xs text-white/40">
        X: {Math.round(planePosition.x)} Y: {Math.round(planePosition.y)}
      </div>
    </div>
  );
}
