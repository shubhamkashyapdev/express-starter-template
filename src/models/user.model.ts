import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (this: UserDocument, next: any) {
  let user: any = this as UserDocument;
  if (!user.isModified) {
    return next();
  }
  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
  const hash = await bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return next();
});

userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  const user = this as UserDocument;
  try {
    return bcrypt.compare(password, user.password);
  } catch (err) {
    return false;
  }
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
