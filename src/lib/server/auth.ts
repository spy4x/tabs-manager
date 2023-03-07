import prismaAdapter from '@lucia-auth/adapter-prisma';
import lucia from 'lucia-auth';
import { prisma } from './prisma';

export const auth = lucia({
  adapter: prismaAdapter(prisma),
  env: process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
});

export type Auth = typeof auth;
