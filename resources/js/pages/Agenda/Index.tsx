import {
    create as agendaCreate,
    show as agendaShow,
} from '@/actions/App/Http/Controllers/AgendaController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import {
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    PlusIcon,
    User,
} from 'lucide-react';
import { useState } from 'react';

interface AgendaItem {
    id: number;
    judul: string;
    deskripsi: string | null;
    tanggal_mulai: string;
    tanggal_selesai: string;
    lokasi: string | null;
    jenis: 'rapat' | 'seminar' | 'workshop' | 'kegiatan' | 'lainnya';
    penanggung_jawab: {
        id: number;
        name: string;
    };
    absensi: {
        id: number;
        nama_kegiatan: string;
    } | null;
    status: 'draft' | 'published' | 'completed' | 'cancelled';
    catatan: string | null;
    creator: {
        id: number;
        name: string;
    };
}

interface IndexProps {
    agenda: AgendaItem[];
    canManage: boolean;
}

export default function Index({ agenda, canManage }: IndexProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

    const monthNames = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
    ];
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    const getJenisBadgeClass = (jenis: string) => {
        switch (jenis) {
            case 'rapat':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400';
            case 'seminar':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400';
            case 'workshop':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-950/30 dark:text-orange-400';
            case 'kegiatan':
                return 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-400';
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400';
            case 'completed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-400';
        }
    };

    const getJenisText = (jenis: string) => {
        const jenisMap: Record<string, string> = {
            rapat: 'Rapat',
            seminar: 'Seminar',
            workshop: 'Workshop',
            kegiatan: 'Kegiatan',
            lainnya: 'Lainnya',
        };
        return jenisMap[jenis] || jenis;
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            draft: 'Draft',
            published: 'Published',
            completed: 'Selesai',
            cancelled: 'Dibatalkan',
        };
        return statusMap[status] || status;
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();

        const days: (Date | null)[] = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const getAgendaForDate = (date: Date | null) => {
        if (!date) return [];

        return agenda.filter((item) => {
            const itemDate = new Date(item.tanggal_mulai);
            return (
                itemDate.getDate() === date.getDate() &&
                itemDate.getMonth() === date.getMonth() &&
                itemDate.getFullYear() === date.getFullYear()
            );
        });
    };

    const previousMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
        );
    };

    const nextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
        );
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const days = getDaysInMonth(currentDate);
    const upcomingAgenda = agenda
        .filter((item) => {
            const itemDate = new Date(item.tanggal_mulai);
            return itemDate >= new Date() && item.status === 'published';
        })
        .sort(
            (a, b) =>
                new Date(a.tanggal_mulai).getTime() -
                new Date(b.tanggal_mulai).getTime(),
        )
        .slice(0, 5);

    return (
        <AppLayout>
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <CalendarIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Agenda Himpunan
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Jadwal kegiatan dan rapat himpunan
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={
                                viewMode === 'month' ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => setViewMode('month')}
                            className="shadow-sm"
                        >
                            Kalender
                        </Button>
                        <Button
                            variant={
                                viewMode === 'list' ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className="shadow-sm"
                        >
                            List
                        </Button>
                        {canManage && (
                            <Link href={agendaCreate.url()}>
                                <Button className="shadow-sm">
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Tambah Agenda
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {viewMode === 'month' ? (
                    <div className="grid gap-4 lg:grid-cols-[1fr_350px]">
                        {/* Calendar View */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>
                                        {monthNames[currentDate.getMonth()]}{' '}
                                        {currentDate.getFullYear()}
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={previousMonth}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={nextMonth}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-7 gap-2">
                                    {dayNames.map((day) => (
                                        <div
                                            key={day}
                                            className="p-2 text-center text-sm font-medium text-muted-foreground"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                    {days.map((day, index) => {
                                        const dayAgenda = getAgendaForDate(day);
                                        const isToday =
                                            day &&
                                            day.toDateString() ===
                                                new Date().toDateString();

                                        return (
                                            <div
                                                key={index}
                                                className={`min-h-[100px] rounded-lg border p-2 ${
                                                    day
                                                        ? isToday
                                                            ? 'border-primary bg-primary/5'
                                                            : 'bg-card hover:bg-muted/50'
                                                        : 'bg-muted/20'
                                                }`}
                                            >
                                                {day && (
                                                    <>
                                                        <div
                                                            className={`mb-1 text-sm font-medium ${isToday ? 'text-primary' : ''}`}
                                                        >
                                                            {day.getDate()}
                                                        </div>
                                                        <div className="space-y-1">
                                                            {dayAgenda
                                                                .slice(0, 2)
                                                                .map((item) => (
                                                                    <Link
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        href={agendaShow.url(
                                                                            item.id,
                                                                        )}
                                                                    >
                                                                        <div
                                                                            className={`cursor-pointer truncate rounded p-1 text-xs ${getJenisBadgeClass(item.jenis)}`}
                                                                        >
                                                                            {formatTime(
                                                                                item.tanggal_mulai,
                                                                            )}{' '}
                                                                            {
                                                                                item.judul
                                                                            }
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            {dayAgenda.length >
                                                                2 && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    +
                                                                    {dayAgenda.length -
                                                                        2}{' '}
                                                                    lagi
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Upcoming Events */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Agenda Mendatang</CardTitle>
                                <CardDescription>
                                    Kegiatan yang akan berlangsung
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {upcomingAgenda.length > 0 ? (
                                    <div className="space-y-4">
                                        {upcomingAgenda.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={agendaShow.url(item.id)}
                                            >
                                                <div className="cursor-pointer rounded-lg border p-3 hover:bg-muted/50">
                                                    <div className="mb-2 flex items-start justify-between gap-2">
                                                        <h4 className="line-clamp-2 text-sm font-medium">
                                                            {item.judul}
                                                        </h4>
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-xs whitespace-nowrap ${getJenisBadgeClass(item.jenis)}`}
                                                        >
                                                            {getJenisText(
                                                                item.jenis,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {formatDateTime(
                                                                item.tanggal_mulai,
                                                            )}
                                                        </div>
                                                        {item.lokasi && (
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {item.lokasi}
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1">
                                                            <User className="h-3 w-3" />
                                                            {
                                                                item
                                                                    .penanggung_jawab
                                                                    .name
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <CalendarIcon className="mb-2 h-12 w-12 text-muted-foreground/40" />
                                        <p className="text-sm text-muted-foreground">
                                            Tidak ada agenda mendatang
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    /* List View */
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Semua Agenda</CardTitle>
                            <CardDescription>
                                Daftar lengkap agenda himpunan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {agenda.length > 0 ? (
                                <div className="space-y-3">
                                    {agenda.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={agendaShow.url(item.id)}
                                        >
                                            <div className="cursor-pointer rounded-lg border p-4 hover:bg-muted/50">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <h3 className="text-base font-semibold">
                                                                {item.judul}
                                                            </h3>
                                                            <span
                                                                className={`rounded-full px-2 py-0.5 text-xs ${getJenisBadgeClass(item.jenis)}`}
                                                            >
                                                                {getJenisText(
                                                                    item.jenis,
                                                                )}
                                                            </span>
                                                            <span
                                                                className={`rounded-full px-2 py-0.5 text-xs ${getStatusBadgeClass(item.status)}`}
                                                            >
                                                                {getStatusText(
                                                                    item.status,
                                                                )}
                                                            </span>
                                                        </div>
                                                        {item.deskripsi && (
                                                            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                                                {item.deskripsi}
                                                            </p>
                                                        )}
                                                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {formatDateTime(
                                                                    item.tanggal_mulai,
                                                                )}
                                                            </div>
                                                            {item.lokasi && (
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="h-3 w-3" />
                                                                    {
                                                                        item.lokasi
                                                                    }
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-1">
                                                                <User className="h-3 w-3" />
                                                                PJ:{' '}
                                                                {
                                                                    item
                                                                        .penanggung_jawab
                                                                        .name
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <CalendarIcon className="mb-2 h-12 w-12 text-muted-foreground/40" />
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada agenda
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
