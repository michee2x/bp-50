import type { NextRouter } from 'next/router';

export type StartFlowIntent = 'test' | 'quiz';
export type StartFlowProfileType = 'founder-business' | 'creator' | 'professional';
export type StartFlowGoal = 'clarity' | 'growth' | 'positioning' | 'visibility';

export interface StartFlowState {
  intent: StartFlowIntent;
  profileType?: StartFlowProfileType;
  goal?: StartFlowGoal;
  brandName?: string;
  source?: 'landing' | 'dashboard';
  updatedAt: string;
}

export const START_FLOW_STORAGE_KEY = 'brandpawa_start_flow';

export const START_FLOW_ROUTES: Record<StartFlowIntent, string> = {
  test: '/dashboard/diagnostic/1',
  quiz: '/dashboard/diagnostic/2',
};

export function saveStartFlowState(state: StartFlowState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(START_FLOW_STORAGE_KEY, JSON.stringify(state));
}

export function readStartFlowState(): StartFlowState | null {
  if (typeof window === 'undefined') return null;

  const rawState = window.localStorage.getItem(START_FLOW_STORAGE_KEY);
  if (!rawState) return null;

  try {
    return JSON.parse(rawState) as StartFlowState;
  } catch (_error) {
    window.localStorage.removeItem(START_FLOW_STORAGE_KEY);
    return null;
  }
}

export function clearStartFlowState() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(START_FLOW_STORAGE_KEY);
}

export function getStartFlowRoute(intent: StartFlowIntent) {
  return START_FLOW_ROUTES[intent];
}

export function isStartFlowReady(state: StartFlowState | null): state is StartFlowState & {
  profileType: StartFlowProfileType;
  goal: StartFlowGoal;
} {
  return Boolean(state?.profileType && state?.goal);
}

export async function navigateToSavedStartFlow(router: NextRouter) {
  const startFlow = readStartFlowState();

  if (!startFlow || !isStartFlowReady(startFlow)) {
    await router.replace('/dashboard');
    return false;
  }

  clearStartFlowState();
  await router.replace(getStartFlowRoute(startFlow.intent));
  return true;
}
