import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Activity,
    Calendar,
    CalendarCheck,
    FileCheck,
    Mail,
    MailOpen,
    TrendingDown,
    TrendingUp,
    UserPlus,
    Users,
    Wallet,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    stats: {
        total_anggota: number;
        anggota_aktif: number;
        pendaftaran_pending: number;
        surat_masuk_bulan_ini: number;
        surat_keluar_bulan_ini: number;
        kegiatan_aktif: number;
        agenda_bulan_ini: number;
        total_pemasukan: number;
        total_pengeluaran: number;
        saldo: number;
        audit_tertunda: number;
    };
    recent_activities: Array<{
        type: string;
        title: string;
        description: string;
        date: string;
    }>;
    user_role: string;
}

export default function Dashboard({
    stats,
    recent_activities,
    user_role,
}: DashboardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const isFinanceRole = [
        'admin',
        'ketua',
        'wakil_ketua',
        'sekretaris_umum',
        'bendahara_1',
        'bendahara_2',
    ].includes(user_role);
    const isPendaftaranRole = [
        'admin',
        'ketua',
        'wakil_ketua',
        'sekretaris_umum',
    ].includes(user_role);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6 md:p-8">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Ringkasan data organisasi HIMATRIS
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Anggota */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Anggota
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_anggota}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {stats.anggota_aktif} aktif
                            </p>
                        </CardContent>
                    </Card>

                    {/* Pendaftaran - hanya untuk role tertentu */}
                    {isPendaftaranRole && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pendaftaran Baru
                                </CardTitle>
                                <UserPlus className="h-4 w-4 text-yellow-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.pendaftaran_pending}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Menunggu review
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Surat Masuk */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Surat Masuk
                            </CardTitle>
                            <Mail className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.surat_masuk_bulan_ini}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Bulan ini
                            </p>
                        </CardContent>
                    </Card>

                    {/* Surat Keluar */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Surat Keluar
                            </CardTitle>
                            <MailOpen className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.surat_keluar_bulan_ini}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Bulan ini
                            </p>
                        </CardContent>
                    </Card>

                    {/* Kegiatan */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kegiatan Aktif
                            </CardTitle>
                            <CalendarCheck className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.kegiatan_aktif}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Sedang berlangsung
                            </p>
                        </CardContent>
                    </Card>

                    {/* Agenda */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Agenda
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.agenda_bulan_ini}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Bulan ini
                            </p>
                        </CardContent>
                    </Card>

                    {/* Keuangan - hanya untuk role tertentu */}
                    {isFinanceRole && (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Saldo Kas
                                    </CardTitle>
                                    <Wallet className="h-4 w-4 text-emerald-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {formatCurrency(stats.saldo)}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Total saldo
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Audit Pending
                                    </CardTitle>
                                    <FileCheck className="h-4 w-4 text-red-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats.audit_tertunda}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Menunggu review
                                    </p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Keuangan Detail - hanya untuk role tertentu */}
                {isFinanceRole && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    Total Pemasukan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-600">
                                    {formatCurrency(stats.total_pemasukan)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingDown className="h-5 w-5 text-red-600" />
                                    Total Pengeluaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-red-600">
                                    {formatCurrency(stats.total_pengeluaran)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Recent Activities */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Aktivitas Terbaru
                        </CardTitle>
                        <CardDescription>
                            10 aktivitas terakhir di sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recent_activities.length === 0 ? (
                            <p className="py-8 text-center text-muted-foreground">
                                Belum ada aktivitas
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {recent_activities.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 border-b pb-3 last:border-b-0"
                                    >
                                        <div className="mt-1 rounded-full bg-muted p-2">
                                            {activity.type ===
                                                'surat_masuk' && (
                                                <Mail className="h-4 w-4" />
                                            )}
                                            {activity.type === 'kegiatan' && (
                                                <CalendarCheck className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium">
                                                {activity.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.description}
                                            </p>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {formatDate(activity.date)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
