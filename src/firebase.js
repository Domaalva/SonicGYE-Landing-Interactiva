// src/firebase.js
// Esta versión usa fetch() directo contra el REST API de Firebase Realtime Database.

const DATABASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, "");

if (!DATABASE_URL) {
  throw new Error(
    "Falta VITE_FIREBASE_DATABASE_URL en el archivo .env para cargar los mensajes."
  );
}

const MESSAGES_ENDPOINT = `${DATABASE_URL}/messages.json`;

export async function saveContactMessage(message) {
  const payload = {
    ...message,
    createdAt: Date.now(),
  };

  const res = await fetch(MESSAGES_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Error al guardar el mensaje: ${res.status}`);
  }

  const data = await res.json();

  return {
    id: data.name,
    ...payload,
  };
}

export async function loadContactMessages() {
  const res = await fetch(MESSAGES_ENDPOINT, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Error al cargar los mensajes: ${res.status}`);
  }

  const data = await res.json();

  if (!data) {
    return [];
  }

  return Object.entries(data)
    .map(([id, value]) => ({ id, ...value }))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}