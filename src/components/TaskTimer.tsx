import React, { useState, useEffect, useRef } from 'react';
import { Clock, Pause, Play } from 'lucide-react';

interface TaskTimerProps {
  taskId: string;
}

function TaskTimer({ taskId }: TaskTimerProps) {
  const [showTimer, setShowTimer] = useState(false);
  const [time, setTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time !== null && time > 0) {
      interval = setInterval(() => {
        setTime(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(interval);
            setIsRunning(false);
            playTimerEndSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowTimer(false);
        setShowCustomInput(false);
        setCustomMinutes('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const playTimerEndSound = () => {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(customMinutes, 10);
    if (!isNaN(minutes) && minutes > 0) {
      setTime(minutes * 60);
      setIsRunning(true);
      setShowTimer(false);
      setShowCustomInput(false);
      setCustomMinutes('');
    }
  };

  const presetTimes = [
    { label: '15m', value: 15 * 60 },
    { label: '25m', value: 25 * 60 },
    { label: '50m', value: 50 * 60 },
  ];

  return (
    <div className="flex items-center gap-2">
      {time !== null && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-1.5 text-[#f4a61d] hover:bg-[#fff8eb] rounded-full transition-colors"
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <span className="font-mono text-sm text-[#f4a61d]">
            {formatTime(time)}
          </span>
        </div>
      )}
      
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setShowTimer(!showTimer)}
          className="p-2 text-[#f4a61d] hover:bg-[#fff8eb] rounded-full transition-colors"
        >
          <Clock size={20} />
        </button>

        {showTimer && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10"
          >
            <div className="space-y-2">
              {presetTimes.map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => {
                    setTime(value);
                    setIsRunning(true);
                    setShowTimer(false);
                  }}
                  className="w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-[#fff8eb] rounded transition-colors"
                >
                  {label}
                </button>
              ))}
              
              {!showCustomInput ? (
                <button
                  onClick={() => {
                    setShowCustomInput(true);
                    setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                  className="w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-[#fff8eb] rounded transition-colors"
                >
                  Custom
                </button>
              ) : (
                <form onSubmit={handleCustomSubmit} className="mt-2">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="number"
                      min="1"
                      max="180"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(e.target.value)}
                      placeholder="mins"
                      className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-[#f4a61d]"
                    />
                    <button
                      type="submit"
                      className="px-2 py-1 text-sm bg-[#f4a61d] text-white rounded hover:bg-[#d88e0c] transition-colors"
                    >
                      Set
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskTimer;