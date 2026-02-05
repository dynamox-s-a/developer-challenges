import { render, screen, fireEvent } from '@testing-library/react';
import { MachineCard } from './machine-card';
import { describe, it, expect, vi } from 'vitest';

describe('MachineCard', () => {
  const mockMachine = {
    id: '1',
    name: 'Test Machine',
    type: 'Pump',
    status: 'Operating'
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders machine details correctly', () => {
    // 1. Renderiza o componente
    render(
      <MachineCard
        machine={mockMachine}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // 2. Verifica se as informações estão na tela
    expect(screen.getByText('Test Machine')).toBeTruthy();
    expect(screen.getByText('Pump')).toBeTruthy();
    // Use getByText(matcher) com regex ou exatidão conforme necessario
    expect(screen.getByText('Operating')).toBeTruthy();
  });

  it('calls onEdit when Edit button is clicked', () => {
    render(
      <MachineCard
        machine={mockMachine}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // 3. Simula interação do usuário
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // 4. Verifica se a função foi chamada
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when Delete button is clicked', () => {
    render(
      <MachineCard
        machine={mockMachine}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
