export const COOKIE_NAME = 'sg-planner-auth';
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export const itineraryCacheKey = (holidayId: string) => `itinerary-cache:${holidayId}`;
export const todosCacheKey = (holidayId: string) => `todos-cache:${holidayId}`;
