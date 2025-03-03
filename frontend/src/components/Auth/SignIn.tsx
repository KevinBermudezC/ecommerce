import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/useAuth';

import { signInSchema, type SignInFormData } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { login } = useAuth();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setFormError(null);
    setIsLoading(true);
    
    try {
      await login(data.email, data.password);
      toast.success('Login successful!');
      
      // Redirect to home page or dashboard after successful login
      navigate('/');
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'An error occurred during sign in'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold dark:text-white text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm dark:text-gray-300 text-gray-600">
          Don't have an account?{' '}
          <a href="/auth?mode=register" className="font-medium dark:text-white dark:hover:text-gray-300 text-black hover:text-gray-800">
            Register
          </a>
        </p>
      </div>

      {formError && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 p-4">
          <p className="text-red-700 dark:text-red-400">{formError}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Email address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Email address" 
                    type="email"
                    autoComplete="email"
                    className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="dark:text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Password" 
                    type="password"
                    autoComplete="current-password"
                    className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="dark:text-red-400" />
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>
    </div>
  );
}