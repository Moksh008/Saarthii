import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import apiFetch from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export function SignupPage() {
  const [securityCode, setSecurityCode] = useState('');
  const [userInputCode, setUserInputCode] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const googleState = location.state as { idToken?: string, email?: string, name?: string } | null;

  // State pre-fill from Google if available
  useEffect(() => {
    if (googleState) {
      if (googleState.email) setEmail(googleState.email);
      if (googleState.name) setName(googleState.name);
    }
  }, [googleState]);

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
    setIsLoading(true);

    try {
      // Build the payload the backend expects: { user_data: {...}, password?, id_token? }
      const userData = {
        name,
        email,
        phone,
        role: 'citizen',
        address,
        city,
        state,
        pincode,
      };

      let signupPayload: any;

      if (googleState?.idToken) {
        // Google sign-in: pass the id_token so the backend verifies it
        signupPayload = {
          user_data: userData,
          id_token: googleState.idToken,
        };
      } else {
        // Email/password signup: let the backend create the Firebase user
        signupPayload = {
          user_data: userData,
          password,
        };
      }

      try {
        await apiFetch('/auth/signup', {
          method: 'POST',
          body: JSON.stringify(signupPayload),
        });

        // Auto-login after successful signup
        if (googleState?.idToken) {
          // For Google sign-in: use firebase-login with the existing token
          const loginData = await apiFetch('/auth/firebase-login', {
            method: 'POST',
            body: JSON.stringify({ idToken: googleState.idToken }),
          });
          login(loginData);
        } else {
          // For email/password: use the /auth/login endpoint
          const loginData = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          login(loginData);
        }

        alert('Account created and you are now logged in!');
        navigate('/dashboard');
      } catch (apiErr: any) {
        if (apiErr.status === 400 || apiErr.message?.includes('already exists')) {
          alert('This account is already registered. Redirecting to login...');
          navigate('/login');
        } else {
          throw apiErr;
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-32">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center">
          <img src="/saarthii_logo.png" alt="Saarthii" className="h-14 w-auto mb-4" />
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

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
                <input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-700">Full Address</label>
                <textarea id="address" rows={2} required value={address} onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-slate-700">City</label>
                  <input id="city" type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-slate-700">State</label>
                  <input id="state" type="text" required value={state} onChange={(e) => setState(e.target.value)}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-slate-700">PIN Code</label>
                <input id="pincode" type="text" required value={pincode} onChange={(e) => setPincode(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
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
                  <span translate="no" className="material-symbols-outlined notranslate text-sm">refresh</span>
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
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
