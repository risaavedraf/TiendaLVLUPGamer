import { usersArray } from "../data/users";
import type { User } from "../data/users";

export type Review = {
  id: string;
  author: string;
  authorId?: number; // opcional: id del usuario registrado
  rating: number; // 1-5
  comment: string;
  date: string; // ISO
};

type ReviewsStore = Record<number, Review[]>;

const STORAGE_KEY = "tiendalvlup_reviews_v1";

function readStore(): ReviewsStore {
  try {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined"
    )
      return {};
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ReviewsStore;
  } catch (e) {
    console.error("Error leyendo reseñas desde localStorage", e);
    return {};
  }
}

function writeStore(store: ReviewsStore) {
  try {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined"
    )
      return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error("Error guardando reseñas en localStorage", e);
  }
}

export function getReviews(productId: number): Review[] {
  const store = readStore();
  return store[productId]
    ? [...store[productId]].sort(
        (a, b) => +new Date(b.date) - +new Date(a.date)
      )
    : [];
}

export function addReview(
  productId: number,
  review: Omit<Review, "id" | "date">
) {
  const store = readStore();
  const list = store[productId] || [];

  // Si llega authorId y ya existe reseña de ese authorId, actualizamos esa reseña
  if (review.authorId) {
    const existingIndex = list.findIndex(
      (r) => (r as any).authorId === review.authorId
    );
    if (existingIndex >= 0) {
      const updated: Review = {
        ...list[existingIndex],
        ...review,
        date: new Date().toISOString(),
      };
      list[existingIndex] = updated;
      store[productId] = list;
      writeStore(store);
      return updated;
    }
  }

  const id = `${productId}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const newReview: Review = { ...review, id, date: new Date().toISOString() };
  store[productId] = [newReview, ...list];
  writeStore(store);
  return newReview;
}

export function clearAllReviewsForProduct(productId: number) {
  const store = readStore();
  delete store[productId];
  writeStore(store);
}

export function clearAllReviews() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Error limpiando reseñas", e);
  }
}

export function getAverageRating(productId: number): number | null {
  const reviews = getReviews(productId);
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // un decimal
}

export function findReviewByAuthor(productId: number, authorId: number) {
  const list = readStore()[productId] || [];
  return list.find((r) => (r as any).authorId === authorId) || null;
}

export function editReviewById(
  productId: number,
  reviewId: string,
  updates: Partial<Pick<Review, "rating" | "comment">>
) {
  const store = readStore();
  const list = store[productId] || [];
  const idx = list.findIndex((r) => r.id === reviewId);
  if (idx === -1) return null;
  const updated: Review = {
    ...list[idx],
    ...updates,
    date: new Date().toISOString(),
  };
  list[idx] = updated;
  store[productId] = list;
  writeStore(store);
  return updated;
}

// Llena localStorage con algunas reseñas de ejemplo usando usuarios ya registrados.
export function seedDemoReviews() {
  try {
    const existing = readStore();
    if (Object.keys(existing).length > 0) return; // ya hay reseñas, no sobreescribir
    const demo: ReviewsStore = {};
    const now = Date.now();

    const sampleComments = [
      "Excelente producto, muy buena calidad y entrega rápida.",
      "Buena relación precio-calidad, lo recomiendo.",
      "No cumplió mis expectativas en cuanto a durabilidad.",
      "Perfecto para gaming, cómodo y con buena respuesta.",
      "El envío tardó un poco, pero el producto es bueno.",
    ];

    // Tomamos hasta 3 usuarios del array importado para autor y authorId
    const demoAuthors = (usersArray || []).slice(0, 3);

    // Crear reseñas para algunos productos (incluyendo authorId cuando exista)
    demo[1] = [
      {
        id: `1_${now}_a`,
        author: demoAuthors[0]
          ? `${demoAuthors[0].nombre}${
              demoAuthors[0].apellido ? " " + demoAuthors[0].apellido : ""
            }`
          : "Usuario1",
        authorId: demoAuthors[0]?.id,
        rating: 5,
        comment: sampleComments[0],
        date: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      },
      {
        id: `1_${now}_b`,
        author: demoAuthors[1]
          ? `${demoAuthors[1].nombre}${
              demoAuthors[1].apellido ? " " + demoAuthors[1].apellido : ""
            }`
          : "Usuario2",
        authorId: demoAuthors[1]?.id,
        rating: 4,
        comment: sampleComments[1],
        date: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
      },
    ];

    demo[2] = [
      {
        id: `2_${now}_a`,
        author: demoAuthors[2]
          ? `${demoAuthors[2].nombre}${
              demoAuthors[2].apellido ? " " + demoAuthors[2].apellido : ""
            }`
          : "Usuario3",
        authorId: demoAuthors[2]?.id,
        rating: 3,
        comment: sampleComments[2],
        date: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
      },
    ];

    demo[3] = [
      {
        id: `3_${now}_a`,
        author: demoAuthors[0]
          ? `${demoAuthors[0].nombre}${
              demoAuthors[0].apellido ? " " + demoAuthors[0].apellido : ""
            }`
          : "Usuario1",
        authorId: demoAuthors[0]?.id,
        rating: 5,
        comment: sampleComments[3],
        date: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
      },
      {
        id: `3_${now}_b`,
        author: demoAuthors[1]
          ? `${demoAuthors[1].nombre}${
              demoAuthors[1].apellido ? " " + demoAuthors[1].apellido : ""
            }`
          : "Usuario2",
        authorId: demoAuthors[1]?.id,
        rating: 4,
        comment: sampleComments[4],
        date: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
      },
    ];

    writeStore(demo);
    console.info("Reseñas de ejemplo creadas en localStorage");
  } catch (e) {
    console.error("No se pudieron sembrar reseñas demo:", e);
  }
}

export default {
  getReviews,
  addReview,
  getAverageRating,
  findReviewByAuthor,
  editReviewById,
  clearAllReviews,
  clearAllReviewsForProduct,
};
