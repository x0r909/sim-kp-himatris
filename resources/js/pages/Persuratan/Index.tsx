import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as suratMasukIndex } from '@/routes/surat-masuk';
import { index as suratKeluarIndex } from '@/routes/surat-keluar';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText, Mail, MailOpen } from 'lucide-react';

interface PersuratanIndexProps extends PageProps {
    summary: {
        total_surat_masuk: number;
        total_surat_keluar: number;
        surat_masuk_bulan_ini: number;
        surat_keluar_bulan_ini: number;
    };
    recent_surat_masuk: Array<{
        id: number;
        nomor_surat: string;
        pengirim: string;
        tanggal_masuk: string;
        perihal: string;
    }>;
    recent_surat_keluar: Array<{
        id: number;
        nomor_surat: string;
        tujuan: string;
        tanggal_keluar: string;
        perihal: string;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Persuratan', href: '#' },
];

export default function Index({
    summary,
    recent_surat_masuk,
    recent_surat_keluar,
}: PersuratanIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Persuratan" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Persuratan</h1>
                    <p className="text-sm text-muted-foreground">
                        Ringkasan dan statistik surat masuk & keluar
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Surat Masuk
                            </CardTitle>
                            <MailOpen className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {summary.total_surat_masuk}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Seluruh surat masuk
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Surat Keluar
                            </CardTitle>
                            <Mail className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {summary.total_surat_keluar}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Seluruh surat keluar
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Surat Masuk Bulan Ini
                            </CardTitle>
                            <MailOpen className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {summary.surat_masuk_bulan_ini}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {new Date().toLocaleDateString('id-ID', {
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Surat Keluar Bulan Ini
                            </CardTitle>
                            <Mail className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {summary.surat_keluar_bulan_ini}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {new Date().toLocaleDateString('id-ID', {
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Surat Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Surat Masuk */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Surat Masuk Terbaru</CardTitle>
                                    <CardDescription>
                                        5 surat masuk terakhir
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={suratMasukIndex.url()}>
                                        Lihat Semua
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recent_surat_masuk.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada surat masuk
                                    </p>
                                ) : (
                                    recent_surat_masuk.map((surat) => (
                                        <div
                                            key={surat.id}
                                            className="flex items-start gap-3 rounded-lg border p-3"
                                        >
                                            <MailOpen className="mt-0.5 size-5 text-muted-foreground" />
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {surat.nomor_surat}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {surat.perihal}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Dari: {surat.pengirim} •{' '}
                                                    {new Date(
                                                        surat.tanggal_masuk,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Surat Keluar */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Surat Keluar Terbaru</CardTitle>
                                    <CardDescription>
                                        5 surat keluar terakhir
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={suratKeluarIndex.url()}>
                                        Lihat Semua
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recent_surat_keluar.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada surat keluar
                                    </p>
                                ) : (
                                    recent_surat_keluar.map((surat) => (
                                        <div
                                            key={surat.id}
                                            className="flex items-start gap-3 rounded-lg border p-3"
                                        >
                                            <Mail className="mt-0.5 size-5 text-muted-foreground" />
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {surat.nomor_surat}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {surat.perihal}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Kepada: {surat.tujuan} •{' '}
                                                    {new Date(
                                                        surat.tanggal_keluar,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Aksi Cepat</CardTitle>
                        <CardDescription>
                            Akses cepat ke menu persuratan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Button asChild>
                            <Link href={suratMasukIndex.url()}>
                                <MailOpen className="mr-2 size-4" />
                                Kelola Surat Masuk
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={suratKeluarIndex.url()}>
                                <Mail className="mr-2 size-4" />
                                Kelola Surat Keluar
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
