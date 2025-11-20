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
import { create, destroy, edit, show } from '@/routes/kegiatan';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CalendarIcon, EyeIcon, PencilIcon, PlusIcon, TrashIcon, UsersIcon } from 'lucide-react';

interface Kegiatan {
    id: number;
    nama_kegiatan: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    deskripsi: string | null;
    penanggung_jawab: number;
    penanggung_jawab_nama: string;
    total_absensi: number;
    created_at: string;
    updated_at: string;
}

interface KegiatanIndexProps extends PageProps {
    kegiatan: {
        data: Kegiatan[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Kegiatan', href: '#' },
];

export default function Index({ kegiatan }: KegiatanIndexProps) {
    const handleDelete = (item: Kegiatan) => {
        if (confirm(`Apakah Anda yakin ingin menghapus kegiatan "${item.nama_kegiatan}"?`)) {
            router.delete(destroy.url(item.id));
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kegiatan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Kegiatan</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data kegiatan organisasi
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <PlusIcon className="mr-2 size-4" />
                            Tambah Kegiatan
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Kegiatan</TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="size-4" />
                                        Tanggal
                                    </div>
                                </TableHead>
                                <TableHead>Penanggung Jawab</TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-2">
                                        <UsersIcon className="size-4" />
                                        Total Absensi
                                    </div>
                                </TableHead>
                                <TableHead className="text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kegiatan.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center"
                                    >
                                        Tidak ada data kegiatan
                                    </TableCell>
                                </TableRow>
                            ) : (
                                kegiatan.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.nama_kegiatan}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {formatDate(item.tanggal_mulai)}
                                                {item.tanggal_mulai !== item.tanggal_selesai && (
                                                    <>
                                                        {' - '}
                                                        {formatDate(item.tanggal_selesai)}
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {item.penanggung_jawab_nama}
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {item.total_absensi} orang
                                            </span>
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
