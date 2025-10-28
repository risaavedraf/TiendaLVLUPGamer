import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Review } from "../utils/reviews";
import {
  getReviews,
  getAverageRating,
  findReviewByAuthor,
} from "../utils/reviews";

type Props = {
  productId: number;
  refreshVersion?: number;
  onEditClick?: () => void;
};

function Stars({ value }: { value: number }) {
  // Support half stars: for fractional values we show a half star when
  // fraction is between 0.25 and 0.75, round up when >= 0.75.
  let fullCount = Math.floor(value);
  const frac = value - fullCount;
  let half = false;
  if (frac >= 0.75) {
    fullCount += 1;
  } else if (frac >= 0.25) {
    half = true;
  }

  return (
    <span aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < fullCount) {
          return <i key={i} className="bi bi-star-fill text-warning" />;
        }
        if (i === fullCount && half) {
          return <i key={i} className="bi bi-star-half text-warning" />;
        }
        return <i key={i} className="bi bi-star text-muted" />;
      })}
    </span>
  );
}

export default function ReviewList({
  productId,
  refreshVersion = 0,
  onEditClick,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { currentUser } = useAuth();
  const [myReview, setMyReview] = useState<Review | null>(null);

  useEffect(() => {
    setReviews(getReviews(productId));
  }, [productId, refreshVersion]);

  // Ocultar la reseña del usuario en la lista principal para evitar duplicados
  const displayedReviews = reviews.filter((r) => {
    try {
      return !(currentUser && (r as any).authorId === currentUser.id);
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (!currentUser) {
        setMyReview(null);
        return;
      }
      const found = findReviewByAuthor(productId, currentUser.id);
      setMyReview(found);
    } catch (e) {
      console.error("Error al obtener la reseña del usuario", e);
      setMyReview(null);
    }
  }, [productId, refreshVersion, currentUser]);

  const avg = getAverageRating(productId);

  return (
    <div className="mt-5">
      <h3 className="mb-3">Reseñas</h3>
      <div className="mb-3">
        {avg ? (
          <div>
            <strong>{avg} / 5</strong>
            <span className="ms-2">
              <Stars value={avg} />
            </span>
            <span className="text-muted ms-2">({reviews.length} reseñas)</span>
            {myReview && (
              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-link p-0 small"
                  onClick={() => onEditClick && onEditClick()}
                >
                  ✎ Editar mi reseña
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted">
            Aún no hay reseñas. Sé el primero en escribir una.
          </div>
        )}
      </div>

      <div className="list-group">
        {displayedReviews.map((r) => (
          <div key={r.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{r.author}</strong>
                <div className="small text-muted">
                  {new Date(r.date).toLocaleString()}
                </div>
              </div>
              <div className="text-end">
                <div className="fw-bold">{r.rating}/5</div>
                <div>
                  <Stars value={r.rating} />
                </div>
              </div>
            </div>
            <p className="mb-0 mt-2">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
