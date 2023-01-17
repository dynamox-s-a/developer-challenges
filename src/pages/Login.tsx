/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { IDataProps } from "../types";
import { useLoginUserMutation } from "../features/api";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { setUser } from "../features/auth.slice";
import Button from "../components/Button";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<IDataProps>();
  const dispatch = useAppDispatch();
  const [loginUser, { data, isSuccess, isError, error }] =
    useLoginUserMutation();
  const onSubmit: SubmitHandler<IDataProps> = async ({ email, password }) => {
    return await loginUser({ email, password });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login successful");
      dispatch(
        setUser({
          user: { email: data!.user.email },
          accessToken: data!.accessToken,
        })
      );
      navigate("/home");
    } else if (isError) {
      toast.error((error as { data: string }).data);
    }
  }, [isSuccess, navigate, isError, dispatch, data, error]);

  return (
    <section className="flex items-center justify-center h-screen bg-gray-800 px-10 md:px-0">
      <div className="w-full max-w-md p-6 space-y-4 bg-gray-900 rounded">
        <div className="bg-slate-700 px-6 py-4 rounded text-white gap-4">
          <span className="block">
            <strong>Email:</strong> matheus@example.com
          </span>
          <span className="block">
            <strong>Senha:</strong> 123456
          </span>
        </div>
        <div className="mb-4">
          <p className="text-gray-400">Entrar</p>
          <h2 className="text-xl font-bold text-white">Junte-se a nós</h2>
        </div>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white">
              Email
            </label>
            <input
              className="w-full p-4 text-sm text-gray-600 border border-gray-200 rounded bg-gray-50 focus:outline-none"
              type="email"
              placeholder="Email"
              id="email"
              {...register("email")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-white">
              Password
            </label>
            <input
              className="w-full p-4 text-sm text-gray-600 border border-gray-200 rounded bg-gray-50 focus:outline-none"
              type="password"
              placeholder="Password"
              id="password"
              {...register("password")}
            />
          </div>
          <Button title="Entrar" />
        </form>
      </div>
    </section>
  );
};

export default Login;
