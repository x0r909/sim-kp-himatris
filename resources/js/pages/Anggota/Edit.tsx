import { ImageCropDialog } from '@/components/image-crop-dialog';
import InputError from '@/components/input-error';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index, update } from '@/routes/anggota';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    username: string;
}

interface Anggota {
    id: number;
    nim: string;
    jurusan: string;
    jabatan: string;
    tahun_masuk: number;
    status: string;
    foto: string | null;
    sp_level: number;
    keterangan_sp: string | null;
    user_id: number | null;
    total_absen: number;
}

interface EditProps extends PageProps {
    anggotum: Anggota;
    availableUsers: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Data Anggota', href: index.url() },
    { title: 'Edit Anggota', href: '#' },
];

export default function Edit({ anggotum, availableUsers }: EditProps) {
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string>('');
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const { data, setData, post, processing, errors } = useForm({
        nim: anggotum.nim,
        jurusan: anggotum.jurusan,
        jabatan: anggotum.jabatan,
        tahun_masuk: anggotum.tahun_masuk,
        status: anggotum.status,
        foto: null as File | null,
        sp_level: anggotum.sp_level,
        keterangan_sp: anggotum.keterangan_sp || '',
        user_id: anggotum.user_id?.toString() || '',
        total_absen: anggotum.total_absen,
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(update.url(anggotum.id), {
            forceFormData: true,
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

    const currentFoto =
        previewUrl || (anggotum.foto ? `/storage/${anggotum.foto}` : '');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Anggota" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div>
                    <h1 className="text-2xl font-bold">Edit Anggota</h1>
                    <p className="text-sm text-muted-foreground">
                        Ubah data anggota organisasi
                    </p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nim">NIM</Label>
                                <Input
                                    id="nim"
                                    value={data.nim}
                                    onChange={(e) =>
                                        setData('nim', e.target.value)
                                    }
                                    type="text"
                                    required
                                    placeholder="Masukkan NIM"
                                />
                                <InputError message={errors.nim} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="jurusan">Jurusan</Label>
                                <Input
                                    id="jurusan"
                                    value={data.jurusan}
                                    onChange={(e) =>
                                        setData('jurusan', e.target.value)
                                    }
                                    type="text"
                                    required
                                    placeholder="Masukkan jurusan"
                                />
                                <InputError message={errors.jurusan} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="jabatan">Jabatan</Label>
                                <Input
                                    id="jabatan"
                                    value={data.jabatan}
                                    onChange={(e) =>
                                        setData('jabatan', e.target.value)
                                    }
                                    type="text"
                                    required
                                    placeholder="Masukkan jabatan"
                                />
                                <InputError message={errors.jabatan} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tahun_masuk">Tahun Masuk</Label>
                                <Input
                                    id="tahun_masuk"
                                    value={data.tahun_masuk}
                                    onChange={(e) =>
                                        setData(
                                            'tahun_masuk',
                                            parseInt(e.target.value),
                                        )
                                    }
                                    type="number"
                                    required
                                    min="1900"
                                    max={new Date().getFullYear()}
                                />
                                <InputError message={errors.tahun_masuk} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) =>
                                        setData('status', value)
                                    }
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
                                        <SelectItem value="alumni">
                                            Alumni
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="user_id">
                                    Akun User (Opsional)
                                </Label>
                                <Select
                                    value={data.user_id}
                                    onValueChange={(value) =>
                                        setData('user_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tidak ada akun (hanya untuk BPH)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableUsers.map((user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={user.id.toString()}
                                            >
                                                {user.name} (@{user.username})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.user_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sp_level">Level SP</Label>
                                <Select
                                    value={data.sp_level.toString()}
                                    onValueChange={(value) =>
                                        setData('sp_level', parseInt(value))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih level SP" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">
                                            Tidak ada
                                        </SelectItem>
                                        <SelectItem value="1">SP1</SelectItem>
                                        <SelectItem value="2">SP2</SelectItem>
                                        <SelectItem value="3">SP3</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.sp_level} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="total_absen">Total Absen</Label>
                                <Input
                                    id="total_absen"
                                    value={data.total_absen}
                                    onChange={(e) =>
                                        setData(
                                            'total_absen',
                                            parseInt(e.target.value),
                                        )
                                    }
                                    type="number"
                                    min="0"
                                />
                                <InputError message={errors.total_absen} />
                            </div>

                            {data.sp_level > 0 && (
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="keterangan_sp">
                                        Keterangan SP
                                    </Label>
                                    <Textarea
                                        id="keterangan_sp"
                                        value={data.keterangan_sp}
                                        onChange={(e) =>
                                            setData(
                                                'keterangan_sp',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Masukkan keterangan surat peringatan"
                                        rows={3}
                                    />
                                    <InputError
                                        message={errors.keterangan_sp}
                                    />
                                </div>
                            )}

                            <div className="space-y-2 md:col-span-2">
                                {currentFoto && (
                                    <div className="mb-4">
                                        <p className="mb-2 text-sm font-medium">
                                            Foto Saat Ini:
                                        </p>
                                        <img
                                            src={currentFoto}
                                            alt="Current foto"
                                            className="size-20 rounded-full object-cover"
                                        />
                                    </div>
                                )}
                                <Label htmlFor="foto">
                                    Ubah Foto Anggota (Opsional)
                                </Label>
                                <Input
                                    id="foto"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Maksimal 2MB. Format: JPG, JPEG, PNG, GIF
                                </p>
                                <InputError message={errors.foto} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" asChild>
                                <Link href={index.url()}>Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
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
