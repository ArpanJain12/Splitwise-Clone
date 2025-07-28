import { useState } from "react";
import api from "../services/api";

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    if (isSignup && !name) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        // Register new user
        const userData = {
          name: name,
          mail: email,
          password: password
        };
        
        const response = await api.auth.register(userData);
        
        // After successful registration, log them in
        const loginResponse = await api.auth.login({
          mail: email,
          password: password
        });
        
        setUser({
          email: email,
          name: name,
          token: loginResponse.token,
          id: response.id
        });
      } else {
        // Login existing user
        const response = await api.auth.login({
          mail: email,
          password: password
        });
        
        setUser({
          email: email,
          token: response.token
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Placeholder for Google sign in
    alert("Google sign-in functionality would go here");
  };

  const handleForgotPassword = () => {
    alert("Forgot password functionality would go here");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-teal-600">Splitwise</div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsSignup(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  !isSignup
                    ? "bg-teal-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Log in
              </button>
              <button
                onClick={() => setIsSignup(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isSignup
                    ? "bg-teal-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white py-8 px-8 shadow-lg rounded-lg">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center">
                {isSignup ? "Sign up" : "Log in"}
              </h2>
            </div>

            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {isSignup && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Full Name"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isSignup && (
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-teal-600 hover:text-teal-500"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Please wait..." : (isSignup ? "Sign up" : "Log in")}
                </button>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Splitwise is a free tool for friends and roommates to track bills and other shared expenses,<br />
              so that everyone gets paid back.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}