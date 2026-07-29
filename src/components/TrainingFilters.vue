<script setup lang="ts">
interface Props {
  fechaInicio: string
  fechaFin: string
  totalResultados: number
  totalEntrenamientos: number
}

defineProps<Props>()

const emit = defineEmits<{
  'update:fechaInicio': [fechaInicio: string]
  'update:fechaFin': [fechaFin: string]
  limpiar: []
}>()

const actualizarFechaInicio = (event: Event): void => {
  const input = event.target as HTMLInputElement
  emit('update:fechaInicio', input.value)
}

const actualizarFechaFin = (event: Event): void => {
  const input = event.target as HTMLInputElement
  emit('update:fechaFin', input.value)
}
</script>

<template>
  <form class="training-filters" aria-label="Filtros de entrenamientos" @submit.prevent>
    <div class="filter-fields">
      <div class="form-field filter-field">
        <label for="fecha-inicio">Desde</label>
        <input
          id="fecha-inicio"
          type="date"
          :value="fechaInicio"
          @input="actualizarFechaInicio"
        />
      </div>

      <div class="form-field filter-field">
        <label for="fecha-fin">Hasta</label>
        <input id="fecha-fin" type="date" :value="fechaFin" @input="actualizarFechaFin" />
      </div>
    </div>

    <div class="filter-summary">
      <p>{{ totalResultados }} de {{ totalEntrenamientos }} entrenamientos</p>
      <button class="secondary-button compact-button" type="button" @click="emit('limpiar')">
        Limpiar
      </button>
    </div>
  </form>
</template>
