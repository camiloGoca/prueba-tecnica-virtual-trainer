<script setup lang="ts">
import TrainingForm from '@/components/TrainingForm.vue'
import TrainingFilters from '@/components/TrainingFilters.vue'
import TrainingList from '@/components/TrainingList.vue'
import { useEntrenamientos } from '@/composables/useEntrenamientos'
import type { Entrenamiento } from '@/types/Entrenamiento'

const {
  entrenamientos,
  entrenamientosFiltrados,
  entrenamientoEnEdicion,
  estaEditando,
  fechaInicioFiltro,
  fechaFinFiltro,
  cargando,
  error,
  limpiarFiltros,
  crearEntrenamiento,
  eliminarEntrenamiento,
  iniciarEdicion,
  cancelarEdicion,
  actualizarEntrenamiento,
} = useEntrenamientos()

const guardarEntrenamiento = async (entrenamiento: Entrenamiento): Promise<void> => {
  await crearEntrenamiento(entrenamiento)
}

const actualizarEntrenamientoSeleccionado = async (entrenamiento: Entrenamiento): Promise<void> => {
  await actualizarEntrenamiento(entrenamiento)
}
</script>

<template>
  <main class="app-shell" aria-labelledby="app-title">
    <section class="app-header">
      <div>
        <p class="eyebrow">Virtual Trainer</p>
        <h1 id="app-title">Registro de entrenamientos</h1>
      </div>
      <p class="header-description">
        Guarda sesiones, revisa tu historial y mantén una vista clara de tu progreso.
      </p>
    </section>

    <section class="content-grid" aria-label="Gestión de entrenamientos">
      <TrainingForm
        :entrenamiento-en-edicion="entrenamientoEnEdicion"
        :esta-editando="estaEditando"
        @guardar="guardarEntrenamiento"
        @actualizar="actualizarEntrenamientoSeleccionado"
        @cancelar="cancelarEdicion"
      />

      <div class="history-panel">
        <TrainingFilters
          v-model:fecha-inicio="fechaInicioFiltro"
          v-model:fecha-fin="fechaFinFiltro"
          :total-resultados="entrenamientosFiltrados.length"
          :total-entrenamientos="entrenamientos.length"
          @limpiar="limpiarFiltros"
        />

        <TrainingList
          :entrenamientos="entrenamientosFiltrados"
          :cargando="cargando"
          :error="error"
          @editar="iniciarEdicion"
          @eliminar="eliminarEntrenamiento"
        />
      </div>
    </section>
  </main>
</template>
