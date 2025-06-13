import { useState, useMemo, useEffect } from "react";
import { useCrashGame } from "../../lib/stores/useCrashGame";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { motion } from "framer-motion";

import { toast } from "sonner";

// import { ToastContainer, toast } from "react-toastify";

export function BettingPanel() {
  const {
    gameState,
    multiplier,
    balance,
    betAmount,
    setBetAmount,
    autoCashout,
    setAutoCashout,
    currentBet,
    placeBet,
  } = useCrashGame();

  const [useAutoCashout, setUseAutoCashout] = useState(false);
  const [autoValue, setAutoValue] = useState<string>("2");
  const [returnAmount, setReturnAmount] = useState(0);
  const [inputValue, setInputValue] = useState(betAmount.toString());

  // Can place bet during betting phase and when not already bet
  const canPlaceBet = gameState === "betting" && !currentBet.active;

  // Reset input value when bet amount changes externally
  useEffect(() => {
    setInputValue(betAmount.toString());
  }, [betAmount]);

  // Calculate potential returns
  const potentialReturn = useMemo(() => {
    // During flying phase, always show potential return based on current multiplier
    if (gameState === "flying" && currentBet.active && !currentBet.cashedOut) {
      return currentBet.amount * multiplier;
    }

    // During betting phase, show potential return based on current bet amount
    // Always multiply by the current multiplier (default to 1.0x when not flying)
    return betAmount * (gameState === "flying" ? multiplier : 1.0);
  }, [betAmount, multiplier, gameState, currentBet]);

  // Calculate profit
  const profit = useMemo(() => {
    return potentialReturn - betAmount;
  }, [potentialReturn, betAmount]);

  // Handle bet amount changes
  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setBetAmount(value);
    }
  };

  // Handle slider changes for bet amount
  const handleBetSliderChange = (value: number[]) => {
    setBetAmount(value[0]);
  };

  // Handle auto cashout changes
  const handleAutoCashoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAutoValue(value);

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 1) {
      setAutoCashout(numValue);
    } else {
      setAutoCashout(null);
    }
  };

  // Handle auto cashout toggle
  const handleAutoCashoutToggle = (checked: boolean) => {
    setUseAutoCashout(checked);

    if (checked) {
      const numValue = parseFloat(autoValue);
      if (!isNaN(numValue) && numValue >= 1) {
        setAutoCashout(numValue);
      }
    } else {
      setAutoCashout(null);
    }
  };

  // Place bet - implementation for demo
  const handlePlaceBet = () => {
    if (!canPlaceBet) return;

    try {
      const autoCashoutValue = useAutoCashout ? parseFloat(autoValue) : null;

      // Update local state via the store actions
      // Reduce balance immediately
      placeBet(betAmount, autoCashoutValue);

      // Extra UI feedback
      toast.success(`Bet of ${betAmount.toFixed(2)} placed!`);
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error("Failed to place bet");
    }
  };

  // Add some quick bet presets
  const quickBetPresets = [
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
  ];

  return (
    <Card className="border border-slate-700 shadow-lg">
      <CardHeader className="bg-slate-800 rounded-t-lg">
        <CardTitle className="flex justify-between items-center">
          <span>Place Bet</span>
          <span className="text-green-400 font-mono">
            Balance: {balance.toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Bet amount input */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="bet-amount" className="text-sm font-medium">
              Bet Amount
            </Label>

            {/* Potential return display */}
            {betAmount > 0 && (
              <div className="text-sm text-right">
                <div className="text-slate-400">Potential Return:</div>
                <div className="font-bold text-green-400">
                  {potentialReturn.toFixed(2)}
                  <span className="text-xs ml-1 text-green-300">
                    (+{profit.toFixed(2)})
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              id="bet-amount"
              type="number"
              min={1}
              max={balance}
              value={inputValue}
              onChange={handleBetAmountChange}
              disabled={!canPlaceBet}
              className="font-mono text-base bg-slate-900"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBetAmount(Math.max(betAmount / 2, 1))}
              disabled={!canPlaceBet}
              className="w-12"
            >
              ½
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBetAmount(betAmount * 2)}
              disabled={!canPlaceBet || betAmount * 2 > balance}
              className="w-12"
            >
              2×
            </Button>
          </div>

          {/* Quick bet presets */}
          <div className="flex flex-wrap gap-2">
            {quickBetPresets.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                onClick={() => setBetAmount(preset.value)}
                disabled={!canPlaceBet || preset.value > balance}
                className={`flex-1 min-w-0 ${
                  betAmount === preset.value ? "bg-slate-700" : ""
                }`}
              >
                {preset.label}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBetAmount(balance)}
              disabled={!canPlaceBet}
              className="flex-1 min-w-0"
            >
              Max
            </Button>
          </div>

          {/* Bet amount slider */}
          <Slider
            defaultValue={[10]}
            min={1}
            max={balance}
            step={1}
            value={[betAmount]}
            onValueChange={handleBetSliderChange}
            disabled={!canPlaceBet}
          />
        </div>

        {/* Auto cashout */}
        <div className="space-y-2 border-t border-slate-700 pt-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-cashout" className="cursor-pointer">
              Auto Cashout
            </Label>
            <Switch
              id="auto-cashout-toggle"
              checked={useAutoCashout}
              onCheckedChange={handleAutoCashoutToggle}
              disabled={!canPlaceBet}
            />
          </div>

          <div className="flex items-center gap-2">
            <Input
              id="auto-cashout"
              type="number"
              min={1.01}
              max={50}
              step={0.01}
              value={autoValue}
              onChange={handleAutoCashoutChange}
              disabled={!canPlaceBet || !useAutoCashout}
              className="font-mono"
            />
            <span className="text-xl">×</span>
          </div>
        </div>

        {/* Bet button */}
        <Button
          className="w-full h-12 mt-2 text-lg font-bold"
          size="lg"
          onClick={handlePlaceBet}
          disabled={!canPlaceBet || betAmount <= 0 || betAmount > balance}
        >
          Place Bet
        </Button>

        {/* Current bet info */}
        {currentBet.active && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700 shadow-inner"
          >
            <h3 className="font-semibold mb-2 text-white">Current Bet</h3>
            <div className="flex justify-between text-base border-b border-slate-700 pb-2 mb-2">
              <span>Amount:</span>
              <span className="font-mono font-bold">
                {currentBet.amount.toFixed(2)}
              </span>
            </div>

            {gameState === "flying" && !currentBet.cashedOut && (
              <motion.div
                className="flex justify-between text-sm text-green-400 font-medium"
                animate={{
                  scale: [1, 1.03, 1],
                  transition: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  },
                }}
              >
                <span>Live potential win:</span>
                <span className="font-mono font-bold">
                  {(currentBet.amount * multiplier).toFixed(2)}
                  <span className="ml-1 text-xs opacity-80">
                    ({multiplier.toFixed(2)}×)
                  </span>
                </span>
              </motion.div>
            )}

            {currentBet.cashedOut && (
              <div className="flex justify-between text-green-400 font-medium mt-1">
                <span>Cashed out:</span>
                <span className="font-mono font-bold">
                  +{currentBet.winnings.toFixed(2)}
                  <span className="ml-1 text-xs opacity-80">
                    ({currentBet.cashedOutAt?.toFixed(2)}×)
                  </span>
                </span>
              </div>
            )}

            {autoCashout !== null && (
              <div className="flex justify-between text-sm text-yellow-400 mt-2 border-t border-slate-700 pt-2">
                <span>Auto Cashout at:</span>
                <span className="font-mono">{autoCashout.toFixed(2)}×</span>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
