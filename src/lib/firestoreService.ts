import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  addDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Client, WorkoutPlan, Exercise, ChatMessage, TrainerProfile } from '@/types';
import { INITIAL_PLANS, INITIAL_EXERCISES } from '@/data/mockData';

const CLIENTS_COLLECTION = 'clients';
const PLANS_COLLECTION = 'plans';
const EXERCISES_COLLECTION = 'exercises';
const MESSAGES_COLLECTION = 'messages';

// --- Perfil del Entrenador ---

export const DEFAULT_TRAINER_PROFILE: TrainerProfile = {
  name: 'Tami Fit',
  role: 'trainer',
  avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&auto=format&fit=crop&q=80',
  title: 'Head Coach & Nutrición'
};

const TRAINER_CONFIG_DOC_ID = 'trainer-profile-meta';

export const subscribeToTrainerProfile = (callback: (profile: TrainerProfile) => void) => {
  // Store trainer config in EXERCISES collection under 'trainer-profile-meta'
  // to avoid polluting the clients collection and adhere to firestore rules (requires name: string)
  const docRef = doc(db, EXERCISES_COLLECTION, TRAINER_CONFIG_DOC_ID);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const loaded = {
        name: data.name || DEFAULT_TRAINER_PROFILE.name,
        role: 'trainer' as const,
        avatar: data.avatar || DEFAULT_TRAINER_PROFILE.avatar,
        title: data.title || DEFAULT_TRAINER_PROFILE.title
      };
      if (typeof window !== 'undefined' && loaded.avatar) {
        localStorage.setItem('tamifit_trainer_avatar', loaded.avatar);
      }
      callback(loaded);
    } else {
      // Check localStorage for offline cached avatar
      const cachedAvatar = typeof window !== 'undefined' ? localStorage.getItem('tamifit_trainer_avatar') : null;
      callback({
        ...DEFAULT_TRAINER_PROFILE,
        ...(cachedAvatar ? { avatar: cachedAvatar } : {})
      });
    }
  }, (err) => {
    console.error('Error fetching trainer profile in real-time:', err);
    const cachedAvatar = typeof window !== 'undefined' ? localStorage.getItem('tamifit_trainer_avatar') : null;
    callback({
      ...DEFAULT_TRAINER_PROFILE,
      ...(cachedAvatar ? { avatar: cachedAvatar } : {})
    });
  });
};

export const updateTrainerProfileInCloud = async (partial: Partial<TrainerProfile>): Promise<void> => {
  try {
    if (typeof window !== 'undefined' && partial.avatar) {
      try {
        localStorage.setItem('tamifit_trainer_avatar', partial.avatar);
      } catch (e) {
        // quota exceeded or private mode, safe to continue
      }
    }
    const docRef = doc(db, EXERCISES_COLLECTION, TRAINER_CONFIG_DOC_ID);
    const payload = {
      name: partial.name || 'Tami Fit Coach',
      role: 'trainer',
      avatar: partial.avatar || DEFAULT_TRAINER_PROFILE.avatar,
      title: partial.title || DEFAULT_TRAINER_PROFILE.title,
      updatedAt: Date.now()
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    console.error('Error updating trainer profile in cloud:', err);
    throw err;
  }
};

// --- Clientes (Alumnos) ---

export const subscribeToClients = (callback: (clients: Client[]) => void) => {
  const colRef = collection(db, CLIENTS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    const clientsList: Client[] = [];
    snapshot.forEach((docSnap) => {
      // Exclude trainer or system documents strictly
      const data = docSnap.data();
      const isTrainer = 
        docSnap.id === 'trainer-profile' || 
        docSnap.id === 'system-settings' ||
        data.role === 'trainer' ||
        (data.name && String(data.name).trim().toLowerCase() === 'tamifit');

      if (!isTrainer) {
        clientsList.push({ id: docSnap.id, ...data } as Client);
      }
    });
    callback(clientsList);
  }, (err) => {
    console.error('Error fetching clients in real-time:', err);
  });
};

export const subscribeToSingleClient = (clientId: string, callback: (client: Client | null) => void) => {
  const docRef = doc(db, CLIENTS_COLLECTION, clientId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as Client);
    } else {
      callback(null);
    }
  }, (err) => {
    console.error('Error fetching single client in real-time:', err);
  });
};

export const saveClientToCloud = async (client: Client): Promise<void> => {
  const docRef = doc(db, CLIENTS_COLLECTION, client.id);
  await setDoc(docRef, client, { merge: true });
};

export const updateClientInCloud = async (clientId: string, partial: Partial<Client>): Promise<void> => {
  try {
    const cleanData = JSON.parse(JSON.stringify(partial));
    const docRef = doc(db, CLIENTS_COLLECTION, clientId);
    await setDoc(docRef, cleanData, { merge: true });
  } catch (err) {
    console.error('Error updating client in cloud:', err);
    throw err;
  }
};

export const deleteClientFromCloud = async (clientId: string): Promise<void> => {
  const docRef = doc(db, CLIENTS_COLLECTION, clientId);
  await deleteDoc(docRef);
};

// --- Planes de entrenamiento ---

export const subscribeToPlans = (callback: (plans: WorkoutPlan[]) => void) => {
  const colRef = collection(db, PLANS_COLLECTION);
  return onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty) {
      // Seed initial default plans once
      for (const p of INITIAL_PLANS) {
        await setDoc(doc(db, PLANS_COLLECTION, p.id), p);
      }
      return;
    }
    const plansList: WorkoutPlan[] = [];
    snapshot.forEach((docSnap) => {
      plansList.push({ id: docSnap.id, ...docSnap.data() } as WorkoutPlan);
    });
    callback(plansList);
  }, (err) => {
    console.error('Error listening to plans:', err);
  });
};

export const savePlanToCloud = async (plan: WorkoutPlan): Promise<void> => {
  const docRef = doc(db, PLANS_COLLECTION, plan.id);
  await setDoc(docRef, plan, { merge: true });
};

// --- Biblioteca de ejercicios ---

export const subscribeToExercises = (callback: (exercises: Exercise[]) => void) => {
  const colRef = collection(db, EXERCISES_COLLECTION);
  return onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty) {
      // Seed default exercise library
      for (const ex of INITIAL_EXERCISES) {
        await setDoc(doc(db, EXERCISES_COLLECTION, ex.id), ex);
      }
      return;
    }
    const list: Exercise[] = [];
    snapshot.forEach((docSnap) => {
      if (docSnap.id !== TRAINER_CONFIG_DOC_ID) {
        list.push({ id: docSnap.id, ...docSnap.data() } as Exercise);
      }
    });
    callback(list);
  }, (err) => {
    console.error('Error listening to exercises:', err);
  });
};

export const saveExerciseToCloud = async (exercise: Exercise): Promise<void> => {
  const docRef = doc(db, EXERCISES_COLLECTION, exercise.id);
  await setDoc(docRef, exercise, { merge: true });
};

export const deleteExerciseFromCloud = async (exerciseId: string): Promise<void> => {
  const docRef = doc(db, EXERCISES_COLLECTION, exerciseId);
  await deleteDoc(docRef);
};

// --- Chat Messages ---

export const subscribeToClientMessages = (clientId: string, callback: (messages: ChatMessage[]) => void) => {
  const colRef = collection(db, MESSAGES_COLLECTION);
  const q = query(colRef, where('clientId', '==', clientId));
  
  return onSnapshot(q, (snapshot) => {
    const msgs: ChatMessage[] = [];
    snapshot.forEach(docSnap => {
      msgs.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
    });
    // Sort by timestamp if possible or id
    msgs.sort((a, b) => a.id.localeCompare(b.id));
    callback(msgs);
  }, (err) => {
    console.error('Error listening to chat messages:', err);
  });
};

export const subscribeToAllMessages = (callback: (messagesByClient: Record<string, ChatMessage[]>) => void) => {
  const colRef = collection(db, MESSAGES_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    const grouped: Record<string, ChatMessage[]> = {};
    snapshot.forEach((docSnap) => {
      const msg = { id: docSnap.id, ...docSnap.data() } as ChatMessage;
      if (msg.clientId) {
        if (!grouped[msg.clientId]) grouped[msg.clientId] = [];
        grouped[msg.clientId].push(msg);
      }
    });
    Object.keys(grouped).forEach(k => {
      grouped[k].sort((a, b) => a.id.localeCompare(b.id));
    });
    callback(grouped);
  }, (err) => {
    console.error('Error listening to all messages:', err);
  });
};

export const sendChatMessageToCloud = async (message: ChatMessage): Promise<void> => {
  const docRef = doc(db, MESSAGES_COLLECTION, message.id);
  await setDoc(docRef, message);
};

export const markClientMessagesAsRead = async (clientId: string): Promise<void> => {
  try {
    const colRef = collection(db, MESSAGES_COLLECTION);
    const q = query(
      colRef,
      where('clientId', '==', clientId),
      where('senderRole', '==', 'client'),
      where('isRead', '==', false)
    );
    const snap = await getDocs(q);
    const updates = snap.docs.map(d => updateDoc(d.ref, { isRead: true }));
    await Promise.all(updates);
  } catch (err) {
    console.error('Error marking messages as read:', err);
  }
};
