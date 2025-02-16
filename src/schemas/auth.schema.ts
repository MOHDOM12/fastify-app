import { Type } from '@sinclair/typebox';

export const RegisterSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 })
});

export const LoginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String()
});
