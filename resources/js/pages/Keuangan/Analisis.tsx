import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    BarChart3,
    CalendarIcon,
    FolderIcon,
    HashIcon,
    WalletIcon,
} from 'lucide-react';

interface AnalisisProps {
    totalMasuk: number;
    totalKeluar: number;
    saldoAkhir: number;
    totalTransaksi: number;
    chartData: Array<{
        month: number;
        masuk: number;
        keluar: number;
    }>;
    byCategory: Array<{
        kategori: string;
        jenis: 'masuk' | 'keluar';
        total: number;
    }>;
    recentTransactions: Array<{
        id: number;
        jenis: 'masuk' | 'keluar';
        kategori: string;
        nominal: number;
        tanggal_transaksi: string;
        created_by_name: string;
    }>;
}

export default function Analisis({
    totalMasuk,
    totalKeluar,
    saldoAkhir,
    totalTransaksi,
    chartData,
    byCategory,
    recentTransactions,
}: AnalisisProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Oct',
        'Nov',
        'Des',
    ];

    const maxValue = Math.max(
        ...chartData.map((d) => Math.max(d.masuk, d.keluar)),
        1,
    );

    return (
        <AppLayout title="Analisis Keuangan">
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Analisis Keuangan
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Grafik dan analisis keuangan organisasi
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Pemasukan
                            </CardTitle>
                            <ArrowDownIcon className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(totalMasuk)}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Semua kas masuk
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Pengeluaran
                            </CardTitle>
                            <ArrowUpIcon className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {formatCurrency(totalKeluar)}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Semua kas keluar
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Saldo Akhir
                            </CardTitle>
                            <WalletIcon className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-2xl font-bold ${saldoAkhir >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}
                            >
                                {formatCurrency(saldoAkhir)}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Saldo saat ini
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Transaksi
                            </CardTitle>
                            <HashIcon className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalTransaksi}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Jumlah transaksi
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Monthly Chart */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Grafik Bulanan</CardTitle>
                        <CardDescription>
                            Perbandingan pemasukan dan pengeluaran per bulan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Chart Legend */}
                            <div className="flex items-center justify-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded bg-green-500"></div>
                                    <span className="text-sm font-medium">
                                        Pemasukan
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded bg-red-500"></div>
                                    <span className="text-sm font-medium">
                                        Pengeluaran
                                    </span>
                                </div>
                            </div>

                            {/* Simple Bar Chart */}
                            <div className="flex h-64 items-end justify-between gap-2 px-2">
                                {chartData.map((data) => (
                                    <div
                                        key={data.month}
                                        className="flex flex-1 flex-col items-center gap-2"
                                    >
                                        <div className="flex h-48 w-full items-end justify-center gap-1">
                                            {/* Masuk Bar */}
                                            <div
                                                className="flex-1 cursor-pointer rounded-t bg-green-500 transition-colors hover:bg-green-600"
                                                style={{
                                                    height: `${(data.masuk / maxValue) * 100}%`,
                                                    minHeight:
                                                        data.masuk > 0
                                                            ? '4px'
                                                            : '0',
                                                }}
                                                title={`Pemasukan: ${formatCurrency(data.masuk)}`}
                                            ></div>
                                            {/* Keluar Bar */}
                                            <div
                                                className="flex-1 cursor-pointer rounded-t bg-red-500 transition-colors hover:bg-red-600"
                                                style={{
                                                    height: `${(data.keluar / maxValue) * 100}%`,
                                                    minHeight:
                                                        data.keluar > 0
                                                            ? '4px'
                                                            : '0',
                                                }}
                                                title={`Pengeluaran: ${formatCurrency(data.keluar)}`}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {monthNames[data.month - 1]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Category Breakdown */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FolderIcon className="h-5 w-5 text-primary" />
                                Breakdown per Kategori
                            </CardTitle>
                            <CardDescription>
                                Total transaksi berdasarkan kategori
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {byCategory.length > 0 ? (
                                    byCategory.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`h-2 w-2 rounded-full ${item.jenis === 'masuk' ? 'bg-green-500' : 'bg-red-500'}`}
                                                ></div>
                                                <span className="text-sm font-medium">
                                                    {item.kategori}
                                                </span>
                                            </div>
                                            <span
                                                className={`text-sm font-semibold ${item.jenis === 'masuk' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                                            >
                                                {formatCurrency(item.total)}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <FolderIcon className="mb-2 h-12 w-12 text-muted-foreground/40" />
                                        <p className="text-sm text-muted-foreground">
                                            Tidak ada data kategori
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Transactions */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-primary" />
                                Transaksi Terbaru
                            </CardTitle>
                            <CardDescription>
                                10 transaksi terakhir yang dilakukan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentTransactions.length > 0 ? (
                                    recentTransactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    {transaction.jenis ===
                                                    'masuk' ? (
                                                        <ArrowDownIcon className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <ArrowUpIcon className="h-4 w-4 text-red-500" />
                                                    )}
                                                    <span className="text-sm font-medium">
                                                        {transaction.kategori}
                                                    </span>
                                                </div>
                                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>
                                                        {
                                                            transaction.tanggal_transaksi
                                                        }
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {
                                                            transaction.created_by_name
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                className={`text-right text-sm font-semibold ${transaction.jenis === 'masuk' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                                            >
                                                {formatCurrency(
                                                    transaction.nominal,
                                                )}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <CalendarIcon className="mb-2 h-12 w-12 text-muted-foreground/40" />
                                        <p className="text-sm text-muted-foreground">
                                            Tidak ada transaksi terbaru
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
