<script setup lang="ts">
import { computed } from 'vue'
import type { Entrenamiento } from '@/types/Entrenamiento'

interface Props {
  entrenamiento: Entrenamiento
}

const props = defineProps<Props>()

const emit = defineEmits<{
  editar: [entrenamiento: Entrenamiento]
  eliminar: [id: string]
}>()

const fechaFormateada = computed<string>(() =>
  new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${props.entrenamiento.fecha}T00:00:00`)),
)

const ritmoPromedio = computed<string>(() => {
  const minutosPorKm = props.entrenamiento.duracion / props.entrenamiento.distancia
  return `${minutosPorKm.toFixed(1)} min/km`
})

const editarEntrenamiento = (): void => {
  emit('editar', props.entrenamiento)
}

const eliminarEntrenamiento = (): void => {
  if (!props.entrenamiento.id) {
    return
  }

  emit('eliminar', props.entrenamiento.id)
}
</script>

<template>
  <article class="training-card">
    <div class="card-main">
      <p class="card-date">{{ fechaFormateada }}</p>
      <div class="metric-grid" aria-label="Resumen del entrenamiento">
        <div>
          <span class="metric-value">{{ entrenamiento.duracion }}</span>
          <span class="metric-label">minutos</span>
        </div>
        <div>
          <span class="metric-value">{{ entrenamiento.distancia }}</span>
          <span class="metric-label">kilómetros</span>
        </div>
        <div>
          <span class="metric-value">{{ ritmoPromedio }}</span>
          <span class="metric-label">ritmo</span>
        </div>
      </div>
    </div>

    <div class="card-actions" aria-label="Acciones del entrenamiento">
      <button class="ghost-button" type="button" @click="editarEntrenamiento">Editar</button>
      <button class="danger-button" type="button" @click="eliminarEntrenamiento">Eliminar</button>
    </div>
  </article>
</template>
