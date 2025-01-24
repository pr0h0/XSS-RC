import React, { useState } from "react";
import { useNavigate } from "react-router";
import authService from "../../services/AuthService";
import LogService from "../../services/LogService";
import LayoutWrapper from "../../Components/LayoutWrapper/LayoutWrapper";
import Footer from "../../Components/Footer/Footer";
import Icon from "../../Components/Icon/Icon";

export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).querySelector<HTMLInputElement>(
      '[name="password"]'
    );
    if (!input) {
      setError("Something went wrong!");
      return;
    }
    const password = input.value;
    if (!password) {
      setError("Password is required!");
      return;
    }

    const remember = Boolean(
      (e.target as HTMLElement).querySelector<HTMLInputElement>(
        "[type=checkbox]"
      )?.checked
    );

    try {
      await authService.login({ password, remember });
      navigate("/");
    } catch (e: unknown) {
      LogService.error(e as Error);
      setError((e as Error).message);
    }
  };
  return (
    <LayoutWrapper className="flex-col">
      <div className="w-full h-screen flex items-center justify-center bg-indigo-100">
        <form
          className="w-full md:w-1/3 rounded-lg"
          method="POST"
          onSubmit={handleSubmit}
        >
          <div className="flex font-bold justify-center mt-6">
            <div className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
              <Icon
                name="eye"
                className="w-20 h-20 text-white p-2 bg-blue-500 rounded-full"
              />
            </div>
          </div>
          <h2 className="text-2xl text-center text-gray-200 mb-8">Login</h2>
          <div className="px-12 pb-10">
            <div className="w-full mb-2">
              <div className="flex items-center flex-col">
                <input
                  type="password"
                  placeholder="Password"
                  className=" w-full border rounded px-3 py-2 text-gray-700 focus:outline-2 focus:outline-blue-500"
                  name="password"
                />
                <label className="w-full flex justify-start my-4 text-xl focus-within:outline focus-within:outline-blue-500">
                  <input
                    type="checkbox"
                    name="remember"
                    className="ml-2 mr-4 origin-center scale-150 outline-none"
                  />
                  <span className="text-gray-700">Remember me</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className=" w-full py-2 mt-4 rounded-full bg-blue-400 text-gray-100 focus:outline-2 focus:outline-blue-500"
            >
              Enter
            </button>
            <p className="w-full text-center text-red-500 p-4 empty:hidden">
              {error}
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </LayoutWrapper>
  );
}
