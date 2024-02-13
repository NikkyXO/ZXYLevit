import { HttpStatus } from '@nestjs/common';
import { ErrorDomain } from './interfaces/domain-types';
import { uid } from 'uid';

export class CustomException extends Error {
  public readonly id: string;
  public readonly timestamp: Date;

  constructor(
    public readonly domain: ErrorDomain,
    public readonly message: string,
    public readonly apiMessage: string,
    public readonly status: HttpStatus,
  ) {
    super(message);
    this.id = CustomException.genId();
    this.timestamp = new Date();
  }

  private static genId(length = 16): string {
    return uid(length);
  }
}
