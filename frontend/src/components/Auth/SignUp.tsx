import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/useAuth';

import { signUpSchema, type SignUpFormData } from '../../lib/schemas/auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { toast } from 'sonner';



export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { register } = useAuth();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setFormError(null);
    setIsLoading(true);
    
    try {
      await register(data.name, data.email, data.password);
      console.log("Registering...", data);
      toast.success('Registration successful!');
      
      // Redirect to home page or dashboard after successful registration
      navigate('/');
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'An error occurred during registration'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold dark:text-white text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm dark:text-gray-300 text-gray-600">
          Already have an account?{' '}
          <a href="/auth?mode=login" className="font-medium dark:text-white dark:hover:text-gray-300 text-black hover:text-gray-800">
            Sign in
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Full Name" 
                    type="text"
                    autoComplete="name"
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
                    autoComplete="new-password"
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Confirm Password" 
                    type="password"
                    autoComplete="new-password"
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
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Form>
    </div>
  );
}