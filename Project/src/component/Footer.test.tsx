// En Project/src/component/Footer.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer'; // Asegúrate que la ruta sea correcta

// 'describe' agrupa pruebas
describe('Componente: Footer', () => {

  // 'it' (o 'test') define una prueba específica
  it('debe renderizar el texto de copyright', () => {
    
    // 1. Arrange (Organizar): Renderiza el componente
    render(<Footer />);

    // 2. Act (Actuar): (No es necesario en esta prueba, solo buscamos)
    // screen.debug(); // Descomenta esto para ver el HTML en la consola

    // 3. Assert (Afirmar): Busca el texto en el documento
    const copyrightText = screen.getByText(/© LevelUpGames, Inc. All rights reserved./i);
    
    // Comprueba que el texto existe
    expect(copyrightText).toBeInTheDocument();
  });
});