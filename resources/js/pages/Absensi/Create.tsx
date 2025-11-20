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
import { index, store } from '@/routes/absensi';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Kegiatan {
    id: number;
    nama_kegiatan: string;
}

interface Anggota {
    id: number;
    name: string;
}

interface CreateProps extends PageProps {
    kegiatan: Kegiatan[];
    anggota: Anggota[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Data Absensi', href: index.url() },
    { title: 'Tambah Absensi', href: '#' },
];

const STATUS_OPTIONS = [
    { value: 'hadir', label: 'Hadir', color: 'emerald' },
    { value: 'alpha', label: 'Alpha', color: 'red' },
    { value: 'izin', label: 'Izin', color: 'yellow' },
    { value: 'sakit', label: 'Sakit', color: 'orange' },
];

export default function Create({ kegiatan, anggota }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        kegiatan_id: '',
        anggota_id: '',
        status_hadir: '',
        waktu_absen: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
        keterangan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Absensi" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div>
                    <h1 className="text-2xl font-bold">Tambah Data Absensi</h1>
                    <p className="text-sm text-muted-foreground">
                        Input data kehadiran anggota pada kegiatan
                    </p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="kegiatan_id">
                                    Kegiatan{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.kegiatan_id}
                                    onValueChange={(value) =>
                                        setData('kegiatan_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kegiatan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kegiatan.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={item.id.toString()}
                                            >
                                                {item.nama_kegiatan}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.kegiatan_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="anggota_id">
                                    Anggota{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.anggota_id}
                                    onValueChange={(value) =>
                                        setData('anggota_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih anggota" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {anggota.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={item.id.toString()}
                                            >
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.anggota_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status_hadir">
                                    Status Kehadiran{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.status_hadir}
                                    onValueChange={(value) =>
                                        setData('status_hadir', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status kehadiran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS_OPTIONS.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status_hadir} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="waktu_absen">
                                    Waktu Absen{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="waktu_absen"
                                    type="datetime-local"
                                    value={data.waktu_absen}
                                    onChange={(e) =>
                                        setData('waktu_absen', e.target.value)
                                    }
                                />
                                <InputError message={errors.waktu_absen} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="keterangan">Keterangan</Label>
                            <Textarea
                                id="keterangan"
                                value={data.keterangan}
                                onChange={(e) =>
                                    setData('keterangan', e.target.value)
                                }
                                placeholder="Masukkan keterangan (opsional)"
                                rows={3}
                            />
                            <InputError message={errors.keterangan} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing && (
                                    <Spinner className="mr-2 size-4" />
                                )}
                                Simpan
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
