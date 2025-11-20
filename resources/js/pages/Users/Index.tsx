import { Button } from '@/components/ui/button';
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
import { create, destroy, edit } from '@/routes/users';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    foto: string | null;
    created_at: string;
}

interface UsersIndexProps extends PageProps {
    users: {
        data: User[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Manajemen User', href: '#' },
];

export default function Index({ users }: UsersIndexProps) {
    const handleDelete = (user: User) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ${user.name}?`)) {
            router.delete(destroy.url(user.id));
        }
    };

    const getRoleBadgeClass = (role: string) => {
        const classes = {
            admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            bendahara:
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            anggota:
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        };
        return classes[role as keyof typeof classes] || '';
    };

    const getStatusBadgeClass = (status: string) => {
        return status === 'aktif'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen User" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen User</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data pengguna sistem
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <PlusIcon className="mr-2 size-4" />
                            Tambah User
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Bergabung</TableHead>
                                <TableHead className="text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center"
                                    >
                                        Tidak ada data user
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                {user.foto ? (
                                                    <img
                                                        src={`/storage/${user.foto}`}
                                                        alt={user.name}
                                                        className="size-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                )}
                                                <span>{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getRoleBadgeClass(user.role)}`}
                                            >
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(user.status)}`}
                                            >
                                                {user.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit.url(user.id)}
                                                    >
                                                        <PencilIcon className="size-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleDelete(user)
                                                    }
                                                >
                                                    <TrashIcon className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
