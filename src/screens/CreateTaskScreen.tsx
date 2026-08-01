import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { useCreateTask } from '../hooks/useCreateTask';
import { useTaskList } from '../hooks/useTaskList';

export function CreateTaskScreen() {
  const { status, submit } = useCreateTask();
  const { tasks, addTask, removeTask } = useTaskList();
  const insets = useSafeAreaInsets();

  const handleSubmit = async (title: string) => {
    const createdTask = await submit(title);
    if (createdTask) {
      addTask(createdTask.title);
    }
  };

  return (
    <View
      className="flex-1 gap-4 bg-gray-50 p-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}
    >
      <Text className="text-2xl font-bold text-gray-900">Nueva Tarea</Text>
      <TaskForm onSubmit={handleSubmit} />
      {status === 'success' && (
        <Text className="rounded-lg bg-green-100 px-4 py-3 text-sm font-medium text-green-800">
          Tarea creada exitosamente
        </Text>
      )}
      {status === 'error' && (
        <Text className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
          Error al crear la tarea
        </Text>
      )}
      <TaskList tasks={tasks} onDelete={removeTask} />
    </View>
  );
}
