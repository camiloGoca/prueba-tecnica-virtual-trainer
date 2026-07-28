<script setup lang="ts">
import TrainingCard from '@/components/TrainingCard.vue'
import type { Entrenamiento } from '@/types/Entrenamiento'

interface Props {
  entrenamientos: Entrenamiento[]
}

defineProps<Props>()

const emit = defineEmits<{
  editar: [entrenamiento: Entrenamiento]
  eliminar: [id: string]
}>()

const editarEntrenamiento = (entrenamiento: Entrenamiento): void => {
  emit('editar', entrenamiento)
}

const eliminarEntrenamiento = (id: string): void => {
  emit('eliminar', id)
}
</script>

<template>
  <section class="training-history" aria-labelledby="history-title">
    <div class="section-heading">
      <span class="section-kicker">Historial</span>
      <h2 id="history-title">Entrenamientos registrados</h2>
    </div>

    <div v-if="entrenamientos.length > 0" class="training-list">
      <TrainingCard
        v-for="entrenamiento in entrenamientos"
        :key="entrenamiento.id"
        :entrenamiento="entrenamiento"
        @editar="editarEntrenamiento"
        @eliminar="eliminarEntrenamiento"
      />
    </div>

    <div v-else class="empty-state">
      <p class="empty-title">Aún no hay entrenamientos</p>
      <p>Registra tu primera sesión para empezar a construir el historial.</p>
    </div>
  </section>
</template>
