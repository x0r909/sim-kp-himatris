import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import { ImageCropDialog } from '@/components/image-crop-dialog';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const getInitials = useInitials();
    const initials = getInitials(auth.user.name);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: auth.user.name,
            username: auth.user.username || '',
            email: auth.user.email,
            foto: null as File | null,
            _method: 'PATCH' as const,
        });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImageSrc(reader.result as string);
                setCropDialogOpen(true);
            };
            reader.readAsDataURL(file);

            // Reset input value to allow selecting the same file again
            e.target.value = '';
        }
    };

    const handleCropComplete = (croppedFile: File) => {
        setData('foto', croppedFile);
        setPreviewUrl(URL.createObjectURL(croppedFile));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(ProfileController.update.url(), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setPreviewUrl(null);
                setData('foto', null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your name, username, email address, and profile photo"
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Photo */}
                        <div className="grid gap-2">
                            <Label>Profile Photo</Label>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage
                                        src={
                                            previewUrl ||
                                            (auth.user.foto
                                                ? `/storage/${auth.user.foto}`
                                                : undefined)
                                        }
                                        alt={auth.user.name}
                                    />
                                    <AvatarFallback className="text-lg">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <Input
                                        id="foto"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            document
                                                .getElementById('foto')
                                                ?.click()
                                        }
                                    >
                                        Change Photo
                                    </Button>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        JPG, PNG or GIF (max. 2MB)
                                    </p>
                                </div>
                            </div>
                            <InputError message={errors.foto} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.name}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>

                            <Input
                                id="username"
                                className="mt-1 block w-full"
                                value={data.username}
                                onChange={(e) =>
                                    setData('username', e.target.value)
                                }
                                required
                                autoComplete="username"
                                placeholder="Username"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.username}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                                autoComplete="email"
                                placeholder="Email address"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.email}
                            />
                        </div>

                        {mustVerifyEmail &&
                            auth.user.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-sm text-muted-foreground">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            Click here to resend the
                                            verification email.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            A new verification link has been
                                            sent to your email address.
                                        </div>
                                    )}
                                </div>
                            )}

                        <div className="flex items-center gap-4">
                            <Button
                                disabled={processing}
                                data-test="update-profile-button"
                            >
                                Save
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm font-medium text-green-600">
                                    Profile updated successfully!
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />

                <ImageCropDialog
                    open={cropDialogOpen}
                    onOpenChange={setCropDialogOpen}
                    imageSrc={tempImageSrc}
                    onCropComplete={handleCropComplete}
                />
            </SettingsLayout>
        </AppLayout>
    );
}
