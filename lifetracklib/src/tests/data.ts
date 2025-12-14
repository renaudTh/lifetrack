import { Activity } from '../models/activity.model';

export const testActivities: Activity[] = [
  {
    id: '0',
    amount: 30,
    description: 'Play the piano',
    representation: '🎹',
    unit: 'min',
  },
  {
    id: '1',
    amount: 5,
    description: 'Bike ride',
    representation: '🚴‍♂️',
    unit: 'km',
  },
  {
    id: '2',
    amount: 25,
    description: 'Drink beer',
    representation: '🍺',
    unit: 'cl',
  },
  {
    id: '3',
    amount: 1,
    description: 'Run',
    representation: '🏃‍♂️',
    unit: 'km',
  },
];
