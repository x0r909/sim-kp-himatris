import {
    destroy as agendaDestroy,
    edit as agendaEdit,
    index as agendaIndex,
} from '@/actions/App/Http/Controllers/AgendaController';
import { show as kegiatanShow } from '@/actions/App/Http/Controllers/KegiatanController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import {
    CalendarCheck,
    CalendarIcon,
    Clock,
    Edit,
    FileText,
    MapPin,
    Trash,
    User,
} from 'lucide-react';

interface AgendaItem {
    id: number;
    judul: string;
    deskripsi: string | null;
    tanggal_mulai: string;
    tanggal_selesai: string;
    lokasi: string | null;
    jenis: 'rapat' | 'seminar' | 'workshop' | 'kegiatan' | 'lainnya';
    penanggung_jawab: {
        id: number;
        name: string;
        email: string;
    };
    kegiatan: {
        id: number;
        nama_kegiatan: string;
        tanggal_mulai: string;
    } | null;
    status: 'draft' | 'published' | 'completed' | 'cancelled';
    catatan: string | null;
    creator: {
        id: number;
        name: string;
    };
    updater: {
        id: number;
        name: string;
    } | null;
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    agenda: AgendaItem;
    canManage: boolean;
}

export default function Show({ agenda, canManage }: ShowProps) {
    const getJenisBadgeClass = (jenis: string) => {
        switch (jenis) {
            case 'rapat':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400';
            case 'seminar':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400';
            case 'workshop':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-950/30 dark:text-orange-400';
            case 'kegiatan':
                return 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-400';
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400';
            case 'completed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-400';
        }
    };

    const getJenisText = (jenis: string) => {
        const jenisMap: Record<string, string> = {
            rapat: 'Rapat',
            seminar: 'Seminar',
            workshop: 'Workshop',
            kegiatan: 'Kegiatan',
            lainnya: 'Lainnya',
        };
        return jenisMap[jenis] || jenis;
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            draft: 'Draft',
            published: 'Published',
            completed: 'Selesai',
            cancelled: 'Dibatalkan',
        };
        return statusMap[status] || status;
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
            router.delete(agendaDestroy.url(agenda.id));
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <CalendarIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Detail Agenda
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Informasi lengkap agenda kegiatan
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={agendaIndex.url()}>
                            <Button variant="outline" className="shadow-sm">
                                Kembali
                            </Button>
                        </Link>
                        {canManage && (
                            <>
                                <Link href={agendaEdit.url(agenda.id)}>
                                    <Button
                                        variant="outline"
                                        className="shadow-sm"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    className="shadow-sm"
                                >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Hapus
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Status Card */}
                <Card
                    className={`shadow-sm ${agenda.status === 'published' ? 'border-green-300 bg-green-50/50 dark:bg-green-950/20' : agenda.status === 'completed' ? 'border-blue-300 bg-blue-50/50 dark:bg-blue-950/20' : agenda.status === 'cancelled' ? 'border-red-300 bg-red-50/50 dark:bg-red-950/20' : 'border-yellow-300 bg-yellow-50/50 dark:bg-yellow-950/20'}`}
                >
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="mb-2 text-sm text-muted-foreground">
                                    Status Agenda
                                </p>
                                <div className="flex gap-2">
                                    <span
                                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeClass(agenda.status)}`}
                                    >
                                        {getStatusText(agenda.status)}
                                    </span>
                                    <span
                                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getJenisBadgeClass(agenda.jenis)}`}
                                    >
                                        {getJenisText(agenda.jenis)}
                                    </span>
                                </div>
                            </div>
                            <CalendarIcon
                                className={`h-12 w-12 ${agenda.status === 'published' ? 'text-green-500' : agenda.status === 'completed' ? 'text-blue-500' : agenda.status === 'cancelled' ? 'text-red-500' : 'text-yellow-500'}`}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Main Information */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            {agenda.judul}
                        </CardTitle>
                        <CardDescription>
                            Informasi utama kegiatan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Datetime & Location */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Waktu Mulai
                                        </p>
                                        <p className="font-medium">
                                            {formatDateTime(
                                                agenda.tanggal_mulai,
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Waktu Selesai
                                        </p>
                                        <p className="font-medium">
                                            {formatDateTime(
                                                agenda.tanggal_selesai,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {agenda.lokasi && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Lokasi
                                            </p>
                                            <p className="font-medium">
                                                {agenda.lokasi}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start gap-3">
                                    <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Penanggung Jawab
                                        </p>
                                        <p className="font-medium">
                                            {agenda.penanggung_jawab.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {agenda.penanggung_jawab.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {agenda.deskripsi && (
                            <div className="border-t pt-4">
                                <div className="flex items-start gap-3">
                                    <FileText className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="mb-2 text-sm text-muted-foreground">
                                            Deskripsi
                                        </p>
                                        <p className="whitespace-pre-wrap">
                                            {agenda.deskripsi}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Connected Kegiatan */}
                        {agenda.kegiatan && (
                            <div className="border-t pt-4">
                                <div className="flex items-start gap-3">
                                    <CalendarCheck className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="mb-2 text-sm text-muted-foreground">
                                            Terhubung dengan Kegiatan
                                        </p>
                                        <Link
                                            href={kegiatanShow.url(
                                                agenda.kegiatan.id,
                                            )}
                                        >
                                            <Button
                                                variant="link"
                                                className="h-auto p-0 text-primary hover:text-primary/80"
                                            >
                                                {agenda.kegiatan.nama_kegiatan}{' '}
                                                -{' '}
                                                {agenda.kegiatan.tanggal_mulai}{' '}
                                                →
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {agenda.catatan && (
                            <div className="border-t pt-4">
                                <div className="flex items-start gap-3">
                                    <FileText className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="mb-2 text-sm text-muted-foreground">
                                            Catatan
                                        </p>
                                        <div className="rounded-lg border bg-muted/50 p-4">
                                            <p className="text-sm whitespace-pre-wrap">
                                                {agenda.catatan}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Additional Information */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Informasi Tambahan</CardTitle>
                        <CardDescription>
                            Riwayat dan metadata agenda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 text-sm md:grid-cols-2">
                            <div>
                                <p className="text-muted-foreground">
                                    Dibuat Oleh
                                </p>
                                <p className="font-medium">
                                    {agenda.creator.name}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {new Date(agenda.created_at).toLocaleString(
                                        'id-ID',
                                    )}
                                </p>
                            </div>
                            {agenda.updater && (
                                <div>
                                    <p className="text-muted-foreground">
                                        Terakhir Diubah Oleh
                                    </p>
                                    <p className="font-medium">
                                        {agenda.updater.name}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {new Date(
                                            agenda.updated_at,
                                        ).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
