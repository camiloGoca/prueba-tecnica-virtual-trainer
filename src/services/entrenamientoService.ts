import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type FirestoreError,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import type { Entrenamiento } from '@/types/Entrenamiento'

type EntrenamientoSinId = Omit<Entrenamiento, 'id'>

const NOMBRE_COLECCION = 'entrenamientos'

const entrenamientoCollection = collection(db, NOMBRE_COLECCION)

const esEntrenamientoSinId = (data: Record<string, unknown>): data is EntrenamientoSinId =>
  typeof data.fecha === 'string' &&
  typeof data.duracion === 'number' &&
  typeof data.distancia === 'number'

const obtenerDatosPersistibles = (entrenamiento: Entrenamiento): EntrenamientoSinId => ({
  fecha: entrenamiento.fecha,
  duracion: entrenamiento.duracion,
  distancia: entrenamiento.distancia,
})

export const guardarEntrenamiento = async (entrenamiento: Entrenamiento): Promise<void> => {
  await addDoc(entrenamientoCollection, obtenerDatosPersistibles(entrenamiento))
}

export const actualizarEntrenamiento = async (entrenamiento: Entrenamiento): Promise<void> => {
  if (!entrenamiento.id) {
    throw new Error('No se puede actualizar un entrenamiento sin id.')
  }

  const entrenamientoRef = doc(db, NOMBRE_COLECCION, entrenamiento.id)
  await updateDoc(entrenamientoRef, obtenerDatosPersistibles(entrenamiento))
}

export const eliminarEntrenamiento = async (id: string): Promise<void> => {
  const entrenamientoRef = doc(db, NOMBRE_COLECCION, id)
  await deleteDoc(entrenamientoRef)
}

export const escucharEntrenamientos = (
  onEntrenamientosChange: (entrenamientos: Entrenamiento[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const entrenamientosQuery = query(entrenamientoCollection, orderBy('fecha', 'desc'))

  return onSnapshot(
    entrenamientosQuery,
    (snapshot) => {
      const entrenamientos = snapshot.docs.flatMap<Entrenamiento>((documento) => {
        const data = documento.data() as Record<string, unknown>

        if (!esEntrenamientoSinId(data)) {
          return []
        }

        return [{
          id: documento.id,
          fecha: data.fecha,
          duracion: data.duracion,
          distancia: data.distancia,
        }]
      })

      onEntrenamientosChange(entrenamientos)
    },
    onError,
  )
}
