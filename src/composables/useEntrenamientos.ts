import { computed, onMounted, onUnmounted, ref, type ComputedRef, type Ref } from 'vue'
import {
  actualizarEntrenamiento as actualizarEntrenamientoFirestore,
  eliminarEntrenamiento as eliminarEntrenamientoFirestore,
  escucharEntrenamientos,
  guardarEntrenamiento,
} from '@/services/entrenamientoService'
import type { Entrenamiento } from '@/types/Entrenamiento'

interface UseEntrenamientos {
  entrenamientos: Ref<Entrenamiento[]>
  entrenamientosOrdenados: ComputedRef<Entrenamiento[]>
  entrenamientosFiltrados: ComputedRef<Entrenamiento[]>
  entrenamientoEnEdicion: Ref<Entrenamiento | null>
  estaEditando: ComputedRef<boolean>
  fechaInicioFiltro: Ref<string>
  fechaFinFiltro: Ref<string>
  cargando: Ref<boolean>
  error: Ref<string | null>
  limpiarFiltros: () => void
  crearEntrenamiento: (entrenamiento: Entrenamiento) => Promise<void>
  eliminarEntrenamiento: (id: string) => Promise<void>
  iniciarEdicion: (entrenamiento: Entrenamiento) => void
  cancelarEdicion: () => void
  actualizarEntrenamiento: (entrenamiento: Entrenamiento) => Promise<void>
}

export const useEntrenamientos = (): UseEntrenamientos => {
  const entrenamientos = ref<Entrenamiento[]>([])
  const entrenamientoEnEdicion = ref<Entrenamiento | null>(null)
  const fechaInicioFiltro = ref<string>('')
  const fechaFinFiltro = ref<string>('')
  const cargando = ref<boolean>(true)
  const error = ref<string | null>(null)
  const unsubscribe = ref<(() => void) | null>(null)

  const entrenamientosOrdenados = computed<Entrenamiento[]>(() =>
    [...entrenamientos.value].sort(
      (entrenamientoActual, entrenamientoSiguiente) =>
        new Date(entrenamientoSiguiente.fecha).getTime() -
        new Date(entrenamientoActual.fecha).getTime(),
    ),
  )

  const estaEditando = computed<boolean>(() => Boolean(entrenamientoEnEdicion.value))

  const entrenamientosFiltrados = computed<Entrenamiento[]>(() =>
    entrenamientosOrdenados.value.filter((entrenamiento) => {
      const cumpleFechaInicio =
        !fechaInicioFiltro.value || entrenamiento.fecha >= fechaInicioFiltro.value
      const cumpleFechaFin = !fechaFinFiltro.value || entrenamiento.fecha <= fechaFinFiltro.value

      return cumpleFechaInicio && cumpleFechaFin
    }),
  )

  const limpiarError = (): void => {
    error.value = null
  }

  const limpiarFiltros = (): void => {
    fechaInicioFiltro.value = ''
    fechaFinFiltro.value = ''
  }

  const crearEntrenamiento = async (entrenamiento: Entrenamiento): Promise<void> => {
    limpiarError()

    try {
      await guardarEntrenamiento(entrenamiento)
    } catch {
      error.value = 'No fue posible guardar el entrenamiento.'
    }
  }

  const eliminarEntrenamiento = async (id: string): Promise<void> => {
    limpiarError()

    try {
      await eliminarEntrenamientoFirestore(id)
    } catch {
      error.value = 'No fue posible eliminar el entrenamiento.'
      return
    }

    if (entrenamientoEnEdicion.value?.id === id) {
      cancelarEdicion()
    }
  }

  const iniciarEdicion = (entrenamiento: Entrenamiento): void => {
    entrenamientoEnEdicion.value = { ...entrenamiento }
  }

  const cancelarEdicion = (): void => {
    entrenamientoEnEdicion.value = null
  }

  const actualizarEntrenamiento = async (entrenamientoActualizado: Entrenamiento): Promise<void> => {
    if (!entrenamientoActualizado.id) {
      return
    }

    limpiarError()
    try {
      await actualizarEntrenamientoFirestore(entrenamientoActualizado)
    } catch {
      error.value = 'No fue posible actualizar el entrenamiento.'
      return
    }

    cancelarEdicion()
  }

  onMounted(() => {
    unsubscribe.value = escucharEntrenamientos(
      (entrenamientosActualizados) => {
        entrenamientos.value = entrenamientosActualizados
        cargando.value = false
      },
      () => {
        error.value = 'No fue posible cargar los entrenamientos.'
        cargando.value = false
      },
    )
  })

  onUnmounted(() => {
    unsubscribe.value?.()
  })

  return {
    entrenamientos,
    entrenamientosOrdenados,
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
  }
}
