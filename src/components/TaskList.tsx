import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onDelete?: (id: string) => void;
}

export function TaskList({ tasks, onDelete = () => {} }: TaskListProps) {
  if (tasks.length === 0) {
    return <Text className="py-6 text-center text-base text-gray-500">No hay tareas aún</Text>;
  }

  return (
    <View className="flex-1">
      <Text className="mb-2 text-sm font-medium text-gray-500">
        {tasks.length === 1 ? '1 tarea' : `${tasks.length} tareas`}
      </Text>
      <FlatList
        data={tasks}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TaskCard task={item} onDelete={onDelete} />}
      />
    </View>
  );
}
