import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { create, destroy, edit, show } from '@/routes/keuangan';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    WalletIcon,
} from 'lucide-react';

interface Keuangan {
    id: number;
    jenis: string;
    kategori: string;
    nominal: string;
    tanggal_transaksi: string;
    deskripsi: string;
    bukti_file: string | null;
    created_by_name: string;
    created_at: string;
}

interface KeuanganIndexProps extends PageProps {
    keuangan: {
        data: Keuangan[];
    };
    canManage: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Keuangan', href: '#' },
];

export default function Index({ keuangan, canManage }: KeuanganIndexProps) {
    const handleDelete = (item: Keuangan) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus transaksi ${item.kategori} senilai Rp ${formatCurrency(item.nominal)}?`,
            )
        ) {
            router.delete(destroy.url(item.id));
        }
    };

    const formatCurrency = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const getJenisBadgeClass = (jenis: string) => {
        return jenis === 'masuk'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Keuangan" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <WalletIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Transaksi Keuangan
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola kas masuk dan keluar organisasi
                            </p>
                        </div>
                    </div>
                    {canManage && (
                        <Button asChild size="default" className="shadow-sm">
                            <Link href={create.url()}>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Tambah Transaksi
                            </Link>
                        </Button>
                    )}
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Daftar Transaksi</CardTitle>
                        <CardDescription>
                            Riwayat semua transaksi keuangan organisasi
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[140px]">
                                            Jenis
                                        </TableHead>
                                        <TableHead className="w-[140px]">
                                            Tanggal
                                        </TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead className="text-right">
                                            Nominal
                                        </TableHead>
                                        <TableHead className="max-w-[300px]">
                                            Deskripsi
                                        </TableHead>
                                        <TableHead>Dibuat Oleh</TableHead>
                                        <TableHead className="w-[180px] text-center">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {keuangan.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-32 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <WalletIcon className="h-8 w-8 text-muted-foreground/50" />
                                                    <p className="text-sm text-muted-foreground">
                                                        Belum ada data transaksi
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        keuangan.data.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="hover:bg-muted/50"
                                            >
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getJenisBadgeClass(item.jenis)}`}
                                                    >
                                                        {item.jenis ===
                                                        'masuk' ? (
                                                            <ArrowDownIcon className="h-3 w-3" />
                                                        ) : (
                                                            <ArrowUpIcon className="h-3 w-3" />
                                                        )}
                                                        <span className="capitalize">
                                                            {item.jenis}
                                                        </span>
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {formatDate(
                                                        item.tanggal_transaksi,
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {item.kategori}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span
                                                        className={`font-mono text-sm font-semibold ${item.jenis === 'masuk' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                                                    >
                                                        Rp{' '}
                                                        {formatCurrency(
                                                            item.nominal,
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="max-w-[300px]">
                                                    <p className="truncate text-sm text-muted-foreground">
                                                        {item.deskripsi || '-'}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {item.created_by_name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={show.url(
                                                                    item.id,
                                                                )}
                                                            >
                                                                <EyeIcon className="h-4 w-4" />
                                                                <span className="sr-only">
                                                                    Lihat
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                        {canManage && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-8 w-8 p-0"
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={edit.url(
                                                                            item.id,
                                                                        )}
                                                                    >
                                                                        <PencilIcon className="h-4 w-4" />
                                                                        <span className="sr-only">
                                                                            Edit
                                                                        </span>
                                                                    </Link>
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            item,
                                                                        )
                                                                    }
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                    <span className="sr-only">
                                                                        Hapus
                                                                    </span>
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
