import { motion, useAnimation } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface MultiplierDisplayProps {
  multiplier: number;
  gameState: string;
}

export function MultiplierDisplay({ multiplier, gameState }: MultiplierDisplayProps) {
  const controls = useAnimation();
  const [prevMultiplier, setPrevMultiplier] = useState(1);
  const [showPulse, setShowPulse] = useState(false);
  
  // Format the multiplier with 2 decimal places
  const displayMultiplier = multiplier.toFixed(2);
  
  // Check significant multiplier milestones
  useEffect(() => {
    // If we crossed a threshold, do a pulse animation
    if (gameState === "flying") {
      const thresholds = [2, 3, 5, 10, 20, 30, 40];
      for (const threshold of thresholds) {
        if (prevMultiplier < threshold && multiplier >= threshold) {
          // Trigger pulse animation
          controls.start({
            scale: [1, 1.15, 1],
            transition: { duration: 0.3 }
          });
          setShowPulse(true);
          setTimeout(() => setShowPulse(false), 300);
          break;
        }
      }
    }
    
    setPrevMultiplier(multiplier);
  }, [multiplier, gameState, controls, prevMultiplier]);
  
  // Get color based on multiplier value - memoize to prevent unnecessary recalculations
  const multiplierStyle = useMemo(() => {
    // Base styles
    let textColor = "text-white";
    let glowColor = "";
    let fontSize = "text-4xl md:text-6xl";
    
    // Color progression based on multiplier
    if (multiplier >= 30) {
      textColor = "text-purple-400";
      glowColor = "drop-shadow-[0_0_10px_rgba(147,51,234,0.7)]";
      fontSize = "text-5xl md:text-7xl";
    } else if (multiplier >= 20) {
      textColor = "text-indigo-400";
      glowColor = "drop-shadow-[0_0_8px_rgba(99,102,241,0.7)]";
      fontSize = "text-5xl md:text-7xl";
    } else if (multiplier >= 10) {
      textColor = "text-blue-400";
      glowColor = "drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]";
      fontSize = "text-5xl md:text-7xl";
    } else if (multiplier >= 5) {
      textColor = "text-green-400";
      glowColor = "drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]";
    } else if (multiplier >= 2) {
      textColor = "text-yellow-400";
      glowColor = "drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]";
    } else if (multiplier >= 1.5) {
      textColor = "text-orange-400";
    }
    
    return { textColor, glowColor, fontSize };
  }, [multiplier]);

  // Get the appropriate animation based on game state
  const getAnimation = () => {
    if (gameState === "crashed") {
      return { 
        scale: [1, 1.5, 1], 
        y: [0, -20, 0],
        color: ["#ffffff", "#ff0000", "#ff0000"]
      };
    }
    
    if (gameState === "flying") {
      return { scale: 1 };
    }
    
    return { scale: 1 };
  };
  
  // Don't show during betting phase
  if (gameState === "betting") {
    return (
      <div className="relative flex flex-col items-center justify-center mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-center text-white opacity-70"
        >
          Ready
        </motion.div>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-1 bg-white/30 rounded-full mt-2 max-w-[200px]"
        />
      </div>
    );
  }
  
  // Crashed state
  if (gameState === "crashed") {
    return (
      <motion.div
        key="crashed"
        initial={{ scale: 1, y: 0 }}
        animate={{ 
          scale: [1, 1.5, 1], 
          y: [0, -20, 0],
        }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center mt-4"
      >
        <div className={`font-bold text-center text-red-500 ${multiplierStyle.fontSize} drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]`}>
          {displayMultiplier}×
        </div>
        
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="h-1 bg-red-500/50 rounded-full mt-2 max-w-[200px]"
        />
      </motion.div>
    );
  }
  
  // Flying state
  return (
    <div className="flex flex-col items-center justify-center mt-4">
      {/* Glow effect when flying */}
      {showPulse && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.5, 2] }}
          transition={{ duration: 0.5 }}
          className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-yellow-300/20 to-orange-500/20 blur-xl"
        />
      )}
      
      <motion.div
        animate={controls}
        className={`font-bold text-center ${multiplierStyle.textColor} ${multiplierStyle.glowColor} ${multiplierStyle.fontSize}`}
      >
        {displayMultiplier}×
      </motion.div>
      
      {/* Progress/stats bar */}
      <div className="flex items-center space-x-1 mt-2">
        {/* Milestone markers */}
        <div className="flex items-center justify-between w-full max-w-[200px] h-2 bg-slate-800/50 rounded-full overflow-hidden">
          {/* Multiplier progress */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((multiplier / 50) * 100, 100)}%` }}
            className="h-full bg-gradient-to-r from-yellow-500 to-red-500"
          />
          
          {/* Milestone markers */}
          <div className="absolute flex justify-between w-full max-w-[200px] px-1">
            {[10, 20, 30, 40].map(mark => (
              <div 
                key={mark} 
                className={`w-0.5 h-2 ${
                  multiplier >= mark ? 'bg-white' : 'bg-white/20'
                }`}
                style={{ left: `${(mark / 50) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Info text */}
      <div className="flex justify-between w-full max-w-[200px] text-xs font-normal text-white/70 mt-1">
        <span>1×</span>
        <span>Max: 50×</span>
      </div>
    </div>
  );
}
