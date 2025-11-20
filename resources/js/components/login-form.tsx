import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form } from '@inertiajs/react';

interface LoginFormProps extends React.ComponentProps<'div'> {
    canResetPassword: boolean;
    canRegister: boolean;
    status?: string;
}

export function LoginForm({
    className,
    canResetPassword,
    canRegister,
    status,
    ...props
}: LoginFormProps) {
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <FieldGroup>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <h1 className="text-2xl font-bold">
                                Login to your account
                            </h1>
                            <p className="text-sm text-balance text-muted-foreground">
                                Enter your username and password below to login
                            </p>
                        </div>
                        <Field>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Masukkan username"
                                required
                                autoFocus
                                autoComplete="username"
                            />
                            <InputError message={errors.username} />
                        </Field>
                        <Field>
                            <div className="flex items-center">
                                <FieldLabel htmlFor="password">
                                    Password
                                </FieldLabel>
                                {canResetPassword && (
                                    <a
                                        href={request.url()}
                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                required
                                autoComplete="current-password"
                            />
                            <InputError message={errors.password} />
                        </Field>
                        <Field>
                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                Login
                            </Button>
                        </Field>
                        {canRegister && (
                            <FieldDescription className="text-center">
                                Don&apos;t have an account?{' '}
                                <a
                                    href={register.url()}
                                    className="underline underline-offset-4"
                                >
                                    Sign up
                                </a>
                            </FieldDescription>
                        )}
                    </FieldGroup>
                )}
            </Form>

            {status && (
                <div className="text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </div>
    );
}
