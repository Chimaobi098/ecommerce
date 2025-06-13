import { useCrashGame } from "../../lib/stores/useCrashGame";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

export function HistoryPanel() {
  const { history } = useCrashGame();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Crashes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[180px]">
          <div className="space-y-1">
            {history.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-2">
                No game history yet
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {history.map((item) => (
                  <CrashHistoryItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex justify-between mt-4 text-xs text-slate-400">
          <div>Min: 1.00×</div>
          <div>Max: 50.00×</div>
        </div>
        
        {history.length > 0 && (
          <div className="mt-2">
            <HistoryStats history={history} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Individual history item
function CrashHistoryItem({ item }: { item: { id: number; crashPoint: number; timestamp: number } }) {
  // Determine background color based on crash point
  const getBgColor = (value: number) => {
    if (value < 1.2) return "bg-red-500 text-white";
    if (value < 2) return "bg-orange-500 text-white";
    if (value < 5) return "bg-yellow-500 text-black";
    if (value < 10) return "bg-green-500 text-white";
    return "bg-blue-500 text-white";
  };
  
  return (
    <div
      className={`px-2 py-1 rounded font-medium text-sm ${getBgColor(item.crashPoint)}`}
      title={new Date(item.timestamp).toLocaleTimeString()}
    >
      {item.crashPoint.toFixed(2)}×
    </div>
  );
}

// Stats component for history
function HistoryStats({ history }: { history: Array<{ crashPoint: number }> }) {
  // Calculate stats from history
  const avgCrash = history.reduce((sum, item) => sum + item.crashPoint, 0) / history.length;
  
  // Count crashes below 2x
  const lowCrashes = history.filter(item => item.crashPoint < 2).length;
  const lowCrashPercent = Math.round((lowCrashes / history.length) * 100);
  
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="bg-slate-800 p-2 rounded">
        <div className="text-slate-400">Avg. Crash</div>
        <div className="font-semibold">{avgCrash.toFixed(2)}×</div>
      </div>
      <div className="bg-slate-800 p-2 rounded">
        <div className="text-slate-400">Below 2×</div>
        <div className="font-semibold">{lowCrashPercent}%</div>
      </div>
    </div>
  );
}
