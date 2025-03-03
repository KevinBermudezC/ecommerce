import { useSearchParams } from 'react-router';
import { SignIn, SignUp } from '../components/Auth';

type AuthMode = 'login' | 'register';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const mode: AuthMode = initialMode;

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 dark:bg-gray-800 bg-white p-8 rounded-lg shadow-md">
        {mode === 'login' ? <SignIn /> : <SignUp />}
      </div>
    </div>
  );
}