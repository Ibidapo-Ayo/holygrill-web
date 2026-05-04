import { Link } from '@/lib/router';
import { Flame, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUserSchema, LoginUserInput } from '@/lib/validations';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import CustomFormField from '@/components/CustomFormField';
import { FormFieldTypes } from '@/lib/form-field-type';
import GoogleAuthButton from '@/components/GoogleAuthButton';

const LoginPage = () => {
  const form = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSubmit = async (_data: LoginUserInput) => {
    await new Promise((r) => setTimeout(r, 1500));
    toast.success('Welcome back! 🔥');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Flame size={28} className="text-primary" />
            <span className="font-display font-bold text-2xl text-foreground">Holy Grills</span>
          </div>
          <p className="text-muted-foreground font-body text-sm">Sign in to your account</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <CustomFormField
              control={form.control}
              name="email"
              label="Email"
              fieldType={FormFieldTypes.INPUT}
              type="email"
              placeholder="you@futa.edu.ng"
              iconSrc={Mail}
            />

            <CustomFormField
              control={form.control}
              name="password"
              label="Password"
              fieldType={FormFieldTypes.INPUT}
              type="password"
              placeholder="••••••••"
              iconSrc={Lock}
            />

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full py-3 rounded-lg bg-gradient-fire text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {form.formState.isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </Form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-3 text-muted-foreground font-body">or</span>
          </div>
        </div>

        {/* Google */}
        <GoogleAuthButton type="login" />

        <p className="text-center text-sm text-muted-foreground font-body mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
