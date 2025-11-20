import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ArrowDownIcon, ArrowUpIcon, CalendarIcon, FolderIcon, FileTextIcon, UserIcon, ClipboardCheckIcon } from 'lucide-react';
import { index as keuanganIndex } from '@/actions/App/Http/Controllers/KeuanganController';
import { index as auditIndex } from '@/actions/App/Http/Controllers/AuditKeuanganController';

interface AuditKeuanganShowProps {
    audit: {
        id: number;
        keuangan: {
            id: number;
            jenis: 'masuk' | 'keluar';
            kategori: string;
            nominal: number;
            tanggal_transaksi: string;
            deskripsi: string;
            created_by_name: string;
        };
        status_audit: 'approved' | 'rejected' | 'pending';
        tanggal_audit: string;
        auditor_name: string;
        catatan: string;
        created_at: string;
        updated_at: string;
    };
}

export default function Show({ audit }: AuditKeuanganShowProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'approved':
                return 'Disetujui';
            case 'rejected':
                return 'Ditolak';
            case 'pending':
                return 'Pending';
            default:
                return status;
        }
    };

    return (
        <AppLayout title="Detail Audit Keuangan">
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <ClipboardCheckIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Detail Audit Keuangan</h1>
                            <p className="text-sm text-muted-foreground">
                                Informasi lengkap audit transaksi
                            </p>
                        </div>
                    </div>
                    <Link href={auditIndex.url()}>
                        <Button variant="outline" className="shadow-sm">Kembali</Button>
                    </Link>
                </div>

                {/* Audit Status Card */}
                <Card className={`shadow-sm ${audit.status_audit === 'approved' ? 'border-green-300 bg-green-50/50 dark:bg-green-950/20' : audit.status_audit === 'rejected' ? 'border-red-300 bg-red-50/50 dark:bg-red-950/20' : 'border-yellow-300 bg-yellow-50/50 dark:bg-yellow-950/20'}`}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Status Audit</p>
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium mt-2 ${getStatusBadgeClass(audit.status_audit)}`}>
                                    {getStatusText(audit.status_audit)}
                                </span>
                            </div>
                            <ClipboardCheckIcon className={`h-12 w-12 ${audit.status_audit === 'approved' ? 'text-green-500' : audit.status_audit === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`} />
                        </div>
                    </CardContent>
                </Card>

                {/* Transaction Information */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Informasi Transaksi</CardTitle>
                        <CardDescription>Detail transaksi yang diaudit</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className={`rounded-lg border p-4 ${audit.keuangan.jenis === 'masuk' ? 'bg-green-50 border-green-200 dark:bg-green-950/20' : 'bg-red-50 border-red-200 dark:bg-red-950/20'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Jenis Transaksi</p>
                                        <p className={`text-lg font-semibold ${audit.keuangan.jenis === 'masuk' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                                            {audit.keuangan.jenis === 'masuk' ? 'Kas Masuk' : 'Kas Keluar'}
                                        </p>
                                    </div>
                                    {audit.keuangan.jenis === 'masuk' ? (
                                        <ArrowDownIcon className="h-8 w-8 text-green-500" />
                                    ) : (
                                        <ArrowUpIcon className="h-8 w-8 text-red-500" />
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border p-4 bg-blue-50 border-blue-200 dark:bg-blue-950/20">
                                <p className="text-sm text-muted-foreground">Nominal</p>
                                <p className={`text-2xl font-bold ${audit.keuangan.jenis === 'masuk' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                                    {formatCurrency(audit.keuangan.nominal)}
                                </p>
                            </div>

                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">Kategori</p>
                                <p className="text-lg font-semibold">{audit.keuangan.kategori}</p>
                            </div>
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <div className="flex items-start gap-3">
                                <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Tanggal Transaksi</p>
                                    <p className="font-medium">{audit.keuangan.tanggal_transaksi}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FileTextIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Deskripsi</p>
                                    <p className="font-medium">{audit.keuangan.deskripsi || '-'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Dibuat Oleh</p>
                                    <p className="font-medium">{audit.keuangan.created_by_name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 pt-2">
                                <Link href={keuanganIndex.url()}>
                                    <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                                        Lihat Detail Transaksi →
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Information */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Informasi Audit</CardTitle>
                        <CardDescription>Detail auditor dan hasil audit</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Auditor</p>
                                    <p className="font-medium">{audit.auditor_name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Tanggal Audit</p>
                                    <p className="font-medium">{audit.tanggal_audit}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 border-t pt-4">
                            <FileTextIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-2">Catatan Audit</p>
                                <div className="rounded-lg bg-muted/50 p-4 border">
                                    <p className="whitespace-pre-wrap text-sm">{audit.catatan}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Information */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Informasi Tambahan</CardTitle>
                        <CardDescription>Waktu pembuatan dan perubahan data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 text-sm">
                            <div>
                                <p className="text-muted-foreground">Dibuat Pada</p>
                                <p className="font-medium">{new Date(audit.created_at).toLocaleString('id-ID')}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Terakhir Diubah</p>
                                <p className="font-medium">{new Date(audit.updated_at).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
