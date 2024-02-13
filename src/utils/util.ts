import * as crypto from 'crypto';
import * as moment from 'moment';

export type ExpiryUnit =
  | 'minute'
  | 'minutes'
  | 'hour'
  | 'hours'
  | 'day'
  | 'days'
  | 'month'
  | 'months';

export function randomNumberGenerator(size: number) {
  if (size > 15) {
    throw new Error('Random number generator can only generate 15 digits');
  }

  const min = 10 ** (size - 1);
  const max = +'9'.repeat(size);
  return crypto.randomInt(min, max);
}

export function generateJwtExpiry(value: number, unit: ExpiryUnit): Date {
  if (value <= 0) {
    throw new Error('Invalid expiration value');
  }

  const singularUnit = unit.replace(/s$/, '');

  let expirationDate: moment.Moment;

  switch (singularUnit) {
    case 'minute':
    case 'hour':
    case 'day':
    case 'month':
    case 'year':
      expirationDate = moment().add(value, singularUnit);
      break;
    default:
      throw new Error('Invalid expiration unit');
  }

  return expirationDate.toDate();
}
