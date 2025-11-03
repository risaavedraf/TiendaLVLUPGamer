import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import { getAverageRating } from "../utils/reviews";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  title: string;
  products: Product[];
  limit?: number; // how many products to consider from the list
  visible?: number; // how many items to show at once
};

export default function CategoryCarousel({
  title,
  products,
  limit = 6,
  visible = 3,
}: Props) {
  const base = products.slice(0, limit);
  const len = base.length;
  const visibleCount = Math.min(visible, len || 1);

  // triple clone technique for infinite seamless loop
  const items = [...base, ...base, ...base];

  // start in the middle copy (index into the triple items array)
  const startIndex = len;
  const [index, setIndex] = useState(startIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [itemWidth, setItemWidth] = useState(0); // px

  if (len === 0) return null;

  // compute pixel widths on mount / resize
  useEffect(() => {
    const calc = () => {
      const container = containerRef.current;
      if (!container) return;
      const w = container.clientWidth;
      setItemWidth(w / visibleCount);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [visibleCount]);

  const goNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIndex((i) => i - 1);
  };

  // after transition ends, if we've moved into clones, reset to middle copy without animation
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const handleTransitionEnd = () => {
      setIsTransitioning(false);
      // normalize index
      if (index >= len * 2) {
        setIndex((idx) => idx - len);
        if (el) {
          el.style.transition = "none";
          void el.offsetWidth;
          el.style.transition = "transform 300ms ease";
        }
      }
      if (index < len) {
        setIndex((idx) => idx + len);
        if (el) {
          el.style.transition = "none";
          void el.offsetWidth;
          el.style.transition = "transform 300ms ease";
        }
      }
    };

    el.addEventListener("transitionend", handleTransitionEnd);
    return () => el.removeEventListener("transitionend", handleTransitionEnd);
  }, [index, len]);

  const trackStyle: React.CSSProperties = {
    display: "flex",
    transform:
      itemWidth > 0
        ? `translateX(-${index * itemWidth}px)`
        : `translateX(-${(index * 100) / visibleCount}%)`,
    transition: "transform 300ms ease",
    width:
      itemWidth > 0
        ? `${items.length * itemWidth}px`
        : `${items.length * (100 / visibleCount)}%`,
  };
  const { currentUser } = useAuth();
  const discountPercent =
    currentUser &&
    currentUser.email &&
    (currentUser.email.endsWith("@duocuc.cl") ||
      currentUser.email.endsWith("@profesor.duoc.cl"))
      ? 0.1
      : 0;

  return (
    <section className="mb-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="m-0">{title}</h4>
        <div>
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={goPrev}
            aria-label="Anterior"
          >
            ◀
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={goNext}
            aria-label="Siguiente"
          >
            ▶
          </button>
        </div>
      </div>

      <div
        className="category-carousel"
        ref={containerRef}
        style={{ overflow: "hidden" }}
      >
        <div
          ref={trackRef}
          style={{ ...trackStyle, gap: 0, boxSizing: "border-box" }}
        >
          {items.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              className="card shadow-sm"
              // use measured pixel width when available, otherwise fall back to percent
              style={{
                minWidth:
                  itemWidth > 0 ? `${itemWidth}px` : `${100 / visibleCount}%`,
                maxWidth:
                  itemWidth > 0 ? `${itemWidth}px` : `${100 / visibleCount}%`,
                flex:
                  itemWidth > 0
                    ? `0 0 ${itemWidth}px`
                    : `0 0 ${100 / visibleCount}%`,
              }}
            >
              <Link
                to={`/producto/${p.id}`}
                className="text-decoration-none text-reset d-block h-100"
              >
                <img
                  src={p.img}
                  className="card-img-top"
                  alt={p.nombre}
                  style={{ height: 140, objectFit: "contain", padding: "1rem" }}
                />
                <div className="card-body p-2">
                  <div className="mb-1 small text-muted">
                    {p.categoria.nombre}
                  </div>
                  <h6
                    className="card-title mb-1"
                    style={{ fontSize: "0.95rem" }}
                  >
                    {p.nombre}
                  </h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-primary fw-bold">
                      {discountPercent > 0 ? (
                        <>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#888",
                              fontSize: "0.9rem",
                              marginRight: 6,
                            }}
                          >
                            ${p.precio.toFixed(2)}
                          </span>
                          <span>
                            ${(p.precio * (1 - discountPercent)).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <>${p.precio.toFixed(2)}</>
                      )}
                    </div>
                    <div className="small text-muted">
                      {(getAverageRating(p.id) ?? 0).toFixed(1)} ⭐
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
