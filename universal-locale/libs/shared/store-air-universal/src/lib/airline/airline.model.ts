import { BaseDocument, EMPTY_UNIQUE_ID } from '@fulls1z3/shared/util-store';

export interface Airline extends BaseDocument {
  iataCode: string;
  name: string;
  price: number;
}

export const initialAirline: Airline = {
  id: EMPTY_UNIQUE_ID,
  iataCode: '',
  name: '',
  price: 0.00,
};
