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
import { create, destroy, edit, show } from '@/routes/absensi';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ClipboardCheckIcon, EyeIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';

interface Absensi {
    id: number;
    kegiatan_nama: string;
    anggota_nama: string;
    status_hadir: string;
    waktu_absen: string;
    created_at: string;
}

interface AbsensiIndexProps extends PageProps {
    absensi: {
        data: Absensi[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Data Absensi', href: '#' },
];

export default function Index({ absensi }: AbsensiIndexProps) {
    const handleDelete = (item: Absensi) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus absensi ${item.anggota_nama} pada kegiatan "${item.kegiatan_nama}"?`,
            )
        ) {
            router.delete(destroy.url(item.id));
        }
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
            <Head title="Data Absensi" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <ClipboardCheckIcon className="size-6" />
                            <h1 className="text-2xl font-bold">Data Absensi</h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Kelola data absensi anggota pada kegiatan
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <PlusIcon className="mr-2 size-4" />
                            Tambah Absensi
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kegiatan</TableHead>
                                <TableHead>Nama Anggota</TableHead>
                                <TableHead>Status Kehadiran</TableHead>
                                <TableHead>Waktu Absen</TableHead>
                                <TableHead className="text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {absensi.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center"
                                    >
                                        Tidak ada data absensi
                                    </TableCell>
                                </TableRow>
                            ) : (
                                absensi.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.kegiatan_nama}
                                        </TableCell>
                                        <TableCell>{item.anggota_nama}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(item.status_hadir)}`}
                                            >
                                                {item.status_hadir}
                                            </span>
                                        </TableCell>
                                        <TableCell>{item.waktu_absen}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link href={show.url(item.id)}>
                                                        <EyeIcon className="size-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link href={edit.url(item.id)}>
                                                        <PencilIcon className="size-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleDelete(item)
                                                    }
                                                >
                                                    <TrashIcon className="size-4" />
                                                </Button>
                                            </div>
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
