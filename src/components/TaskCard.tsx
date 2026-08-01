import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Task } from '../types';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const done = task.status === 'completed';

  const handleConfirmDelete = () => {
    setShowDeleteDialog(false);
    onDelete(task.id);
  };

  return (
    <>
      <View className="mb-2 rounded-lg border border-gray-200 bg-white p-4">
        <Text className="text-base font-semibold text-gray-900">{task.title}</Text>
        <Text className={`mt-1 text-sm ${done ? 'text-green-600' : 'text-gray-500'}`}>
          {done ? '✓ Completada' : '○ Pendiente'}
        </Text>
        <Pressable
          onPress={() => setShowDeleteDialog(true)}
          accessibilityRole="button"
          accessibilityLabel={`Eliminar tarea ${task.title}`}
        >
          <Text className="mt-2 text-sm font-medium text-red-600">Eliminar</Text>
        </Pressable>
      </View>

      <ConfirmDeleteDialog
        visible={showDeleteDialog}
        taskTitle={task.title}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
