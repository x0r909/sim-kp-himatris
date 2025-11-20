import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { destroy, edit, index } from '@/routes/surat-keluar';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { DownloadIcon, PencilIcon, TrashIcon } from 'lucide-react';

interface SuratKeluar {
    id: number;
    nomor_surat: string;
    tujuan: string;
    tanggal_keluar: string;
    perihal: string;
    file_surat: string;
    tanda_tangan: string;
    created_by: number;
    creator: {
        id: number;
        name: string;
    };
}

interface ShowProps extends PageProps {
    suratKeluar: SuratKeluar;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Surat Keluar', href: index.url() },
    { title: 'Detail Surat', href: '#' },
];

export default function Show({ suratKeluar }: ShowProps) {
    const handleDelete = () => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus surat ${suratKeluar.nomor_surat}?`,
            )
        ) {
            router.delete(destroy.url(suratKeluar.id));
        }
    };

    const handleDownload = () => {
        window.open(`/storage/${suratKeluar.file_surat}`, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Surat Keluar - ${suratKeluar.nomor_surat}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Detail Surat Keluar
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Informasi lengkap surat keluar
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={edit.url(suratKeluar.id)}>
                                <PencilIcon className="mr-2 size-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <TrashIcon className="mr-2 size-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                Nomor Surat
                            </h3>
                            <p className="text-lg font-semibold">
                                {suratKeluar.nomor_surat}
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                Tujuan
                            </h3>
                            <p className="text-lg">{suratKeluar.tujuan}</p>
                        </div>

                        <div>
                            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                Tanggal Keluar
                            </h3>
                            <p className="text-lg">
                                {new Date(
                                    suratKeluar.tanggal_keluar,
                                ).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                Tanda Tangan
                            </h3>
                            <p className="text-lg">
                                {suratKeluar.tanda_tangan}
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                Dibuat Oleh
                            </h3>
                            <p className="text-lg">
                                {suratKeluar.creator.name}
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                Perihal
                            </h3>
                            <p className="text-lg">{suratKeluar.perihal}</p>
                        </div>

                        <div className="md:col-span-2">
                            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                                File Surat
                            </h3>
                            <Button onClick={handleDownload}>
                                <DownloadIcon className="mr-2 size-4" />
                                Unduh File Surat
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" asChild>
                        <Link href={index.url()}>Kembali</Link>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
