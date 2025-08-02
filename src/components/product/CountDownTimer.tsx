"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TimeLeft = {
  hours: number;
  minutes: number;
  seconds: number;
};

type CountdownTimerProps = {
  initialTime: TimeLeft;
  title?: string;
  subtitle?: string;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialTime,
  title = "Countdown Timer",
  subtitle = "Time remaining",
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(initialTime);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: TimeLeft) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          setIsExpired(true);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  const timeUnits = [
    { value: timeLeft.hours, label: "Hours", key: "hours" },
    { value: timeLeft.minutes, label: "Minutes", key: "minutes" },
    { value: timeLeft.seconds, label: "Seconds", key: "seconds" },
  ];

  return (
    <div className="flex items-center justify-center ">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-slate-800 mb-1">{title}</h2>
            <p className="text-xs text-slate-600">{subtitle}</p>
          </div>

          {isExpired ? (
            <div className="text-center py-4">
              <Badge variant="destructive" className="text-sm px-4 py-1 mb-2">
                Time&apos;s Up!
              </Badge>
              <p className="text-xs text-slate-600">The countdown has ended</p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              {timeUnits.map((unit, index) => (
                <React.Fragment key={unit.key}>
                  <div className="text-center">
                    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-3 shadow-md">
                      <div className="text-2xl font-mono font-bold text-white">
                        {formatNumber(unit.value)}
                      </div>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                        {unit.label.slice(0, 3)}
                      </span>
                    </div>
                  </div>
                  {index < timeUnits.length - 1 && (
                    <div className="text-xl font-bold text-slate-400 pb-6">
                      :
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="mt-3 text-center">
            <div className="inline-flex items-center space-x-1 text-xs text-slate-500">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(CountdownTimer);
