import { render, screen } from '@testing-library/react';
import TaskCard from '@/components/tasks/TaskCard';
import { Task, Priority } from '@/types';

describe('TaskCard', () => {
  const mockTask: Task = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test description',
    position: 0,
    priority: Priority.HIGH,
    dueDate: new Date('2024-12-31'),
    startDate: null,
    timeEstimate: 120,
    timeSpent: null,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    boardId: 'board-1',
    columnId: 'column-1',
  };

  it('renders task title', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('displays priority badge', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<TaskCard task={mockTask} onClick={handleClick} />);
    
    const card = screen.getByText('Test Task').closest('.task-card');
    card?.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies selected class when selected', () => {
    const { container } = render(
      <TaskCard task={mockTask} isSelected={true} />
    );
    
    expect(container.querySelector('.selected')).toBeInTheDocument();
  });
});

