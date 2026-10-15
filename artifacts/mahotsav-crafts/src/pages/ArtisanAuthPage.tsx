import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, LockKeyhole, Mail, Sparkles } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import '../artisan-account.css';

export type ArtisanAuthMode = 'sign-in' | 'sign-up';
export type ArtisanAuthValues = { email: string; password: string; name?: string };
export type ArtisanAuthConfiguration = {
  available: boolean;
  message?: string;
};

export type ArtisanAuthPageProps = {
  mode: ArtisanAuthMode;
  onSubmit: (values: ArtisanAuthValues) => void | Promise<void>;
  isLoading: boolean;
  error?: string | null;
  configuration?: ArtisanAuthConfiguration;
  onPasswordReset?: (email: string) => void | Promise<void>;
};

const authFieldsSchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(6, 'Use a password with at least six characters.'),
});
type AuthFormValues = z.infer<typeof authFieldsSchema>;

export function ArtisanAuthPage({
  mode,
  onSubmit,
  isLoading,
  error,
  configuration = { available: true },
  onPasswordReset,
}: ArtisanAuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');
  const isSignUp = mode === 'sign-up';
  const disabled = isLoading || !configuration.available;
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFieldsSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const submit = form.handleSubmit((values) => {
    if (isSignUp && !values.name?.trim()) {
      form.setError('name', { message: 'Enter the name you make under.' });
      return;
    }
    setNotice('');
    void onSubmit({ email: values.email.trim(), password: values.password, ...(isSignUp ? { name: values.name?.trim() } : {}) });
  });

  const resetPassword = async () => {
    if (!onPasswordReset) return;
    const email = form.getValues('email').trim();
    if (!email) {
      setNotice('Add your email address above, and we’ll send a reset link.');
      return;
    }
    setNotice('');
    try {
      await onPasswordReset(email);
      setNotice('If an account is registered with that address, a reset link is on its way.');
    } catch {
      setNotice('We could not send a reset link. Check the email address and try again.');
    }
  };

  return (
    <main className="account-page auth-page">
      <header className="account-topbar">
        <Link href="/" className="account-brand" aria-label="Mahotsav Crafts home">
          <span className="account-brand-mark">M</span>
          <span>mahotsav<span className="account-brand-dot">.</span></span>
        </Link>
        <Link href="/" className="account-back-link"><ArrowLeft size={16} /> Back to the fair</Link>
      </header>

      <div className="auth-layout">
        <aside className="auth-story" aria-label="About your maker page">
          <div className="auth-story-top">
            <span className="account-eyebrow"><span /> A place for your work</span>
            <h1>Your craft has a story.<br /><em>Let it travel.</em></h1>
            <p>A lasting page for the hands, heritage and heart behind what you make.</p>
          </div>
          <div className="story-card">
            <div className="story-card-mark" aria-hidden="true"><Sparkles size={18} /></div>
            <p>“The pieces people carry home are only part of what we make. The rest is the story they remember.”</p>
            <span>MADE BY HAND · SHARED WITH CARE</span>
          </div>
          <div className="auth-ornament" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
        </aside>

        <section className="auth-form-side" aria-labelledby="auth-heading">
          <div className="auth-form-card">
            <span className="account-eyebrow"><span /> ARTISAN ACCOUNT</span>
            <h2 id="auth-heading">{isSignUp ? 'Make a home for your craft.' : 'Welcome back.'}</h2>
            <p className="auth-intro">{isSignUp ? 'Create your maker account to begin your personal shop page.' : 'Sign in to tend to your shop and share what you make.'}</p>

            {!configuration.available && (
              <div className="account-alert" role="status" data-testid="status-auth-configuration">
                <LockKeyhole size={17} />
                <span>{configuration.message || 'Maker accounts are not available right now. Please try again soon.'}</span>
              </div>
            )}
            {error && <div className="account-alert account-alert-error" role="alert" data-testid="status-auth-error">{error}</div>}

            <Form {...form}>
            <form className="account-form" onSubmit={submit}>
              {isSignUp && (
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem className="account-field">
                    <FormLabel>Your name</FormLabel>
                    <FormControl><input {...field} value={field.value ?? ''} autoComplete="name" required placeholder="The name you make under" data-testid="input-account-name" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem className="account-field">
                  <FormLabel>Email address</FormLabel>
                  <div className="account-input-wrap"><Mail size={17} aria-hidden="true" /><FormControl><input {...field} type="email" autoComplete="email" required placeholder="you@example.com" data-testid="input-account-email" /></FormControl></div>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem className="account-field">
                  <FormLabel>Password</FormLabel>
                  <div className="account-input-wrap"><KeyRound size={17} aria-hidden="true" /><FormControl><input {...field} type={showPassword ? 'text' : 'password'} autoComplete={isSignUp ? 'new-password' : 'current-password'} required minLength={6} placeholder="At least 6 characters" data-testid="input-account-password" /></FormControl><button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} data-testid="button-toggle-password">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
                  <FormMessage />
                </FormItem>
              )} />
              {!isSignUp && onPasswordReset && (
                <div className="account-reset-row"><button type="button" onClick={resetPassword} className="account-text-button" data-testid="button-password-reset">Forgot your password?</button></div>
              )}
              {notice && <p className="account-notice" role="status" data-testid="status-account-notice">{notice}</p>}
              <button type="submit" className="account-submit" disabled={disabled} data-testid="button-account-submit">
                {isLoading ? 'Please wait…' : isSignUp ? 'Create maker account' : 'Sign in to your shop'}
                {!isLoading && <ArrowRight size={17} aria-hidden="true" />}
              </button>
            </form>
            </Form>

            <div className="auth-switch">
              <span>{isSignUp ? 'Already have a maker account?' : 'New to Mahotsav Crafts?'}</span>
              <Link href={isSignUp ? '/sign-in' : '/sign-up'} data-testid="link-auth-switch">{isSignUp ? 'Sign in' : 'Create an account'}</Link>
            </div>
            <p className="account-privacy">Your work belongs to you. Your account details stay private.</p>
          </div>
        </section>
      </div>
      <footer className="account-footer"><span>MAHOTSAV CRAFTS</span><span>Meet the maker. Carry the story.</span></footer>
    </main>
  );
}

export default ArtisanAuthPage;
