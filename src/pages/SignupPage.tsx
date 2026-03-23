import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import apiFetch from '@/lib/api';

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
      let firebaseUid: string;
      try {
        // 1. Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUid = userCredential.user.uid;
      } catch (fbErr: any) {
        if (fbErr.code === 'auth/email-already-in-use') {
          // If already in Firebase, try to sign in to get the UID and sync with Saarthii DB
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          firebaseUid = userCredential.user.uid;
        } else {
          throw fbErr;
        }
      }

      // 2. Create user in backend MongoDB
      const signupData = {
        auth0_id: firebaseUid,
        name: name,
        email: email,
        phone: phone,
        role: 'citizen',
        address: address,
        city: city,
        state: state,
        pincode: pincode
      };

      try {
        await apiFetch('/auth/signup', {
          method: 'POST',
          body: JSON.stringify(signupData)
        });
        alert("Account created and synchronized successfully! Please log in.");
      } catch (apiErr: any) {
        if (apiErr.status === 400 || apiErr.message?.includes("already exists")) {
          alert("This account is already fully registered. Redirecting to login...");
        } else {
          throw apiErr;
        }
      }

      navigate('/login');
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
