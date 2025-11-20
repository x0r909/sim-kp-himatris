import InputError from '@/components/input-error';
import { ImageCropDialog } from '@/components/image-crop-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index, update } from '@/routes/users';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    status: string;
    foto: string | null;
}

interface EditProps extends PageProps {
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Manajemen User', href: index.url() },
    { title: 'Edit User', href: '#' },
];

export default function Edit({ user }: EditProps) {
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string>('');
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
        username: user.username,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
        status: user.status,
        foto: null as File | null,
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(update.url(user.id), {
            forceFormData: true,
            onSuccess: () => {
                console.log('User updated successfully');
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setTempImageSrc(reader.result as string);
                setCropDialogOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedImage: File) => {
        setData('foto', croppedImage);
        const url = URL.createObjectURL(croppedImage);
        setPreviewUrl(url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div>
                    <h1 className="text-2xl font-bold">Edit User</h1>
                    <p className="text-sm text-muted-foreground">
                        Ubah data pengguna
                    </p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nama Lengkap
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    type="text"
                                    required
                                    placeholder="Masukkan nama lengkap"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    type="text"
                                    required
                                    placeholder="Masukkan username"
                                />
                                <InputError message={errors.username} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    type="email"
                                    required
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Password Baru (Kosongkan jika tidak
                                    diubah)
                                </Label>
                                <Input
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    type="password"
                                    placeholder="Minimal 8 karakter"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">
                                    Konfirmasi Password Baru
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    type="password"
                                    placeholder="Ulangi password"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) => setData('role', value)}
                                    required
                                >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">
                                                    Admin
                                                </SelectItem>
                                                <SelectItem value="bendahara">
                                                    Bendahara
                                                </SelectItem>
                                                <SelectItem value="anggota">
                                                    Anggota
                                                </SelectItem>
                                            </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                    required
                                >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="aktif">
                                                    Aktif
                                                </SelectItem>
                                                <SelectItem value="nonaktif">
                                                    Nonaktif
                                                </SelectItem>
                                            </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                {(previewUrl || user.foto) && (
                                    <div className="mb-4">
                                        <p className="mb-2 text-sm font-medium">
                                            {previewUrl ? 'Preview Baru:' : 'Foto Saat Ini:'}
                                        </p>
                                        <img
                                            src={previewUrl || `/storage/${user.foto}`}
                                            alt={user.name}
                                            className="size-20 rounded-full object-cover"
                                        />
                                    </div>
                                )}
                                <Label htmlFor="foto">
                                    Foto Profil Baru (Opsional)
                                </Label>
                                <Input
                                    id="foto"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Maksimal 2MB. Format: JPG, PNG, WEBP
                                </p>
                                <InputError message={errors.foto} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                asChild
                            >
                                <Link href={index.url()}>Batal</Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Update
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <ImageCropDialog
                open={cropDialogOpen}
                onOpenChange={setCropDialogOpen}
                imageSrc={tempImageSrc}
                onCropComplete={handleCropComplete}
            />
        </AppLayout>
    );
}
