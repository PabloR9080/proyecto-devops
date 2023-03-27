"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

const registerContent = {
  linkUrl: "/login",
  linkText: "Already have an account?",
  header: "Create a new Account",
  subheader: "Just a few things to get started",
  buttonText: "Register",
};

const signinContent = {
  linkUrl: "/register",
  linkText: "Don't have an account?",
  header: "Welcome Back",
  subheader: "Enter your credentials to access your account",
  buttonText: "Sign In",
};

const initial = { email: "", password: "", name: "" };

const AuthForm = ({ mode }: { mode: "register" | "signin" }) => {
  const [displayError, setDisplayError] = useState(false);
  const [formState, setFormState] = useState({ ...initial });
  const [error, setError] = useState("");

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "register") {
        const res = await fetch("/api/register/register", {
          method: "POST",
          body: JSON.stringify({
            email: formState.email,
            password: formState.password,
            name: formState.name,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          router.push("/login");
        }
      } else {
        signIn("credentials", {
          email: formState.email,
          password: formState.password,
          callbackUrl: "/",
        });
      }
      setDisplayError(false);
    } catch (e) {
      setDisplayError(true);
      setError(`Could not ${mode}`);
    } finally {
      setFormState({ ...initial });
    }
  };

  const content = mode === "register" ? registerContent : signinContent;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {content.header}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {content.subheader}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "register" && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    autoComplete="name"
                    placeholder="Name"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, name: e.target.value }))
                    }
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  value={formState.email}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, email: e.target.value }))
                  }
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  value={formState.password}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, password: e.target.value }))
                  }
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>
            </div>

            {displayError && mode === "register" ? (
              <div className="flex items-center justify-center">
                <div className="text-sm text-red-500">
                  That email already exists!
                </div>
              </div>
            ) : displayError && mode === "signin" ? (
              <div className="flex items-center justify-center">
                <div className="text-sm text-red-500">
                  Invalid email or password!
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href={content.linkUrl}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {content.linkText}
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {content.buttonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
