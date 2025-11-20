import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { edit, index } from '@/routes/absensi';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    CalendarIcon,
    ClockIcon,
    FileTextIcon,
    PencilIcon,
    UserIcon,
} from 'lucide-react';

interface Kegiatan {
    id: number;
    nama_kegiatan: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
}

interface User {
    id: number;
    name: string;
}

interface Anggota {
    id: number;
    nim: string;
    nama_lengkap: string;
    jurusan: string;
    user?: User;
}

interface Absensi {
    id: number;
    kegiatan_id: number;
    anggota_id: number;
    status_hadir: string;
    waktu_absen: string;
    keterangan: string | null;
    kegiatan: Kegiatan;
    anggota: Anggota;
    created_at: string;
    updated_at: string;
}

interface ShowProps extends PageProps {
    absensi: Absensi;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Data Absensi', href: index.url() },
    { title: 'Detail Absensi', href: '#' },
];

export default function Show({ absensi }: ShowProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadgeClass = (status: string) => {
        const classes = {
            hadir: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
            alpha: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            izin: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            sakit: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        };
        return classes[status as keyof typeof classes] || '';
    };

    const getStatusLabel = (status: string) => {
        const labels = {
            hadir: 'Hadir',
            alpha: 'Alpha',
            izin: 'Izin',
            sakit: 'Sakit',
        };
        return labels[status as keyof typeof labels] || status;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Absensi" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Detail Absensi</h1>
                        <p className="text-sm text-muted-foreground">
                            Informasi lengkap data absensi
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={edit.url(absensi.id)}>
                            <PencilIcon className="mr-2 size-4" />
                            Edit Absensi
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">
                            Informasi Kegiatan
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <FileTextIcon className="mt-1 size-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Nama Kegiatan
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {absensi.kegiatan.nama_kegiatan}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CalendarIcon className="mt-1 size-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Periode Kegiatan
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(
                                            absensi.kegiatan.tanggal_mulai,
                                        )}
                                        {absensi.kegiatan.tanggal_mulai !==
                                            absensi.kegiatan.tanggal_selesai && (
                                            <>
                                                {' - '}
                                                {formatDate(
                                                    absensi.kegiatan
                                                        .tanggal_selesai,
                                                )}
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">
                            Informasi Anggota
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <UserIcon className="mt-1 size-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Nama</p>
                                    <p className="text-sm text-muted-foreground">
                                        {absensi.anggota.user?.name ||
                                            absensi.anggota.nama_lengkap}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="mb-1 text-sm font-medium">NIM</p>
                                <p className="text-sm text-muted-foreground">
                                    {absensi.anggota.nim}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 text-sm font-medium">
                                    Jurusan
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {absensi.anggota.jurusan}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Detail Absensi
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="mb-2 text-sm font-medium">
                                Status Kehadiran
                            </p>
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusBadgeClass(absensi.status_hadir)}`}
                            >
                                {getStatusLabel(absensi.status_hadir)}
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <ClockIcon className="mt-1 size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">
                                    Waktu Absen
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDateTime(absensi.waktu_absen)}
                                </p>
                            </div>
                        </div>
                        {absensi.keterangan && (
                            <div className="md:col-span-2">
                                <p className="mb-2 text-sm font-medium">
                                    Keterangan
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {absensi.keterangan}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Informasi Tambahan
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="mb-1 text-sm font-medium">
                                Dibuat pada
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formatDateTime(absensi.created_at)}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm font-medium">
                                Terakhir diubah
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formatDateTime(absensi.updated_at)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
