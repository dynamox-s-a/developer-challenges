import { render, screen } from '@testing-library/react';
import EventCard from '@/components/EventCard';
import { Event } from '@/types';

const mockEvent: Event = {
  id: 1,
  name: 'Test Event',
  dateTime: '2026-03-15T09:00:00',
  location: 'Test Location',
  description: 'Test description with more than fifty characters to meet the minimum requirement',
  category: 'Conference',
  createdAt: '2026-02-01T10:00:00',
  updatedAt: '2026-02-01T10:00:00',
};

describe('EventCard', () => {
  it('renders event information correctly', () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('Conference')).toBeInTheDocument();
  });

  it('shows edit and delete buttons for admin', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <EventCard 
        event={mockEvent} 
        isAdmin 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
    );

    expect(screen.getByLabelText('edit event')).toBeInTheDocument();
    expect(screen.getByLabelText('delete event')).toBeInTheDocument();
  });

  it('does not show edit and delete buttons for non-admin', () => {
    render(<EventCard event={mockEvent} isAdmin={false} />);

    expect(screen.queryByLabelText('edit event')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('delete event')).not.toBeInTheDocument();
  });

  it('shows "Past Event" chip for past events', () => {
    const pastEvent = {
      ...mockEvent,
      dateTime: '2020-01-01T09:00:00',
    };

    render(<EventCard event={pastEvent} />);

    expect(screen.getByText('Past Event')).toBeInTheDocument();
  });
});
