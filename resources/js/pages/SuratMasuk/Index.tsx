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
import { create, destroy, edit, show } from '@/routes/surat-masuk';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    DownloadIcon,
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from 'lucide-react';

interface SuratMasuk {
    id: number;
    nomor_surat: string;
    pengirim: string;
    tanggal_masuk: string;
    perihal: string;
    file_surat: string;
    created_by_name: string;
}

interface SuratMasukIndexProps extends PageProps {
    suratMasuk: {
        data: SuratMasuk[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Surat Masuk', href: '#' },
];

export default function Index({ suratMasuk }: SuratMasukIndexProps) {
    const handleDelete = (item: SuratMasuk) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus surat ${item.nomor_surat}?`,
            )
        ) {
            router.delete(destroy.url(item.id));
        }
    };

    const handleDownload = (file: string) => {
        window.open(`/storage/${file}`, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Surat Masuk" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Surat Masuk</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola surat masuk organisasi
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <PlusIcon className="mr-2 size-4" />
                            Tambah Surat Masuk
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nomor Surat</TableHead>
                                <TableHead>Pengirim</TableHead>
                                <TableHead>Tanggal Masuk</TableHead>
                                <TableHead>Perihal</TableHead>
                                <TableHead>File</TableHead>
                                <TableHead>Dibuat Oleh</TableHead>
                                <TableHead className="text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suratMasuk.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center"
                                    >
                                        Belum ada data surat masuk
                                    </TableCell>
                                </TableRow>
                            ) : (
                                suratMasuk.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.nomor_surat}
                                        </TableCell>
                                        <TableCell>{item.pengirim}</TableCell>
                                        <TableCell>
                                            {new Date(
                                                item.tanggal_masuk,
                                            ).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell>{item.perihal}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleDownload(
                                                        item.file_surat,
                                                    )
                                                }
                                            >
                                                <DownloadIcon className="mr-1 size-4" />
                                                Unduh
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            {item.created_by_name}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={show.url(item.id)}
                                                    >
                                                        <EyeIcon className="size-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit.url(item.id)}
                                                    >
                                                        <PencilIcon className="size-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
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
