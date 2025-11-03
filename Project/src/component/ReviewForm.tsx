import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  addReview,
  findReviewByAuthor,
  editReviewById,
} from "../utils/reviews";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  productId: number;
  onSubmitted?: () => void;
  open?: boolean;
  onClose?: () => void;
};

export default function ReviewForm({
  productId,
  onSubmitted,
  open,
  onClose,
}: Props) {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const existing = findReviewByAuthor(productId, currentUser.id);
    if (existing) {
      setIsEditing(true);
      setEditingReviewId(existing.id);
      setRating(existing.rating);
      setComment(existing.comment);
      // Ocultar el formulario por defecto si ya existe una reseña del usuario
      setShowForm(false);
    } else {
      setIsEditing(false);
      setEditingReviewId(null);
      setRating(5);
      setComment("");
      setShowForm(true);
    }
  }, [productId, currentUser]);

  // Si el padre manda 'open', abrir el formulario
  useEffect(() => {
    if (open) setShowForm(true);
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return; // requiere sesión
    if (!comment.trim()) return;
    setSaving(true);
    try {
      const authorName = `${currentUser.nombre}${
        currentUser.apellido ? " " + currentUser.apellido : ""
      }`;
      let result;
      if (isEditing && editingReviewId) {
        // editar reseña existente
        result = editReviewById(productId, editingReviewId, {
          rating: Number(rating),
          comment: comment.trim(),
        });
      } else {
        // crear nueva reseña, vinculada al usuario
        result = addReview(productId, {
          author: authorName,
          authorId: currentUser.id,
          rating: Number(rating),
          comment: comment.trim(),
        });
      }

      if (result) {
        // actualizar estado local con la reseña guardada y ocultar el formulario
        setIsEditing(true);
        setEditingReviewId(result.id);
        setRating(result.rating);
        setComment(result.comment);
        setShowForm(false);
        onSubmitted && onSubmitted();
      }
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="mt-4 alert alert-info">
        <p className="mb-2">
          Debes <Link to="/login">iniciar sesión</Link> para publicar una
          reseña.
        </p>
      </div>
    );
  }

  const author = `${currentUser.nombre}${
    currentUser.apellido ? " " + currentUser.apellido : ""
  }`;

  // If the user already has a review and the form is hidden, don't render
  // a duplicate compact block here. The parent (`ReviewList`) shows the
  // top-level "Editar mi reseña" control which should open the form via
  // the `open` prop. Returning null avoids duplicate rendering.
  if (isEditing && !showForm) {
    return null;
  }

  return (
    <form id="review-form" onSubmit={handleSubmit} className="mt-4">
      <h5 className="mb-3">
        {isEditing ? "Editar mi reseña" : "Escribir una reseña"}
      </h5>

      <div className="mb-2">
        <label className="form-label">Nombre de cuenta</label>
        <input className="form-control" value={author} disabled />
      </div>

      <div className="mb-2">
        <label className="form-label">Puntuación</label>
        <div className="d-flex align-items-center">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            return (
              <button
                key={i}
                type="button"
                aria-label={`${starValue} estrellas`}
                className="btn p-0 border-0 bg-transparent me-2"
                onClick={() => setRating(starValue)}
              >
                <i
                  className={
                    starValue <= rating
                      ? "bi bi-star-fill text-warning fs-4"
                      : "bi bi-star text-muted fs-4"
                  }
                />
              </button>
            );
          })}
          <span className="ms-2 small text-muted">{rating} / 5</span>
        </div>
      </div>

      <div className="mb-2">
        <label className="form-label">Comentario</label>
        <textarea
          className="form-control"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {isEditing ? "Guardar cambios" : "Enviar reseña"}
        </button>
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => {
            setComment("");
            setRating(5);
          }}
        >
          Limpiar
        </button>
        {isEditing && (
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => {
              // cerrar editor y mostrar la vista compacta
              setShowForm(false);
              onClose && onClose();
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
