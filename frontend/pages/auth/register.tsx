import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { object, string, TypeOf } from 'zod';

const createUserSchema = object({
  name: string({
    required_error: 'Name is required',
  }).nonempty({ message: 'Name is required' }),

  password: string().min(6, 'Password must be at least 6 characters long'),

  confirmPassword: string(),

  email: string().email('Not a valid email address'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password does not match',
  path: ['confirmPassword'],
});

type CreateUser = TypeOf<typeof createUserSchema>;

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.confirmPassword'
>;

function RegisterPage() {
  const router = useRouter();
  const [registerErr, setRegisterErr] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (values: CreateUser) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`,
        values,
      );
      if (res) {
        router.push('/');
      }
    } catch (err) {
      // @ts-ignore
      setRegisterErr(err.message);
    }
  };
  return (
    <Fragment>
      {registerErr && (
        <div className="flex mx-auto justify-center mt-3 max-w-[300px]">
          <p className="text-white bg-red-300 border-red-500 border-1 rounded-md shadow-md px-4 py-2 flex-1 mx-6 ">
            {registerErr}
          </p>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          {/* email */}
          <div className="flex flex-col gap-2">
            <label
              className="cursor-pointer font-semibold focus:font-bold text-xl my-0"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="h-10 px-2 py-1 text-xl border-2 border-indigo-400 focus:border-indigo-700 rounded-md"
              id="email"
              type="email"
              placeholder="jane.doe@gmail.com"
              {...register('email')}
            />
            <p className="text-[12px] font-semibold text-red-600 px-1">
              {errors.email?.message}
            </p>
          </div>
          {/* name */}
          <div className="flex flex-col gap-2">
            <label
              className="cursor-pointer font-semibold focus:font-bold text-xl my-0"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="h-10 px-2 py-1 text-xl border-2 border-indigo-400 focus:border-indigo-700 rounded-md"
              id="name"
              type="name"
              placeholder="name"
              {...register('name')}
            />
            <p className="text-[12px] font-semibold text-red-600 px-1">
              {errors.name?.message}
            </p>
          </div>
          {/* password */}
          <div className="flex flex-col gap-2">
            <label
              className="cursor-pointer font-semibold focus:font-bold text-xl my-0"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="h-10 px-2 py-1 text-xl border-2 border-indigo-400 focus:border-indigo-700 rounded-md"
              id="password"
              type="password"
              placeholder="password"
              {...register('password')}
            />
            <p className="text-[12px] font-semibold text-red-600 px-1">
              {errors.password?.message}
            </p>
          </div>
          {/* confirm password */}
          <div className="flex flex-col gap-2">
            <label
              className="cursor-pointer font-semibold focus:font-bold text-xl my-0"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              className="h-10 px-2 py-1 text-xl border-2 border-indigo-400 focus:border-indigo-700 rounded-md"
              id="confirmPassword"
              type="confirmPassword"
              placeholder="confirm password"
              {...register('confirmPassword')}
            />
            <p className="text-[12px] font-semibold text-red-600 px-1">
              {errors.confirmPassword?.message}
            </p>
          </div>
          <button
            className="bg-indigo-700 text-white font-semibold text-xl uppercase w-full py-2 mt-6 shadow-md"
            type="submit"
            //@ts-ignore
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </Fragment>
  );
}

export default RegisterPage;
