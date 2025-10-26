import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import FormularioTarea from '../componentes/FormularioTarea';

// Mock de useNavigate y useParams
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ idSeccion: '5' }),
  };
});

// Mock de fetch
global.fetch = vi.fn();

describe('FormularioTarea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockClear();
  });

  test('renderiza el formulario correctamente', () => {
    render(
      <BrowserRouter>
        <FormularioTarea />
      </BrowserRouter>
    );

    expect(screen.getByText('Crear nueva tarea')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre de la tarea:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tipo de tarea:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de vencimiento:/i)).toBeInTheDocument();
    expect(screen.getByText(/Sección ID: 5/i)).toBeInTheDocument();
  });

  test('muestra error cuando faltan campos obligatorios', async () => {
    render(
      <BrowserRouter>
        <FormularioTarea />
      </BrowserRouter>
    );

    const botonCrear = screen.getByRole('button', { name: /Crear Tarea/i });
    fireEvent.click(botonCrear);

    await waitFor(() => {
      expect(screen.getByText('Por favor completa todos los campos.')).toBeInTheDocument();
    });
  });

  test('muestra error cuando no hay idSeccion', () => {
    // Override del mock para este test específico
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({}), // Sin idSeccion
      };
    });

    render(
      <BrowserRouter>
        <FormularioTarea />
      </BrowserRouter>
    );

    const nombreInput = screen.getByLabelText(/Nombre de la tarea:/i);
    const tipoSelect = screen.getByLabelText(/Tipo de tarea:/i);
    const descripcionTextarea = screen.getByLabelText(/Descripción:/i);
    const fechaInput = screen.getByLabelText(/Fecha de vencimiento:/i);

    fireEvent.change(nombreInput, { target: { value: 'Tarea Test' } });
    fireEvent.change(tipoSelect, { target: { value: 'Individual' } });
    fireEvent.change(descripcionTextarea, { target: { value: 'Descripción test' } });
    fireEvent.change(fechaInput, { target: { value: '2025-12-31' } });

    const botonCrear = screen.getByRole('button', { name: /Crear Tarea/i });
    fireEvent.click(botonCrear);

    // El error debe aparecer porque no hay idSeccion
    expect(screen.getByText(/No se pudo identificar la sección/i)).toBeInTheDocument();
  });

  test('envía el formulario correctamente con datos válidos', async () => {
    const mockResponse = {
      idTarea: 1,
      nombre: 'Tarea Test',
      tipo: 'Individual',
      descripcion: 'Descripción test',
      fechaVencimiento: '2025-12-31T00:00:00',
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(
      <BrowserRouter>
        <FormularioTarea />
      </BrowserRouter>
    );

    // Llenar el formulario
    const nombreInput = screen.getByLabelText(/Nombre de la tarea:/i);
    const tipoSelect = screen.getByLabelText(/Tipo de tarea:/i);
    const descripcionTextarea = screen.getByLabelText(/Descripción:/i);
    const fechaInput = screen.getByLabelText(/Fecha de vencimiento:/i);

    fireEvent.change(nombreInput, { target: { value: 'Tarea Test' } });
    fireEvent.change(tipoSelect, { target: { value: 'Individual' } });
    fireEvent.change(descripcionTextarea, { target: { value: 'Descripción test' } });
    fireEvent.change(fechaInput, { target: { value: '2025-12-31' } });

    // Submit
    const botonCrear = screen.getByRole('button', { name: /Crear Tarea/i });
    fireEvent.click(botonCrear);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/tareas',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('"nombre":"Tarea Test"'),
        })
      );
    });

    // Verificar navegación
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/secciones/5/tareas');
    });
  });

  test('muestra error cuando el servidor responde con error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(
      <BrowserRouter>
        <FormularioTarea />
      </BrowserRouter>
    );

    // Llenar el formulario
    const nombreInput = screen.getByLabelText(/Nombre de la tarea:/i);
    const tipoSelect = screen.getByLabelText(/Tipo de tarea:/i);
    const descripcionTextarea = screen.getByLabelText(/Descripción:/i);
    const fechaInput = screen.getByLabelText(/Fecha de vencimiento:/i);

    fireEvent.change(nombreInput, { target: { value: 'Tarea Test' } });
    fireEvent.change(tipoSelect, { target: { value: 'Individual' } });
    fireEvent.change(descripcionTextarea, { target: { value: 'Descripción test' } });
    fireEvent.change(fechaInput, { target: { value: '2025-12-31' } });

    const botonCrear = screen.getByRole('button', { name: /Crear Tarea/i });
    fireEvent.click(botonCrear);

    await waitFor(() => {
      expect(screen.getByText('No se pudo crear la tarea. Inténtalo nuevamente.')).toBeInTheDocument();
    });
  });

  test('limpia el error cuando el usuario escribe', async () => {
    render(
      <BrowserRouter>
        <FormularioTarea />
      </BrowserRouter>
    );

    const botonCrear = screen.getByRole('button', { name: /Crear Tarea/i });
    fireEvent.click(botonCrear);

    // Debe mostrar error
    await waitFor(() => {
      expect(screen.getByText('Por favor completa todos los campos.')).toBeInTheDocument();
    });

    // Escribir en algún campo debe limpiar el error
    const nombreInput = screen.getByLabelText(/Nombre de la tarea:/i);
    fireEvent.change(nombreInput, { target: { value: 'Algo' } });

    expect(screen.queryByText('Por favor completa todos los campos.')).not.toBeInTheDocument();
  });

  test('valida formato de fecha', () => {
    render(
      <BrowserRouter>
        <FormularioTarea />
      </BrowserRouter>
    );

    const fechaInput = screen.getByLabelText(/Fecha de vencimiento:/i);
    
    // El input debe tener type="date"
    expect(fechaInput).toHaveAttribute('type', 'date');
  });
});