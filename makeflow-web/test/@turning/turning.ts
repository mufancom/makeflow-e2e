import {Turning} from 'turning';

export interface TurningContext {
  account?: {
    mobile: string;
    password: string;
  };
  organization?: {
    name: string;
    size: string;
    industry: string;
  };
  user?: {
    fullName: string;
    username: string;
  };
}

export const turning = new Turning<TurningContext>({describe, test});
