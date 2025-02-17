import React from 'react';
import { Heart, PartyPopper, CheckSquare } from 'lucide-react';
import { CompletedTask } from '../types';

interface CompletedTasksProps {
  completedTasks: CompletedTask[];
  addReaction: (taskId: string, type: 'hearts' | 'celebrations') => void;
}

function CompletedTasks({ completedTasks, addReaction }: CompletedTasksProps) {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-poppins">Completed Tasks</h2>
      <div className="space-y-4">
        {completedTasks.map((task) => (
          <div 
            key={task.id}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-start gap-3"
          >
            <CheckSquare className="text-[#f4a61d] flex-shrink-0 mt-1" size={20} />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-800">{task.content}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Completed by {task.completedBy} at {formatTime(task.completedAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addReaction(task.id, 'hearts')}
                    className="flex items-center gap-1 px-3 py-1.5 text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                  >
                    <Heart size={16} />
                    <span>{task.reactions.hearts}</span>
                  </button>
                  <button
                    onClick={() => addReaction(task.id, 'celebrations')}
                    className="flex items-center gap-1 px-3 py-1.5 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                  >
                    <PartyPopper size={16} />
                    <span>{task.reactions.celebrations}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {completedTasks.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No completed tasks yet. Complete a task to see it here!
          </p>
        )}
      </div>
    </div>
  );
}

export default CompletedTasks;