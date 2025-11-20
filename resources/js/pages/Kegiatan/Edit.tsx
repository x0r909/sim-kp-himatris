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
import { index, update } from '@/routes/kegiatan';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
}

interface Kegiatan {
    id: number;
    nama_kegiatan: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    deskripsi: string | null;
    penanggung_jawab: number;
}

interface EditProps extends PageProps {
    kegiatan: Kegiatan;
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Kegiatan', href: index.url() },
    { title: 'Edit Kegiatan', href: '#' },
];

export default function Edit({ kegiatan, users }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        nama_kegiatan: kegiatan.nama_kegiatan,
        tanggal_mulai: kegiatan.tanggal_mulai,
        tanggal_selesai: kegiatan.tanggal_selesai,
        deskripsi: kegiatan.deskripsi || '',
        penanggung_jawab: kegiatan.penanggung_jawab.toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update.url(kegiatan.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Kegiatan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div>
                    <h1 className="text-2xl font-bold">Edit Kegiatan</h1>
                    <p className="text-sm text-muted-foreground">
                        Edit data kegiatan organisasi
                    </p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nama_kegiatan">
                                    Nama Kegiatan{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="nama_kegiatan"
                                    value={data.nama_kegiatan}
                                    onChange={(e) =>
                                        setData('nama_kegiatan', e.target.value)
                                    }
                                    placeholder="Masukkan nama kegiatan"
                                />
                                <InputError message={errors.nama_kegiatan} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="penanggung_jawab">
                                    Penanggung Jawab{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.penanggung_jawab}
                                    onValueChange={(value) =>
                                        setData('penanggung_jawab', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih penanggung jawab" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={user.id.toString()}
                                            >
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.penanggung_jawab} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tanggal_mulai">
                                    Tanggal Mulai{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="tanggal_mulai"
                                    type="date"
                                    value={data.tanggal_mulai}
                                    onChange={(e) =>
                                        setData('tanggal_mulai', e.target.value)
                                    }
                                />
                                <InputError message={errors.tanggal_mulai} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tanggal_selesai">
                                    Tanggal Selesai{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="tanggal_selesai"
                                    type="date"
                                    value={data.tanggal_selesai}
                                    onChange={(e) =>
                                        setData(
                                            'tanggal_selesai',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.tanggal_selesai} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea
                                id="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) =>
                                    setData('deskripsi', e.target.value)
                                }
                                placeholder="Masukkan deskripsi kegiatan"
                                rows={4}
                            />
                            <InputError message={errors.deskripsi} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing && (
                                    <Spinner className="mr-2 size-4" />
                                )}
                                Simpan Perubahan
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                asChild
                                disabled={processing}
                            >
                                <Link href={index.url()}>Batal</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
