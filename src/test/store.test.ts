import { describe, it, expect } from 'vitest';
import { useAppStore } from '../store/useAppStore';

describe('App Store', () => {
  it('should have default screen as welcome', () => {
    const state = useAppStore.getState();
    expect(state.screen).toBe('welcome');
  });

  it('should update screen', () => {
    useAppStore.getState().setScreen('wizard');
    expect(useAppStore.getState().screen).toBe('wizard');
  });

  it('should track AI calls remaining', () => {
    const state = useAppStore.getState();
    expect(state.aiCallsRemaining).toBe(3);
    state.decrementAICalls();
    expect(useAppStore.getState().aiCallsRemaining).toBe(2);
  });
});
