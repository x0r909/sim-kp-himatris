import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as absensiIndex } from '@/routes/absensi';
import { index as agendaIndex } from '@/routes/agenda';
import { index as anggotaIndex } from '@/routes/anggota';
import { index as auditKeuanganIndex } from '@/routes/audit-keuangan';
import { index as kegiatanIndex } from '@/routes/kegiatan';
import { index as keuanganIndex } from '@/routes/keuangan';
import { index as pendaftaranAnggotaIndex } from '@/routes/pendaftaran-anggota';
import { index as suratKeluarIndex } from '@/routes/surat-keluar';
import { index as suratMasukIndex } from '@/routes/surat-masuk';
import { index as usersIndex } from '@/routes/users';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    CalendarCheck,
    FileText,
    LayoutGrid,
    UserCircle,
    UserPlus,
    Users,
    Wallet,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
            icon: LayoutGrid,
        },
    ];

    // Add Anggota menu for admin, ketua, wakil ketua, and sekretaris umum
    if (
        user &&
        (user.role === 'admin' ||
            user.role === 'ketua' ||
            user.role === 'wakil_ketua' ||
            user.role === 'sekretaris_umum')
    ) {
        mainNavItems.push({
            title: 'Anggota',
            icon: UserCircle,
            items: [
                {
                    title: 'Data Anggota',
                    href: anggotaIndex().url,
                },
                {
                    title: 'Pendaftaran',
                    href: pendaftaranAnggotaIndex().url,
                    icon: UserPlus,
                },
            ],
        });
    }

    // Add Persuratan menu for admin, BPH inti, and all sekretaris
    if (
        user &&
        (user.role === 'admin' ||
            user.role === 'ketua' ||
            user.role === 'wakil_ketua' ||
            user.role === 'sekretaris_umum' ||
            user.role === 'sekretaris_1' ||
            user.role === 'sekretaris_2')
    ) {
        mainNavItems.push({
            title: 'Persuratan',
            icon: FileText,
            items: [
                {
                    title: 'Surat Masuk',
                    href: suratMasukIndex().url,
                },
                {
                    title: 'Surat Keluar',
                    href: suratKeluarIndex().url,
                },
            ],
        });
    }

    // Add Absensi menu for admin, BPH inti, and all sekretaris
    if (
        user &&
        (user.role === 'admin' ||
            user.role === 'ketua' ||
            user.role === 'wakil_ketua' ||
            user.role === 'sekretaris_umum' ||
            user.role === 'sekretaris_1' ||
            user.role === 'sekretaris_2')
    ) {
        mainNavItems.push({
            title: 'Absensi',
            icon: CalendarCheck,
            items: [
                {
                    title: 'Kegiatan',
                    href: kegiatanIndex().url,
                },
                {
                    title: 'Data Absensi',
                    href: absensiIndex().url,
                },
            ],
        });

        // Add Agenda/Kalender menu
        mainNavItems.push({
            title: 'Agenda',
            href: agendaIndex().url,
            icon: Calendar,
        });
    }

    // Add Keuangan menu for admin, BPH inti, and all bendahara
    if (
        user &&
        (user.role === 'admin' ||
            user.role === 'ketua' ||
            user.role === 'wakil_ketua' ||
            user.role === 'sekretaris_umum' ||
            user.role === 'bendahara_1' ||
            user.role === 'bendahara_2')
    ) {
        mainNavItems.push({
            title: 'Keuangan',
            icon: Wallet,
            items: [
                {
                    title: 'Transaksi',
                    href: keuanganIndex().url,
                },
                {
                    title: 'Analisis',
                    href: '/analisis-keuangan',
                },
                {
                    title: 'Audit',
                    href: auditKeuanganIndex().url,
                },
            ],
        });
    }

    // Add Users menu only for admin
    if (user && user.role === 'admin') {
        mainNavItems.push({
            title: 'Manajemen User',
            href: usersIndex().url,
            icon: Users,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
