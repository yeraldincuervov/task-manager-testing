import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

interface ConfirmDeleteDialogProps {
  visible: boolean;
  taskTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({
  visible,
  taskTitle,
  onCancel,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityViewIsModal
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-sm rounded-xl bg-white p-5">
          <Text className="text-lg font-bold text-gray-900">Eliminar tarea</Text>
          <Text className="mt-2 text-base text-gray-600">
            ¿Deseas eliminar “{taskTitle}”?
          </Text>

          <View className="mt-5 flex-row justify-end gap-3">
            <Pressable
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancelar eliminación"
              className="rounded-lg border border-gray-300 px-4 py-3"
            >
              <Text className="font-semibold text-gray-700">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel={`Confirmar eliminación de ${taskTitle}`}
              className="rounded-lg bg-red-600 px-4 py-3"
            >
              <Text className="font-semibold text-white">Sí, eliminar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
