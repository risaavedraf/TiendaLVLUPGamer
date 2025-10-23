// Archivo: Project/src/pages/ProductosPage.tsx

import { useState } from 'react';
import ProductList from '../component/ProductList';
import { productosArray } from '../data/products';

function ProductosPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [priceRange, setPriceRange] = useState<string>('Todos');
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [sortBy, setSortBy] = useState<string>('default');
  const [showFilters, setShowFilters] = useState(false); // Nuevo estado

  // Obtener categorías únicas
  const categories = ['Todos', ...Array.from(new Set(productosArray.map(p => p.categoria.nombre)))];

  // Rangos de precio
  const priceRanges = [
    { label: 'Todos', min: 0, max: Infinity },
    { label: '$0 - $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $300', min: 100, max: 300 },
    { label: '$300+', min: 300, max: Infinity }
  ];

  // Filtrar productos por categoría y precio
  let filteredProducts = selectedCategory === 'Todos' 
    ? productosArray 
    : productosArray.filter(p => p.categoria.nombre === selectedCategory);

  // Aplicar filtro de precio
  if (priceRange !== 'Todos') {
    const range = priceRanges.find(r => r.label === priceRange);
    if (range) {
      filteredProducts = filteredProducts.filter(p => p.precio >= range.min && p.precio < range.max);
    }
  }

  // Ordenar productos
  if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.precio - b.precio);
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.precio - a.precio);
  } else if (sortBy === 'name') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  // Calcular índices para la paginación
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceChange = (range: string) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // Calcular rango de productos mostrados
  const startItem = indexOfFirstProduct + 1;
  const endItem = Math.min(indexOfLastProduct, filteredProducts.length);

  return (
    <div className="bg-light py-4">
      <div className="container-fluid px-4">
        <div className="row">
          {/* Botón de filtros para móvil */}
          <div className="col-12 d-lg-none mb-3">
            <button 
              className="btn btn-primary w-100 d-flex justify-content-between align-items-center"
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="filtrosMovil"
            >
              <span>
                <i className="bi bi-funnel me-2"></i>
                Filtros {(selectedCategory !== 'Todos' || priceRange !== 'Todos') && '✓'}
              </span>
              <i className={`bi ${showFilters ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            </button>
          </div>

          {/* Sidebar de filtros - Solo visible cuando está expandido en móvil, siempre visible en desktop */}
          <div className={`col-lg-3 mb-4 ${showFilters ? '' : 'd-none d-lg-block'}`}>
            <div className="bg-white rounded-3 shadow-sm p-4">
              {/* Header de filtros con contador */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0 fw-bold text-primary">
                  {selectedCategory === 'Todos' ? 'Productos' : selectedCategory}
                </h4>
                <span className="badge bg-primary rounded-pill">
                  {filteredProducts.length}
                </span>
              </div>

              {/* Botón limpiar filtros */}
              {(selectedCategory !== 'Todos' || priceRange !== 'Todos') && (
                <button 
                  className="btn btn-sm btn-outline-danger w-100 mb-3"
                  onClick={() => {
                    setSelectedCategory('Todos');
                    setPriceRange('Todos');
                    setCurrentPage(1);
                  }}
                >
                  🗑️ Borrar Filtros
                </button>
              )}

              <hr className="my-3" />

              {/* Filtro por Categoría */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3 text-uppercase" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                  Categoría
                </h6>
                <div className="d-flex flex-column gap-2">
                  {categories.map(category => (
                    <div 
                      key={category} 
                      className={`form-check p-2 rounded ${selectedCategory === category ? 'bg-primary bg-opacity-10' : ''}`}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="category"
                        id={`cat-${category}`}
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <label className="form-check-label d-flex justify-content-between w-100" htmlFor={`cat-${category}`}>
                        <span>{category}</span>
                        <span className="badge bg-secondary rounded-pill">
                          {category === 'Todos' 
                            ? productosArray.length 
                            : productosArray.filter(p => p.categoria.nombre === category).length}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="my-3" />

              {/* Filtro por Precio */}
              <div className="mb-3">
                <h6 className="fw-bold mb-3 text-uppercase" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                  Rango de Precio
                </h6>
                <div className="d-flex flex-column gap-2">
                  {priceRanges.map(range => (
                    <div 
                      key={range.label} 
                      className={`form-check p-2 rounded ${priceRange === range.label ? 'bg-primary bg-opacity-10' : ''}`}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="price"
                        id={`price-${range.label}`}
                        checked={priceRange === range.label}
                        onChange={() => handlePriceChange(range.label)}
                      />
                      <label className="form-check-label" htmlFor={`price-${range.label}`}>
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón aplicar filtros solo en móvil */}
              <div className="d-lg-none mt-3">
                <button 
                  className="btn btn-success w-100"
                  onClick={() => setShowFilters(false)}
                >
                  ✓ Aplicar Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Área de productos - Ajuste dinámico de columnas */}
          <div className={`${showFilters ? 'col-lg-9' : 'col-12 col-lg-9'}`}>
            {/* Barra de control superior */}
            <div className="bg-white rounded-3 shadow-sm p-3 mb-4">
              <div className="row align-items-center g-2">
                {/* Ordenar por */}
                <div className="col-12 col-md-4 col-lg-3">
                  <div className="d-flex align-items-center gap-2">
                    <label htmlFor="sortBy" className="text-nowrap mb-0 fw-semibold small">
                      Ordenar por:
                    </label>
                    <select 
                      id="sortBy"
                      className="form-select form-select-sm"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="default">Predeterminado</option>
                      <option value="name">Nombre (A-Z)</option>
                      <option value="price-asc">Precio: Menor a Mayor</option>
                      <option value="price-desc">Precio: Mayor a Menor</option>
                    </select>
                  </div>
                </div>

                {/* Contador de productos */}
                <div className="col-12 col-md-4 col-lg-6 text-center">
                  <span className="text-muted small">
                    <strong>{startItem}-{endItem}</strong> de <strong>{filteredProducts.length}</strong>
                  </span>
                </div>

                {/* Items por página */}
                <div className="col-12 col-md-4 col-lg-3">
                  <div className="d-flex align-items-center justify-content-end gap-2">
                    <label htmlFor="itemsPerPage" className="text-nowrap mb-0 fw-semibold small">
                      Por página:
                    </label>
                    <select 
                      id="itemsPerPage"
                      className="form-select form-select-sm"
                      style={{ width: '70px' }}
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    >
                      <option value={6}>6</option>
                      <option value={9}>9</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensaje si no hay productos */}
            {currentProducts.length === 0 ? (
              <div className="alert alert-warning text-center py-5">
                <i className="bi bi-exclamation-triangle fs-1 d-block mb-3"></i>
                <h5>No hay productos disponibles</h5>
                <p className="text-muted">Intenta ajustar los filtros para ver más resultados</p>
              </div>
            ) : (
              <>
                {/* Lista de productos */}
                <ProductList products={currentProducts} /> 

                {/* Controles de paginación */}
                {totalPages > 1 && (
                  <div className="bg-white rounded-3 shadow-sm p-3 mt-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      {/* Botón anterior */}
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        ← Anterior
                      </button>

                      {/* Números de página */}
                      <nav>
                        <ul className="pagination mb-0">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(number)}
                              >
                                {number}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </nav>

                      {/* Botón siguiente */}
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductosPage;