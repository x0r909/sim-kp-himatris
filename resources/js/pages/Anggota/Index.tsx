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
import { create, destroy, edit, show } from '@/routes/anggota';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';

interface Anggota {
    id: number;
    nim: string;
    nama_lengkap: string;
    jurusan: string;
    jabatan: string;
    tahun_masuk: number;
    status: string;
    foto: string | null;
    status_peringatan: string | null;
    sp_level: number;
}

interface AnggotaIndexProps extends PageProps {
    anggota: {
        data: Anggota[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Data Anggota', href: '#' },
];

export default function Index({ anggota }: AnggotaIndexProps) {
    const handleDelete = (item: Anggota) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data ${item.nama_lengkap}?`)) {
            router.delete(destroy.url(item.id));
        }
    };

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Anggota" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Data Anggota</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data anggota organisasi
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <PlusIcon className="mr-2 size-4" />
                            Tambah Anggota
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Foto</TableHead>
                                <TableHead>NIM</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Jurusan</TableHead>
                                <TableHead>Jabatan</TableHead>
                                <TableHead>Tahun Masuk</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>SP</TableHead>
                                <TableHead className="text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {anggota.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="text-center"
                                    >
                                        Tidak ada data anggota
                                    </TableCell>
                                </TableRow>
                            ) : (
                                anggota.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {item.foto ? (
                                                <img
                                                    src={`/storage/${item.foto}`}
                                                    alt={item.nama_lengkap}
                                                    className="size-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                                                    {item.nama_lengkap
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {item.nim}
                                        </TableCell>
                                        <TableCell>{item.nama_lengkap}</TableCell>
                                        <TableCell>{item.jurusan}</TableCell>
                                        <TableCell>{item.jabatan}</TableCell>
                                        <TableCell>{item.tahun_masuk}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(item.status)}`}
                                            >
                                                {item.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {item.sp_level > 0 ? (
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getSpBadgeClass(item.sp_level)}`}
                                                >
                                                    {item.status_peringatan}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
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
