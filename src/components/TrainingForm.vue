<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { Entrenamiento } from '@/types/Entrenamiento'

interface FormularioEntrenamiento {
  fecha: string
  duracion: number | null
  distancia: number | null
}

interface Props {
  entrenamientoEnEdicion: Entrenamiento | null
  estaEditando: boolean
}

interface ErroresFormulario {
  fecha?: string
  duracion?: string
  distancia?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  guardar: [entrenamiento: Entrenamiento]
  actualizar: [entrenamiento: Entrenamiento]
  cancelar: []
}>()

const formulario = reactive<FormularioEntrenamiento>({
  fecha: '',
  duracion: null,
  distancia: null,
})

const errores = reactive<ErroresFormulario>({})

const tituloFormulario = computed<string>(() =>
  props.estaEditando ? 'Editar entrenamiento' : 'Nuevo entrenamiento',
)

const textoBotonPrincipal = computed<string>(() => (props.estaEditando ? 'Actualizar' : 'Guardar'))

const limpiarErrores = (): void => {
  errores.fecha = undefined
  errores.duracion = undefined
  errores.distancia = undefined
}

const reiniciarFormulario = (): void => {
  formulario.fecha = ''
  formulario.duracion = null
  formulario.distancia = null
  limpiarErrores()
}

const cargarEntrenamiento = (entrenamiento: Entrenamiento): void => {
  formulario.fecha = entrenamiento.fecha
  formulario.duracion = entrenamiento.duracion
  formulario.distancia = entrenamiento.distancia
  limpiarErrores()
}

const validarFormulario = (): boolean => {
  limpiarErrores()

  if (!formulario.fecha) {
    errores.fecha = 'La fecha es obligatoria.'
  }

  if (formulario.duracion === null || formulario.duracion <= 0) {
    errores.duracion = 'La duración debe ser mayor a 0 minutos.'
  }

  if (formulario.distancia === null || formulario.distancia <= 0) {
    errores.distancia = 'La distancia debe ser mayor a 0 km.'
  }

  return !errores.fecha && !errores.duracion && !errores.distancia
}

const construirEntrenamiento = (): Entrenamiento => ({
  id: props.entrenamientoEnEdicion?.id,
  fecha: formulario.fecha,
  duracion: Number(formulario.duracion),
  distancia: Number(formulario.distancia),
})

const enviarFormulario = (): void => {
  if (!validarFormulario()) {
    return
  }

  const entrenamiento = construirEntrenamiento()

  if (props.estaEditando) {
    emit('actualizar', entrenamiento)
    return
  }

  emit('guardar', entrenamiento)
  reiniciarFormulario()
}

const cancelarEdicion = (): void => {
  emit('cancelar')
  reiniciarFormulario()
}

watch(
  () => props.entrenamientoEnEdicion,
  (entrenamiento) => {
    if (entrenamiento) {
      cargarEntrenamiento(entrenamiento)
      return
    }

    reiniciarFormulario()
  },
  { immediate: true },
)
</script>

<template>
  <form class="training-form" novalidate @submit.prevent="enviarFormulario">
    <div class="section-heading">
      <span class="section-kicker">Formulario</span>
      <h2>{{ tituloFormulario }}</h2>
    </div>

    <div class="form-field">
      <label for="fecha">Fecha</label>
      <input
        id="fecha"
        v-model="formulario.fecha"
        type="date"
        :aria-invalid="Boolean(errores.fecha)"
        aria-describedby="fecha-error"
      />
      <p v-if="errores.fecha" id="fecha-error" class="field-error">{{ errores.fecha }}</p>
    </div>

    <div class="form-row">
      <div class="form-field">
        <label for="duracion">Duración</label>
        <div class="input-addon">
          <input
            id="duracion"
            v-model.number="formulario.duracion"
            type="number"
            min="1"
            step="1"
            placeholder="45"
            :aria-invalid="Boolean(errores.duracion)"
            aria-describedby="duracion-error"
          />
          <span>min</span>
        </div>
        <p v-if="errores.duracion" id="duracion-error" class="field-error">
          {{ errores.duracion }}
        </p>
      </div>

      <div class="form-field">
        <label for="distancia">Distancia</label>
        <div class="input-addon">
          <input
            id="distancia"
            v-model.number="formulario.distancia"
            type="number"
            min="0.1"
            step="0.1"
            placeholder="5.2"
            :aria-invalid="Boolean(errores.distancia)"
            aria-describedby="distancia-error"
          />
          <span>km</span>
        </div>
        <p v-if="errores.distancia" id="distancia-error" class="field-error">
          {{ errores.distancia }}
        </p>
      </div>
    </div>

    <div class="form-actions">
      <button class="primary-button" type="submit">{{ textoBotonPrincipal }}</button>
      <button v-if="estaEditando" class="secondary-button" type="button" @click="cancelarEdicion">
        Cancelar
      </button>
    </div>
  </form>
</template>
