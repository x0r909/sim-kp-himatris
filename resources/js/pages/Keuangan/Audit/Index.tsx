import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, router } from '@inertiajs/react';
import { PlusIcon, EyeIcon, ArrowDownIcon, ArrowUpIcon, ClipboardCheckIcon } from 'lucide-react';
import { create as auditCreate, show as auditShow } from '@/actions/App/Http/Controllers/AuditKeuanganController';

interface AuditKeuangan {
    id: number;
    keuangan: {
        id: number;
        jenis: 'masuk' | 'keluar';
        kategori: string;
        nominal: number;
        tanggal_transaksi: string;
    };
    status_audit: 'approved' | 'rejected' | 'pending';
    tanggal_audit: string;
    auditor_name: string;
    catatan: string;
}

interface IndexProps {
    auditLogs: AuditKeuangan[];
    canManage: boolean;
}

export default function Index({ auditLogs, canManage }: IndexProps) {
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
        <AppLayout title="Audit Keuangan">
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <ClipboardCheckIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Audit Keuangan</h1>
                            <p className="text-sm text-muted-foreground">
                                Log audit transaksi keuangan
                            </p>
                        </div>
                    </div>
                    {canManage && (
                        <Link href={auditCreate.url()}>
                            <Button className="shadow-sm">
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Tambah Audit
                            </Button>
                        </Link>
                    )}
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Daftar Audit</CardTitle>
                        <CardDescription>Riwayat audit transaksi keuangan</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {auditLogs.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[140px]">Jenis</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead className="text-right">Nominal</TableHead>
                                        <TableHead className="w-[120px]">Tgl Transaksi</TableHead>
                                        <TableHead className="w-[120px]">Status</TableHead>
                                        <TableHead className="w-[120px]">Tgl Audit</TableHead>
                                        <TableHead>Auditor</TableHead>
                                        <TableHead className="max-w-[200px]">Catatan</TableHead>
                                        <TableHead className="w-[80px] text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {auditLogs.map((audit) => (
                                        <TableRow key={audit.id} className="hover:bg-muted/50">
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    {audit.keuangan.jenis === 'masuk' ? (
                                                        <>
                                                            <ArrowDownIcon className="h-3.5 w-3.5 text-green-500" />
                                                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Masuk</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ArrowUpIcon className="h-3.5 w-3.5 text-red-500" />
                                                            <span className="text-sm font-medium text-red-600 dark:text-red-400">Keluar</span>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{audit.keuangan.kategori}</TableCell>
                                            <TableCell className={`text-right text-sm font-semibold ${audit.keuangan.jenis === 'masuk' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {formatCurrency(audit.keuangan.nominal)}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{audit.keuangan.tanggal_transaksi}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(audit.status_audit)}`}>
                                                    {getStatusText(audit.status_audit)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{audit.tanggal_audit}</TableCell>
                                            <TableCell className="text-sm">{audit.auditor_name}</TableCell>
                                            <TableCell>
                                                <span className="line-clamp-2 text-sm text-muted-foreground">
                                                    {audit.catatan}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Link href={auditShow.url(audit.id)}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <EyeIcon className="h-4 w-4" />
                                                        <span className="sr-only">Lihat detail</span>
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ClipboardCheckIcon className="h-12 w-12 text-muted-foreground/40 mb-2" />
                                <p className="text-sm text-muted-foreground">Belum ada audit keuangan</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
