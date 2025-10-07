import {
  cn,
  formatDate,
  formatRelativeTime,
  getPriorityColor,
  isOverdue,
  getInitials,
} from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });

    it('returns empty string for null', () => {
      expect(formatDate(null)).toBe('');
    });
  });

  describe('getPriorityColor', () => {
    it('returns correct color for LOW priority', () => {
      expect(getPriorityColor('LOW')).toContain('blue');
    });

    it('returns correct color for URGENT priority', () => {
      expect(getPriorityColor('URGENT')).toContain('red');
    });
  });

  describe('isOverdue', () => {
    it('returns true for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(isOverdue(pastDate)).toBe(true);
    });

    it('returns false for future dates', () => {
      const futureDate = new Date('2030-01-01');
      expect(isOverdue(futureDate)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isOverdue(null)).toBe(false);
    });
  });

  describe('getInitials', () => {
    it('returns initials for full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('returns initials for single name', () => {
      expect(getInitials('John')).toBe('JO');
    });

    it('handles empty string', () => {
      expect(getInitials('')).toBe('');
    });
  });
});


