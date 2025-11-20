import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { edit, index } from '@/routes/kegiatan';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CalendarIcon, PencilIcon, UserIcon } from 'lucide-react';

interface Anggota {
    id: number;
    nama_lengkap: string;
    nim: string;
}

interface Absensi {
    id: number;
    status_hadir: string;
    waktu_absen: string;
    keterangan: string | null;
    anggota: Anggota;
}

interface Kegiatan {
    id: number;
    nama_kegiatan: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    deskripsi: string | null;
    penanggung_jawab: number;
    penanggung_jawab_name?: string;
    penanggung_jawab?: {
        id: number;
        name: string;
    };
    absensi: Absensi[];
    created_at: string;
    updated_at: string;
}

interface ShowProps extends PageProps {
    kegiatan: Kegiatan;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Kegiatan', href: index.url() },
    { title: 'Detail Kegiatan', href: '#' },
];

export default function Show({ kegiatan }: ShowProps) {
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
            month: 'short',
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail: ${kegiatan.nama_kegiatan}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {kegiatan.nama_kegiatan}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Detail informasi kegiatan
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={edit.url(kegiatan.id)}>
                            <PencilIcon className="mr-2 size-4" />
                            Edit Kegiatan
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
                                <CalendarIcon className="mt-1 size-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Periode
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(kegiatan.tanggal_mulai)}
                                        {kegiatan.tanggal_mulai !==
                                            kegiatan.tanggal_selesai && (
                                            <>
                                                {' - '}
                                                {formatDate(
                                                    kegiatan.tanggal_selesai,
                                                )}
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <UserIcon className="mt-1 size-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Penanggung Jawab
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {kegiatan.penanggung_jawab?.name ||
                                            kegiatan.penanggung_jawab_name}
                                    </p>
                                </div>
                            </div>
                            {kegiatan.deskripsi && (
                                <div>
                                    <p className="mb-1 text-sm font-medium">
                                        Deskripsi
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {kegiatan.deskripsi}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">
                            Statistik Kehadiran
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border bg-emerald-50 p-4 dark:bg-emerald-950">
                                <p className="text-sm text-muted-foreground">
                                    Hadir
                                </p>
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {
                                        kegiatan.absensi.filter(
                                            (a) => a.status_hadir === 'hadir',
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="rounded-lg border bg-red-50 p-4 dark:bg-red-950">
                                <p className="text-sm text-muted-foreground">
                                    Alpha
                                </p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {
                                        kegiatan.absensi.filter(
                                            (a) => a.status_hadir === 'alpha',
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="rounded-lg border bg-yellow-50 p-4 dark:bg-yellow-950">
                                <p className="text-sm text-muted-foreground">
                                    Izin
                                </p>
                                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                    {
                                        kegiatan.absensi.filter(
                                            (a) => a.status_hadir === 'izin',
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="rounded-lg border bg-orange-50 p-4 dark:bg-orange-950">
                                <p className="text-sm text-muted-foreground">
                                    Sakit
                                </p>
                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                    {
                                        kegiatan.absensi.filter(
                                            (a) => a.status_hadir === 'sakit',
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card">
                    <div className="border-b p-6">
                        <h2 className="text-lg font-semibold">
                            Data Absensi ({kegiatan.absensi.length} anggota)
                        </h2>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>NIM</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Waktu Absen</TableHead>
                                <TableHead>Keterangan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kegiatan.absensi.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center"
                                    >
                                        Belum ada data absensi
                                    </TableCell>
                                </TableRow>
                            ) : (
                                kegiatan.absensi.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.anggota.nim}
                                        </TableCell>
                                        <TableCell>
                                            {item.anggota.nama_lengkap}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(item.status_hadir)}`}
                                            >
                                                {item.status_hadir}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {formatDateTime(item.waktu_absen)}
                                        </TableCell>
                                        <TableCell>
                                            {item.keterangan || '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
