import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Square, CheckSquare } from 'lucide-react';
import TaskTimer from './components/TaskTimer';
import TaskInput from './components/TaskInput';
import CompletedTasks from './components/CompletedTasks';
import { Task, CompletedTask } from './types';
import useConfetti from './hooks/useConfetti';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const triggerConfetti = useConfetti();

  const handleAddTask = (content: string) => {
    if (content.trim() && tasks.length < 3) {
      const task: Task = {
        id: Date.now().toString(),
        content: content.trim(),
        timer: null,
      };
      setTasks([...tasks, task]);
      // Webhook call would go here
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const completedTask: CompletedTask = {
        id: task.id,
        content: task.content,
        completedAt: new Date().toISOString(),
        reactions: { hearts: 0, celebrations: 0 },
        completedBy: 'Current User' // Would come from Zoom context
      };
      setCompletedTasks([completedTask, ...completedTasks]);
      setTasks(tasks.filter(t => t.id !== taskId));
      triggerConfetti();
      // Webhook call would go here
    }
  };

  const addReaction = (taskId: string, type: 'hearts' | 'celebrations') => {
    setCompletedTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, reactions: { ...task.reactions, [type]: task.reactions[type] + 1 }} 
          : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8eb] to-[#fff1d6] p-6">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-poppins">Caveday Task List</h1>
          <p className="text-[#f4a61d] font-poppins">Manage tasks efficiently during your sessions</p>
        </header>

        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <TaskInput 
            onTaskAdd={handleAddTask}
            disabled={tasks.length >= 3}
          />

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3 mt-6"
                >
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white border border-[#ffebc7] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
                        >
                          <button
                            onClick={() => completeTask(task.id)}
                            className="p-1 text-[#f4a61d] hover:text-[#d88e0c] transition-colors flex-shrink-0"
                          >
                            <Square size={24} />
                          </button>
                          <div className="flex-1">
                            <p className="text-gray-800">{task.content}</p>
                          </div>
                          <TaskTimer taskId={task.id} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <CompletedTasks 
          completedTasks={completedTasks}
          addReaction={addReaction}
        />
      </div>
    </div>
  );
}

export default App;