
import { TravelMode } from './types';

export const CIRCLE_COLORS: Record<TravelMode, string> = {
  [TravelMode.WALK]: '#22c55e', // green-500
  [TravelMode.TRANSIT]: '#3b82f6', // blue-500
  [TravelMode.DRIVE]: '#ef4444', // red-500
};
