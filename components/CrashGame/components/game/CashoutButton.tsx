import { useCrashGame } from "../../lib/stores/useCrashGame";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// import { ToastContainer, toast } from "react-toastify";

export function CashoutButton() {
  const { gameState, multiplier, currentBet, cashout } = useCrashGame();

  const [showProgressRing, setShowProgressRing] = useState(false);
  const [ringProgress, setRingProgress] = useState(0);

  // Button is only active during flight and when bet is active but not cashed out
  const isActive =
    gameState === "flying" && currentBet.active && !currentBet.cashedOut;

  // Update ring progress based on multiplier (percentage of max 50x)
  useEffect(() => {
    if (isActive) {
      const progress = Math.min((multiplier / 50) * 100, 100);
      setRingProgress(progress);
      setShowProgressRing(true);
    } else {
      setShowProgressRing(false);
    }
  }, [multiplier, isActive]);

  const handleCashout = () => {
    if (isActive) {
      // Calculate the winnings before cashout
      const winnings = currentBet.amount * multiplier;

      // Execute cashout
      cashout();

      // Display toast notification
      toast.success(
        <div className="flex flex-col">
          <span className="font-bold">CASHED OUT! 💰</span>
          <span>{`${multiplier.toFixed(2)}× for ${winnings.toFixed(2)}`}</span>
          <span className="text-xs text-green-200">{`Profit: +${(
            winnings - currentBet.amount
          ).toFixed(2)}`}</span>
        </div>
      );
    }
  };

  if (!currentBet.active) {
    return null;
  }

  // Calculate potential winnings
  const potentialWinnings = currentBet.amount * multiplier;
  const formattedWinnings = isActive ? potentialWinnings.toFixed(2) : "0.00";
  const profit = isActive ? potentialWinnings - currentBet.amount : 0;

  // Dynamic color based on multiplier
  const getMultiplierColor = () => {
    if (multiplier >= 10) return "from-blue-500 to-indigo-600";
    if (multiplier >= 5) return "from-green-500 to-emerald-600";
    if (multiplier >= 2) return "from-yellow-500 to-amber-600";
    return "from-orange-500 to-red-600";
  };

  return (
    <div className="relative">
      {/* Pulsing background for active button */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-green-500/20 blur-md"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Circular progress indicator */}
      {showProgressRing && (
        <svg
          className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#0f172a"
            strokeWidth="6"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={multiplier >= 2 ? "#22c55e" : "#f97316"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{
              strokeDashoffset: 283 - (283 * ringProgress) / 100,
            }}
            transition={{ duration: 0.1 }}
          />
        </svg>
      )}

      <motion.div
        initial={{ scale: 1 }}
        animate={{
          scale: isActive ? [1, 1.05, 1] : 1,
          transition: {
            repeat: isActive ? Infinity : 0,
            duration: 0.5,
          },
        }}
        className="relative"
      >
        <Button
          size="lg"
          className={`relative text-lg font-bold px-6 py-6 shadow-lg ${
            isActive
              ? `bg-gradient-to-r ${getMultiplierColor()} hover:brightness-110`
              : currentBet.cashedOut
              ? "bg-gradient-to-r from-emerald-600 to-emerald-800 cursor-default"
              : "bg-slate-700 cursor-default"
          }`}
          disabled={!isActive}
          onClick={handleCashout}
        >
          <div className="flex flex-col items-center">
            {currentBet.cashedOut ? (
              <>
                <span className="text-xl">Cashed Out</span>
                <span className="text-2xl font-bold">
                  {currentBet.cashedOutAt?.toFixed(2)}×
                </span>
              </>
            ) : isActive ? (
              <>
                <span className="text-xl">Cash Out</span>
                <span className="text-2xl font-bold">{formattedWinnings}</span>
                <span className="text-sm text-green-200">
                  +{profit.toFixed(2)}
                </span>
              </>
            ) : (
              <span>Waiting...</span>
            )}
          </div>
        </Button>
      </motion.div>
    </div>
  );
}
