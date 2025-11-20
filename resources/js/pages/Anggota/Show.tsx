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
import { edit, index } from '@/routes/anggota';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PencilIcon } from 'lucide-react';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

interface HistoriJabatan {
    id: number;
    jabatan: string;
    tahun_mulai: number;
    tahun_selesai: number | null;
    periode: string;
    keterangan: string | null;
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
    total_absen: number;
    user: User | null;
    histori_jabatan: HistoriJabatan[];
}

interface ShowProps extends PageProps {
    anggotum: Anggota;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Data Anggota', href: index.url() },
    { title: 'Detail Anggota', href: '#' },
];

export default function Show({ anggotum }: ShowProps) {
    const getStatusBadgeClass = (status: string) => {
        const classes = {
            aktif: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
            nonaktif: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
            alumni: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        };
        return classes[status as keyof typeof classes] || '';
    };

    const getSpBadgeClass = (spLevel: number) => {
        if (spLevel === 0) return '';
        const classes = {
            1: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            2: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            3: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return classes[spLevel as keyof typeof classes] || '';
    };

    const getPeriodeBadgeClass = (periode: string) => {
        return periode === 'aktif'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    };

    const namaLengkap = anggotum.user?.name || 'Tidak ada akun';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Anggota" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Detail Anggota</h1>
                        <p className="text-sm text-muted-foreground">
                            Informasi lengkap anggota organisasi
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={edit.url(anggotum.id)}>
                            <PencilIcon className="mr-2 size-4" />
                            Edit
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {/* Foto Profile */}
                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex flex-col items-center">
                            {anggotum.foto ? (
                                <img
                                    src={`/storage/${anggotum.foto}`}
                                    alt={namaLengkap}
                                    className="mb-4 size-32 rounded-full object-cover"
                                />
                            ) : (
                                <div className="mb-4 flex size-32 items-center justify-center rounded-full bg-primary text-4xl text-primary-foreground">
                                    {namaLengkap.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <h2 className="text-center text-xl font-bold">{namaLengkap}</h2>
                            <p className="text-center text-sm text-muted-foreground">{anggotum.nim}</p>
                        </div>
                    </div>

                    {/* Data Pribadi */}
                    <div className="rounded-lg border bg-card p-6 md:col-span-2">
                        <h3 className="mb-4 text-lg font-semibold">Data Pribadi</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">NIM</p>
                                <p className="font-medium">{anggotum.nim}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Jurusan</p>
                                <p className="font-medium">{anggotum.jurusan}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Jabatan Saat Ini</p>
                                <p className="font-medium">{anggotum.jabatan}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tahun Masuk</p>
                                <p className="font-medium">{anggotum.tahun_masuk}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <span
                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(anggotum.status)}`}
                                >
                                    {anggotum.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Absen</p>
                                <p className="font-medium">{anggotum.total_absen}x</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Akun User</p>
                                <p className="font-medium">
                                    {anggotum.user ? `${anggotum.user.name} (@${anggotum.user.username})` : 'Tidak ada akun'}
                                </p>
                            </div>
                            {anggotum.sp_level > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Status Peringatan</p>
                                    <span
                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getSpBadgeClass(anggotum.sp_level)}`}
                                    >
                                        SP{anggotum.sp_level}
                                    </span>
                                </div>
                            )}
                        </div>
                        {anggotum.keterangan_sp && (
                            <div className="mt-4">
                                <p className="text-sm text-muted-foreground">Keterangan SP</p>
                                <p className="font-medium">{anggotum.keterangan_sp}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Histori Jabatan */}
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 text-lg font-semibold">Histori Jabatan</h3>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Jabatan</TableHead>
                                    <TableHead>Tahun Mulai</TableHead>
                                    <TableHead>Tahun Selesai</TableHead>
                                    <TableHead>Periode</TableHead>
                                    <TableHead>Keterangan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {anggotum.histori_jabatan.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            Tidak ada histori jabatan
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    anggotum.histori_jabatan.map((histori) => (
                                        <TableRow key={histori.id}>
                                            <TableCell className="font-medium">
                                                {histori.jabatan}
                                            </TableCell>
                                            <TableCell>{histori.tahun_mulai}</TableCell>
                                            <TableCell>
                                                {histori.tahun_selesai || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPeriodeBadgeClass(histori.periode)}`}
                                                >
                                                    {histori.periode}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {histori.keterangan || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
