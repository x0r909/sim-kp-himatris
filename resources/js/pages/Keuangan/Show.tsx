import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { edit, index } from '@/routes/keuangan';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    CalendarIcon,
    FileTextIcon,
    PencilIcon,
    ReceiptIcon,
    UserIcon,
} from 'lucide-react';

interface Creator {
    id: number;
    name: string;
}

interface AuditLog {
    id: number;
    status_audit: string;
    tanggal_audit: string;
    catatan: string;
    auditor: {
        id: number;
        name: string;
    };
}

interface Keuangan {
    id: number;
    jenis: string;
    kategori: string;
    nominal: string;
    tanggal_transaksi: string;
    deskripsi: string;
    bukti_file: string | null;
    created_by: number;
    creator?: Creator;
    audit_logs?: AuditLog[];
    created_at: string;
    updated_at: string;
}

interface ShowProps extends PageProps {
    keuangan: Keuangan;
    canManage: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Keuangan', href: index.url() },
    { title: 'Detail Transaksi', href: '#' },
];

export default function Show({ keuangan, canManage }: ShowProps) {
    const formatCurrency = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

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

    const getJenisBadgeClass = (jenis: string) => {
        return jenis === 'masuk'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Transaksi" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Detail Transaksi</h1>
                        <p className="text-sm text-muted-foreground">
                            Informasi lengkap transaksi keuangan
                        </p>
                    </div>
                    {canManage && (
                        <Button asChild>
                            <Link href={edit.url(keuangan.id)}>
                                <PencilIcon className="mr-2 size-4" />
                                Edit Transaksi
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div
                        className={`rounded-lg border p-6 ${keuangan.jenis === 'masuk' ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'}`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Jenis Transaksi
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    {keuangan.jenis === 'masuk' ? (
                                        <ArrowDownIcon className="size-5 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                        <ArrowUpIcon className="size-5 text-red-600 dark:text-red-400" />
                                    )}
                                    <span className="text-lg font-semibold capitalize">
                                        Kas {keuangan.jenis}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <p className="text-sm text-muted-foreground">Nominal</p>
                        <p className="mt-2 font-mono text-2xl font-bold">
                            {formatCurrency(keuangan.nominal)}
                        </p>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <p className="text-sm text-muted-foreground">Kategori</p>
                        <p className="mt-2 text-lg font-semibold">
                            {keuangan.kategori}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Informasi Transaksi
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <CalendarIcon className="mt-1 size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">
                                    Tanggal Transaksi
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(keuangan.tanggal_transaksi)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <ReceiptIcon className="mt-1 size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Kategori</p>
                                <p className="text-sm text-muted-foreground">
                                    {keuangan.kategori}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FileTextIcon className="mt-1 size-5 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Deskripsi</p>
                                <p className="text-sm text-muted-foreground">
                                    {keuangan.deskripsi}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <UserIcon className="mt-1 size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">
                                    Dibuat Oleh
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {keuangan.creator?.name || 'Unknown'}
                                </p>
                            </div>
                        </div>

                        {keuangan.bukti_file && (
                            <div>
                                <p className="mb-2 text-sm font-medium">
                                    Bukti Transaksi
                                </p>
                                <Button variant="outline" asChild>
                                    <a
                                        href={`/storage/${keuangan.bukti_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Lihat Bukti
                                    </a>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {keuangan.audit_logs && keuangan.audit_logs.length > 0 && (
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">
                            Riwayat Audit
                        </h2>
                        <div className="space-y-4">
                            {keuangan.audit_logs.map((audit) => (
                                <div
                                    key={audit.id}
                                    className="rounded-lg border p-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium">
                                                {audit.auditor.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(audit.tanggal_audit)}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                audit.status_audit === 'approved'
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                                    : audit.status_audit ===
                                                        'rejected'
                                                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            }`}
                                        >
                                            {audit.status_audit}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm">
                                        {audit.catatan}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
                                {formatDateTime(keuangan.created_at)}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm font-medium">
                                Terakhir diubah
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formatDateTime(keuangan.updated_at)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
