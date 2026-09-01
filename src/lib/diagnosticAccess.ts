export const FREE_PLAN_DIAGNOSTIC_IDS = [1, 2, 3] as const;
export const FREE_PLAN_DIAGNOSTIC_ATTEMPT_LIMIT = 3;

export function isFreePlanDiagnostic(diagnosticId: number) {
  return FREE_PLAN_DIAGNOSTIC_IDS.includes(diagnosticId as (typeof FREE_PLAN_DIAGNOSTIC_IDS)[number]);
}

export function hasRemainingFreeDiagnosticAttempts(attemptCount: number) {
  return attemptCount < FREE_PLAN_DIAGNOSTIC_ATTEMPT_LIMIT;
}
