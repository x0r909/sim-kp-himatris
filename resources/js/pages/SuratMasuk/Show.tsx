import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { destroy, edit, index } from '@/routes/surat-masuk';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { DownloadIcon, PencilIcon, TrashIcon } from 'lucide-react';

interface SuratMasuk {
    id: number;
    nomor_surat: string;
    pengirim: string;
    tanggal_masuk: string;
    perihal: string;
    file_surat: string;
    keterangan: string | null;
    created_by: number;
    creator: {
        id: number;
        name: string;
    };
}

interface ShowProps extends PageProps {
    suratMasuk: SuratMasuk;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Surat Masuk', href: index.url() },
    { title: 'Detail Surat', href: '#' },
];

export default function Show({ suratMasuk }: ShowProps) {
    const handleDelete = () => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus surat ${suratMasuk.nomor_surat}?`,
            )
        ) {
            router.delete(destroy.url(suratMasuk.id));
        }
    };

    const handleDownload = () => {
        window.open(`/storage/${suratMasuk.file_surat}`, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Surat Masuk - ${suratMasuk.nomor_surat}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Detail Surat Masuk
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Informasi lengkap surat masuk
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={edit.url(suratMasuk.id)}>
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
                                {suratMasuk.nomor_surat}
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                Pengirim
                            </h3>
                            <p className="text-lg">{suratMasuk.pengirim}</p>
                        </div>

                        <div>
                            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                Tanggal Masuk
                            </h3>
                            <p className="text-lg">
                                {new Date(
                                    suratMasuk.tanggal_masuk,
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
                                Dibuat Oleh
                            </h3>
                            <p className="text-lg">{suratMasuk.creator.name}</p>
                        </div>

                        <div className="md:col-span-2">
                            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                Perihal
                            </h3>
                            <p className="text-lg">{suratMasuk.perihal}</p>
                        </div>

                        {suratMasuk.keterangan && (
                            <div className="md:col-span-2">
                                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                                    Keterangan
                                </h3>
                                <p className="text-base">
                                    {suratMasuk.keterangan}
                                </p>
                            </div>
                        )}

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
