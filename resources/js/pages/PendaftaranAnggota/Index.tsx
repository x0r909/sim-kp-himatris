import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Eye, UserPlus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { index as pendaftaranIndex, show as pendaftaranShow, create as pendaftaranCreate } from '@/actions/App/Http/Controllers/PendaftaranAnggotaController';

interface Reviewer {
    id: number;
    name: string;
}

interface PendaftaranItem {
    id: number;
    nama_lengkap: string;
    nim: string;
    email: string;
    no_hp: string;
    jurusan: string;
    angkatan: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewer: Reviewer | null;
    reviewed_at: string | null;
    created_at: string;
}

interface IndexProps {
    pendaftaran: {
        data: PendaftaranItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    filters: {
        status?: string;
        search?: string;
    };
}

export default function Index({ pendaftaran, stats, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = () => {
        router.get(pendaftaranIndex.url(), {
            search: search || undefined,
            status: status !== 'all' ? status : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case 'approved':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Disetujui</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"><XCircle className="w-3 h-3 mr-1" /> Ditolak</Badge>;
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pendaftaran Anggota</h1>
                        <p className="text-muted-foreground mt-1">Kelola pendaftaran anggota baru</p>
                    </div>
                    <Link href={pendaftaranCreate.url()} target="_blank">
                        <Button>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Form Pendaftaran Publik
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pendaftaran</CardTitle>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Menunggu Review</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.approved}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
                            <XCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.rejected}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                        <CardDescription>Cari dan filter data pendaftaran</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Cari nama, NIM, atau email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Disetujui</SelectItem>
                                    <SelectItem value="rejected">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilter}>
                                <Search className="w-4 h-4 mr-2" />
                                Cari
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pendaftaran</CardTitle>
                        <CardDescription>
                            Menampilkan {pendaftaran.data.length} dari {pendaftaran.total} pendaftaran
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left p-4 font-semibold text-sm">Nama</th>
                                        <th className="text-left p-4 font-semibold text-sm">NIM</th>
                                        <th className="text-left p-4 font-semibold text-sm">Jurusan</th>
                                        <th className="text-left p-4 font-semibold text-sm">Angkatan</th>
                                        <th className="text-left p-4 font-semibold text-sm">Status</th>
                                        <th className="text-left p-4 font-semibold text-sm">Tanggal</th>
                                        <th className="text-right p-4 font-semibold text-sm">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendaftaran.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center p-16">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="rounded-full bg-muted p-4">
                                                        <UserPlus className="h-10 w-10 text-muted-foreground" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-lg font-semibold">Belum Ada Pendaftaran</p>
                                                        <p className="text-sm text-muted-foreground max-w-sm">Belum ada calon anggota yang mendaftar. Bagikan link pendaftaran untuk menerima pendaftaran baru.</p>
                                                    </div>
                                                    <Link href={pendaftaranCreate.url()} target="_blank">
                                                        <Button variant="outline" className="mt-2">
                                                            <UserPlus className="w-4 h-4 mr-2" />
                                                            Buka Form Pendaftaran
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        pendaftaran.data.map((item) => (
                                            <tr key={item.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                                                <td className="p-4">
                                                    <div>
                                                        <div className="font-medium">{item.nama_lengkap}</div>
                                                        <div className="text-sm text-muted-foreground">{item.email}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-mono text-sm">{item.nim}</td>
                                                <td className="p-4 text-sm">{item.jurusan}</td>
                                                <td className="p-4 text-sm">{item.angkatan}</td>
                                                <td className="p-4">{getStatusBadge(item.status)}</td>
                                                <td className="p-4 text-sm text-muted-foreground">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Link href={pendaftaranShow.url(item.id)}>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Detail
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pendaftaran.last_page > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan <span className="font-medium">{(pendaftaran.current_page - 1) * pendaftaran.per_page + 1}</span> - <span className="font-medium">{Math.min(pendaftaran.current_page * pendaftaran.per_page, pendaftaran.total)}</span> dari <span className="font-medium">{pendaftaran.total}</span> data
                                </p>
                                <div className="flex flex-wrap gap-1 justify-center">
                                    {pendaftaran.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="min-w-[2.5rem]"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
