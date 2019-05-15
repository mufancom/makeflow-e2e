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
  idea: {
    active: string[];
  };
  task?: {
    numericId: string;
    brief: string;
  };
}

export const turning = new Turning<TurningContext>({
  describe,
  test,
});

turning.pattern({not: 'modal:*'});
