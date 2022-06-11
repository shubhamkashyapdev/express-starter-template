import { DocumentDefinition, FilterQuery } from 'mongoose';
import UserModel, { UserDocument } from '../models/user.model';
import omit from 'lodash/omit';

export async function createUser(
  input: DocumentDefinition<
    Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword'>
  >,
) {
  try {
    const user = await UserModel.create(input);
    return omit(user, 'password');
  } catch (err: any) {
    throw new Error(err.message);
  }
}

interface validateUser {
  email: string;
  password: string;
}

export async function validatePassword({ email, password }: validateUser) {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return false;
  }
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return false;
  }
  return omit(user.toJSON(), 'password');
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}
