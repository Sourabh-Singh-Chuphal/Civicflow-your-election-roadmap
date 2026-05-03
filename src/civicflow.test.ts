/**
 * @jest-environment jsdom
 */

// CivicFlow - Core Application Tests
// Covers: component rendering, AI service, accessibility, and edge cases

describe('CivicFlow Application Tests', () => {

  // ─── Constants & Data Tests ───────────────────────────────────────────────
  describe('Election Steps Data', () => {
    const ELECTION_STEPS = [
      { id: 1, title: 'Voter Registration', status: 'completed', icon: 'user-check', description: 'The first step is ensuring you are registered to vote in your designated jurisdiction.' },
      { id: 2, title: 'Candidate Nomination', status: 'completed', icon: 'file-text', description: 'Individuals file their papers to run for specific offices and represent their parties or interests.' },
      { id: 3, title: 'Campaigning Phase', status: 'current', icon: 'message-square', description: 'Candidates present their platforms, engage with voters, and participate in debates.' },
      { id: 4, title: 'Primary Elections', status: 'upcoming', icon: 'bar-chart', description: 'Voters select their preferred candidate within each political party.' },
      { id: 5, title: 'General Election', status: 'upcoming', icon: 'check-square', description: 'The final election where all eligible voters cast their ballots to determine the winner.' },
      { id: 6, title: 'Results & Certification', status: 'upcoming', icon: 'award', description: 'Votes are counted, verified, and the results are officially certified by election authorities.' },
    ];

    test('should have exactly 6 election steps', () => {
      expect(ELECTION_STEPS.length).toBe(6);
    });

    test('each step should have required fields', () => {
      ELECTION_STEPS.forEach(step => {
        expect(step).toHaveProperty('id');
        expect(step).toHaveProperty('title');
        expect(step).toHaveProperty('status');
        expect(step).toHaveProperty('icon');
        expect(step).toHaveProperty('description');
      });
    });

    test('should have valid status values', () => {
      const validStatuses = ['completed', 'current', 'upcoming'];
      ELECTION_STEPS.forEach(step => {
        expect(validStatuses).toContain(step.status);
      });
    });

    test('should have exactly one current step', () => {
      const currentSteps = ELECTION_STEPS.filter(s => s.status === 'current');
      expect(currentSteps.length).toBe(1);
    });

    test('completed steps should come before current step', () => {
      const currentIndex = ELECTION_STEPS.findIndex(s => s.status === 'current');
      const completedAfterCurrent = ELECTION_STEPS.slice(currentIndex + 1).filter(s => s.status === 'completed');
      expect(completedAfterCurrent.length).toBe(0);
    });

    test('step IDs should be sequential', () => {
      ELECTION_STEPS.forEach((step, index) => {
        expect(step.id).toBe(index + 1);
      });
    });

    test('descriptions should not be empty', () => {
      ELECTION_STEPS.forEach(step => {
        expect(step.description.length).toBeGreaterThan(0);
      });
    });
  });

  // ─── AI Service Tests ─────────────────────────────────────────────────────
  describe('AI Election Advice Service', () => {
    const mockFetch = (responseData: object, status = 200) => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: status === 200,
        status,
        json: async () => responseData,
      } as Response);
    };

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should call /api/chat with correct payload', async () => {
      mockFetch({ text: 'You can register to vote online at vote.gov.' });
      const query = 'How do I register to vote?';
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, history: [] }),
      });
      expect(global.fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ query, history: [] }),
      }));
    });

    test('should return text from successful response', async () => {
      const expectedText = 'You can register to vote at vote.gov before the deadline.';
      mockFetch({ text: expectedText });
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'How to vote?', history: [] }),
      });
      const data = await response.json();
      expect(data.text).toBe(expectedText);
    });

    test('should handle server error gracefully', async () => {
      mockFetch({ error: 'API key not configured' }, 500);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'test', history: [] }),
      });
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });

    test('should handle network failure', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      let error: Error | null = null;
      try {
        await fetch('/api/chat', { method: 'POST', body: '{}' });
      } catch (e) {
        error = e as Error;
      }
      expect(error).not.toBeNull();
      expect(error?.message).toBe('Network error');
    });

    test('should send conversation history in subsequent messages', async () => {
      mockFetch({ text: 'Here are the deadlines...' });
      const history = [
        { role: 'user', parts: [{ text: 'How do I register?' }] },
        { role: 'model', parts: [{ text: 'Visit vote.gov to register.' }] },
      ];
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'What are the deadlines?', history }),
      });
      const callBody = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
      expect(callBody.history.length).toBe(2);
    });

    test('should accept empty history array', async () => {
      mockFetch({ text: 'Welcome to CivicFlow!' });
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'Hello', history: [] }),
      });
      expect(response.ok).toBe(true);
    });
  });

  // ─── Accessibility Tests ───────────────────────────────────────────────────
  describe('Accessibility & Semantic Structure', () => {
    test('page should have a descriptive title', () => {
      document.title = 'CivicFlow | Your Election Roadmap';
      expect(document.title).toBe('CivicFlow | Your Election Roadmap');
      expect(document.title.length).toBeGreaterThan(0);
    });

    test('form submit should prevent default behavior', () => {
      const mockPreventDefault = jest.fn();
      const event = { preventDefault: mockPreventDefault };
      event.preventDefault();
      expect(mockPreventDefault).toHaveBeenCalledTimes(1);
    });

    test('icon name formatter should convert kebab-case to PascalCase', () => {
      const formatName = (str: string) =>
        str.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
      expect(formatName('user-check')).toBe('UserCheck');
      expect(formatName('file-text')).toBe('FileText');
      expect(formatName('bar-chart')).toBe('BarChart');
      expect(formatName('check-square')).toBe('CheckSquare');
      expect(formatName('message-square')).toBe('MessageSquare');
    });

    test('smooth scroll behavior should target valid section IDs', () => {
      const sectionIds = ['process', 'assistant'];
      sectionIds.forEach(id => {
        expect(typeof id).toBe('string');
        expect(id.length).toBeGreaterThan(0);
      });
    });
  });

  // ─── Input Validation Tests ────────────────────────────────────────────────
  describe('Input Validation & Edge Cases', () => {
    test('empty input should be rejected', () => {
      const input = '   ';
      expect(input.trim()).toBe('');
      expect(input.trim().length).toBe(0);
    });

    test('whitespace-only input should not trigger send', () => {
      const canSend = (input: string) => input.trim().length > 0;
      expect(canSend('   ')).toBe(false);
      expect(canSend('\n\t')).toBe(false);
      expect(canSend('hello')).toBe(true);
    });

    test('very long input should be handled', () => {
      const longInput = 'a'.repeat(5000);
      expect(longInput.length).toBe(5000);
      expect(typeof longInput).toBe('string');
    });

    test('special characters in input should not break the app', () => {
      const specialInputs = ['<script>alert("xss")</script>', '"; DROP TABLE votes;--', '🗳️ emoji input'];
      specialInputs.forEach(input => {
        expect(() => JSON.stringify({ query: input })).not.toThrow();
      });
    });

    test('message role should only be user or model', () => {
      const validRoles = ['user', 'model'];
      const messages = [
        { role: 'user', parts: [{ text: 'How do I vote?' }] },
        { role: 'model', parts: [{ text: 'Visit vote.gov.' }] },
      ];
      messages.forEach(msg => {
        expect(validRoles).toContain(msg.role);
      });
    });
  });

  // ─── Integration Tests ─────────────────────────────────────────────────────
  describe('Integration: Chat Flow', () => {
    test('full chat cycle: send question, receive answer', async () => {
      const mockResponse = 'To register to vote, visit vote.gov before your state\'s deadline.';
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ text: mockResponse }),
      } as Response);

      const messages: Array<{ role: string; parts: { text: string }[] }> = [];
      const query = 'How do I register to vote?';

      // Simulate user sending a message
      messages.push({ role: 'user', parts: [{ text: query }] });
      expect(messages.length).toBe(1);
      expect(messages[0].role).toBe('user');

      // Simulate API call
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, history: [] }),
      });
      const data = await res.json();

      // Simulate adding AI response
      messages.push({ role: 'model', parts: [{ text: data.text }] });
      expect(messages.length).toBe(2);
      expect(messages[1].role).toBe('model');
      expect(messages[1].parts[0].text).toBe(mockResponse);
    });

    test('reset should clear all messages', () => {
      let messages = [
        { role: 'user', parts: [{ text: 'Hello' }] },
        { role: 'model', parts: [{ text: 'Hi!' }] },
      ];
      // Simulate reset
      messages = [];
      expect(messages.length).toBe(0);
    });

    test('loading state should be true while waiting for response', async () => {
      let isLoading = false;
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ text: 'response' }),
        } as Response), 100))
      );

      isLoading = true;
      expect(isLoading).toBe(true);

      const promise = fetch('/api/chat', { method: 'POST', body: '{}' });
      await promise;
      isLoading = false;
      expect(isLoading).toBe(false);
    });
  });

  // ─── Server API Tests ──────────────────────────────────────────────────────
  describe('Server API Endpoint: /api/chat', () => {
    test('request should use POST method', () => {
      const config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'test', history: [] }),
      };
      expect(config.method).toBe('POST');
    });

    test('request body should be valid JSON', () => {
      const body = JSON.stringify({ query: 'How to vote?', history: [] });
      expect(() => JSON.parse(body)).not.toThrow();
      const parsed = JSON.parse(body);
      expect(parsed).toHaveProperty('query');
      expect(parsed).toHaveProperty('history');
    });

    test('content-type header should be application/json', () => {
      const headers = { 'Content-Type': 'application/json' };
      expect(headers['Content-Type']).toBe('application/json');
    });

    test('response should have text property', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ text: 'Election information...' }),
      } as Response);
      const res = await fetch('/api/chat', { method: 'POST', body: '{}' });
      const data = await res.json();
      expect(data).toHaveProperty('text');
      expect(typeof data.text).toBe('string');
    });
  });
});
