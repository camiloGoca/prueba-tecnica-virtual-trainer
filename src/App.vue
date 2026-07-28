<script setup lang="ts">
import TrainingForm from '@/components/TrainingForm.vue'
import TrainingList from '@/components/TrainingList.vue'
import { useEntrenamientos } from '@/composables/useEntrenamientos'
import type { Entrenamiento } from '@/types/Entrenamiento'

const {
  entrenamientosOrdenados,
  entrenamientoEnEdicion,
  estaEditando,
  crearEntrenamiento,
  eliminarEntrenamiento,
  iniciarEdicion,
  cancelarEdicion,
  actualizarEntrenamiento,
} = useEntrenamientos()

const guardarEntrenamiento = (entrenamiento: Entrenamiento): void => {
  crearEntrenamiento(entrenamiento)
}

const actualizarEntrenamientoSeleccionado = (entrenamiento: Entrenamiento): void => {
  actualizarEntrenamiento(entrenamiento)
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

      <TrainingList
        :entrenamientos="entrenamientosOrdenados"
        @editar="iniciarEdicion"
        @eliminar="eliminarEntrenamiento"
      />
    </section>
  </main>
</template>
