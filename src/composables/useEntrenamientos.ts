import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { Entrenamiento } from '@/types/Entrenamiento'

interface UseEntrenamientos {
  entrenamientos: Ref<Entrenamiento[]>
  entrenamientosOrdenados: ComputedRef<Entrenamiento[]>
  entrenamientoEnEdicion: Ref<Entrenamiento | null>
  estaEditando: ComputedRef<boolean>
  crearEntrenamiento: (entrenamiento: Entrenamiento) => void
  eliminarEntrenamiento: (id: string) => void
  iniciarEdicion: (entrenamiento: Entrenamiento) => void
  cancelarEdicion: () => void
  actualizarEntrenamiento: (entrenamiento: Entrenamiento) => void
}

const entrenamientosIniciales: Entrenamiento[] = [
  {
    id: 'demo-1',
    fecha: '2026-07-25',
    duracion: 42,
    distancia: 6.4,
  },
  {
    id: 'demo-2',
    fecha: '2026-07-27',
    duracion: 35,
    distancia: 5,
  },
]

const generarIdTemporal = (): string => crypto.randomUUID()

export const useEntrenamientos = (): UseEntrenamientos => {
  const entrenamientos = ref<Entrenamiento[]>(entrenamientosIniciales)
  const entrenamientoEnEdicion = ref<Entrenamiento | null>(null)

  const entrenamientosOrdenados = computed<Entrenamiento[]>(() =>
    [...entrenamientos.value].sort(
      (entrenamientoActual, entrenamientoSiguiente) =>
        new Date(entrenamientoSiguiente.fecha).getTime() -
        new Date(entrenamientoActual.fecha).getTime(),
    ),
  )

  const estaEditando = computed<boolean>(() => Boolean(entrenamientoEnEdicion.value))

  const crearEntrenamiento = (entrenamiento: Entrenamiento): void => {
    entrenamientos.value = [
      ...entrenamientos.value,
      {
        ...entrenamiento,
        id: generarIdTemporal(),
      },
    ]
  }

  const eliminarEntrenamiento = (id: string): void => {
    entrenamientos.value = entrenamientos.value.filter((entrenamiento) => entrenamiento.id !== id)

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

  const actualizarEntrenamiento = (entrenamientoActualizado: Entrenamiento): void => {
    if (!entrenamientoActualizado.id) {
      return
    }

    entrenamientos.value = entrenamientos.value.map((entrenamiento) =>
      entrenamiento.id === entrenamientoActualizado.id ? entrenamientoActualizado : entrenamiento,
    )

    cancelarEdicion()
  }

  return {
    entrenamientos,
    entrenamientosOrdenados,
    entrenamientoEnEdicion,
    estaEditando,
    crearEntrenamiento,
    eliminarEntrenamiento,
    iniciarEdicion,
    cancelarEdicion,
    actualizarEntrenamiento,
  }
}
