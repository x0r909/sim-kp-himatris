import {
    create as pendaftaranCreate,
    index as pendaftaranIndex,
    show as pendaftaranShow,
} from '@/actions/App/Http/Controllers/PendaftaranAnggotaController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    Eye,
    Search,
    UserPlus,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

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
        router.get(
            pendaftaranIndex.url(),
            {
                search: search || undefined,
                status: status !== 'all' ? status : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge
                        variant="outline"
                        className="border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    >
                        <Clock className="mr-1 h-3 w-3" /> Pending
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                    >
                        <CheckCircle className="mr-1 h-3 w-3" /> Disetujui
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge
                        variant="outline"
                        className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                    >
                        <XCircle className="mr-1 h-3 w-3" /> Ditolak
                    </Badge>
                );
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Pendaftaran Anggota
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Kelola pendaftaran anggota baru
                        </p>
                    </div>
                    <Link href={pendaftaranCreate.url()} target="_blank">
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Form Pendaftaran Publik
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Pendaftaran
                            </CardTitle>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Menunggu Review
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.pending}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Disetujui
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.approved}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Ditolak
                            </CardTitle>
                            <XCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.rejected}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                        <CardDescription>
                            Cari dan filter data pendaftaran
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama, NIM, atau email..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' && handleFilter()
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="approved">
                                        Disetujui
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Ditolak
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilter}>
                                <Search className="mr-2 h-4 w-4" />
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
                            Menampilkan {pendaftaran.data.length} dari{' '}
                            {pendaftaran.total} pendaftaran
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-4 text-left text-sm font-semibold">
                                            Nama
                                        </th>
                                        <th className="p-4 text-left text-sm font-semibold">
                                            NIM
                                        </th>
                                        <th className="p-4 text-left text-sm font-semibold">
                                            Jurusan
                                        </th>
                                        <th className="p-4 text-left text-sm font-semibold">
                                            Angkatan
                                        </th>
                                        <th className="p-4 text-left text-sm font-semibold">
                                            Status
                                        </th>
                                        <th className="p-4 text-left text-sm font-semibold">
                                            Tanggal
                                        </th>
                                        <th className="p-4 text-right text-sm font-semibold">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendaftaran.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="p-16 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="rounded-full bg-muted p-4">
                                                        <UserPlus className="h-10 w-10 text-muted-foreground" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-lg font-semibold">
                                                            Belum Ada
                                                            Pendaftaran
                                                        </p>
                                                        <p className="max-w-sm text-sm text-muted-foreground">
                                                            Belum ada calon
                                                            anggota yang
                                                            mendaftar. Bagikan
                                                            link pendaftaran
                                                            untuk menerima
                                                            pendaftaran baru.
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href={pendaftaranCreate.url()}
                                                        target="_blank"
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            className="mt-2"
                                                        >
                                                            <UserPlus className="mr-2 h-4 w-4" />
                                                            Buka Form
                                                            Pendaftaran
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        pendaftaran.data.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b transition-colors last:border-b-0 hover:bg-muted/30"
                                            >
                                                <td className="p-4">
                                                    <div>
                                                        <div className="font-medium">
                                                            {item.nama_lengkap}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {item.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-mono text-sm">
                                                    {item.nim}
                                                </td>
                                                <td className="p-4 text-sm">
                                                    {item.jurusan}
                                                </td>
                                                <td className="p-4 text-sm">
                                                    {item.angkatan}
                                                </td>
                                                <td className="p-4">
                                                    {getStatusBadge(
                                                        item.status,
                                                    )}
                                                </td>
                                                <td className="p-4 text-sm text-muted-foreground">
                                                    {new Date(
                                                        item.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Link
                                                        href={pendaftaranShow.url(
                                                            item.id,
                                                        )}
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
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
                            <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan{' '}
                                    <span className="font-medium">
                                        {(pendaftaran.current_page - 1) *
                                            pendaftaran.per_page +
                                            1}
                                    </span>{' '}
                                    -{' '}
                                    <span className="font-medium">
                                        {Math.min(
                                            pendaftaran.current_page *
                                                pendaftaran.per_page,
                                            pendaftaran.total,
                                        )}
                                    </span>{' '}
                                    dari{' '}
                                    <span className="font-medium">
                                        {pendaftaran.total}
                                    </span>{' '}
                                    data
                                </p>
                                <div className="flex flex-wrap justify-center gap-1">
                                    {pendaftaran.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={
                                                link.active
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() =>
                                                link.url && router.get(link.url)
                                            }
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
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
