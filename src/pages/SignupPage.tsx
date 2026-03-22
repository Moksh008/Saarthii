import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function SignupPage() {
  const [securityCode, setSecurityCode] = useState('');
  const [userInputCode, setUserInputCode] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Generate a random 6-digit security code on mount
  useEffect(() => {
    generateNewCode();
  }, []);

  const generateNewCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSecurityCode(code);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInputCode !== securityCode) {
      setError('The security code does not match. Please try again.');
      generateNewCode();
      setUserInputCode('');
      return;
    }
    setError('');

    try {
      // Create user with Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password);
      // Proceed with creating citizen account
      alert("Account created successfully!");
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-32">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center">
          <div className="bg-primary p-2 rounded text-white flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">how_to_reg</span>
          </div>
          <h2 className="mt-2 text-center text-3xl font-black text-slate-900 tracking-tight">
            Create a Citizen Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow-2xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-[#ff7a33]"></div>

          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700">
                Full Address
              </label>
              <div className="mt-1">
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors resize-none"
                  placeholder="Street, City, State, PIN Code"
                />
              </div>
            </div>

            <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg space-y-4">
              <label className="block text-sm font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Security Verification
              </label>
              
              <div className="flex items-center justify-between gap-4">
                <div className="bg-slate-200 text-slate-800 font-mono text-xl tracking-widest px-4 py-2 rounded-lg user-select-none opacity-80 decoration-slate-400 line-through">
                  {securityCode}
                </div>
                <button 
                  type="button" 
                  onClick={generateNewCode}
                  className="text-sm text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Regenerate
                </button>
              </div>

              <div>
                <input
                  id="securityCode"
                  name="securityCode"
                  type="text"
                  required
                  value={userInputCode}
                  onChange={(e) => setUserInputCode(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors text-center font-mono tracking-widest"
                  placeholder="Enter the 6-digit code from above"
                />
                {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all hover:-translate-y-0.5"
              >
                Create Account
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
