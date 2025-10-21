import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../components/Button';

type LoginData = { email: string; password: string; };

const CustomerLogin: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();
  const onSubmit = (data: LoginData) => {
    console.log('Login data:', data);
    // handle login...
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-surface rounded-lg shadow">
      <h2 className="text-2xl text-white mb-4">Customer Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-neutral mb-1">Email</label>
          <input
            type="email"
            {...register('email', { required: true })}
            className="w-full p-2 rounded bg-background text-neutral border border-gray-700"
          />
          {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
        </div>
        <div className="mb-6">
          <label className="block text-neutral mb-1">Password</label>
          <input
            type="password"
            {...register('password', { required: true })}
            className="w-full p-2 rounded bg-background text-neutral border border-gray-700"
          />
          {errors.password && <span className="text-red-500 text-sm">Password is required</span>}
        </div>
        <Button type="submit" label="Log In" className="w-full" />
      </form>
    </div>
  );
};

export default CustomerLogin;
