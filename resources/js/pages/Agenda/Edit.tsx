import {
    index as agendaIndex,
    update as agendaUpdate,
} from '@/actions/App/Http/Controllers/AgendaController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Link, useForm } from '@inertiajs/react';
import { CalendarIcon } from 'lucide-react';
import { FormEventHandler } from 'react';

interface User {
    id: number;
    name: string;
    role: string;
}

interface Kegiatan {
    id: number;
    nama_kegiatan: string;
    tanggal_mulai: string;
}

interface Agenda {
    id: number;
    judul: string;
    deskripsi: string | null;
    tanggal_mulai: string;
    tanggal_selesai: string;
    lokasi: string | null;
    jenis: string;
    penanggung_jawab_id: number;
    kegiatan_id: number | null;
    status: string;
    catatan: string | null;
}

interface EditProps {
    agenda: Agenda;
    users: User[];
    kegiatanList: Kegiatan[];
}

export default function Edit({ agenda, users, kegiatanList }: EditProps) {
    // Format datetime for input
    const formatDateTimeForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    const { data, setData, put, processing, errors } = useForm({
        judul: agenda.judul || '',
        deskripsi: agenda.deskripsi || '',
        tanggal_mulai: formatDateTimeForInput(agenda.tanggal_mulai),
        tanggal_selesai: formatDateTimeForInput(agenda.tanggal_selesai),
        lokasi: agenda.lokasi || '',
        jenis: agenda.jenis || '',
        penanggung_jawab_id: agenda.penanggung_jawab_id.toString(),
        kegiatan_id: agenda.kegiatan_id?.toString() || '',
        status: agenda.status || 'published',
        catatan: agenda.catatan || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(agendaUpdate.url(agenda.id));
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <CalendarIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Agenda
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Perbarui informasi agenda
                        </p>
                    </div>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Form Agenda</CardTitle>
                        <CardDescription>
                            Lengkapi informasi agenda kegiatan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="judul">Judul Agenda *</Label>
                                <Input
                                    id="judul"
                                    value={data.judul}
                                    onChange={(e) =>
                                        setData('judul', e.target.value)
                                    }
                                    placeholder="Masukkan judul agenda"
                                    required
                                />
                                <InputError message={errors.judul} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <Textarea
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e) =>
                                        setData('deskripsi', e.target.value)
                                    }
                                    placeholder="Tulis deskripsi agenda..."
                                    rows={4}
                                />
                                <InputError message={errors.deskripsi} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_mulai">
                                        Tanggal & Waktu Mulai *
                                    </Label>
                                    <Input
                                        id="tanggal_mulai"
                                        type="datetime-local"
                                        value={data.tanggal_mulai}
                                        onChange={(e) =>
                                            setData(
                                                'tanggal_mulai',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.tanggal_mulai}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_selesai">
                                        Tanggal & Waktu Selesai *
                                    </Label>
                                    <Input
                                        id="tanggal_selesai"
                                        type="datetime-local"
                                        value={data.tanggal_selesai}
                                        onChange={(e) =>
                                            setData(
                                                'tanggal_selesai',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.tanggal_selesai}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lokasi">Lokasi</Label>
                                <Input
                                    id="lokasi"
                                    value={data.lokasi}
                                    onChange={(e) =>
                                        setData('lokasi', e.target.value)
                                    }
                                    placeholder="Contoh: Ruang Seminar Gedung A"
                                />
                                <InputError message={errors.lokasi} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="jenis">
                                        Jenis Kegiatan *
                                    </Label>
                                    <Select
                                        value={data.jenis}
                                        onValueChange={(value) =>
                                            setData('jenis', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis kegiatan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="rapat">
                                                Rapat
                                            </SelectItem>
                                            <SelectItem value="seminar">
                                                Seminar
                                            </SelectItem>
                                            <SelectItem value="workshop">
                                                Workshop
                                            </SelectItem>
                                            <SelectItem value="kegiatan">
                                                Kegiatan
                                            </SelectItem>
                                            <SelectItem value="lainnya">
                                                Lainnya
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.jenis} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData('status', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">
                                                Draft
                                            </SelectItem>
                                            <SelectItem value="published">
                                                Published
                                            </SelectItem>
                                            <SelectItem value="completed">
                                                Selesai
                                            </SelectItem>
                                            <SelectItem value="cancelled">
                                                Dibatalkan
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="penanggung_jawab_id">
                                    Penanggung Jawab *
                                </Label>
                                <Select
                                    value={data.penanggung_jawab_id}
                                    onValueChange={(value) =>
                                        setData('penanggung_jawab_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih penanggung jawab" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={user.id.toString()}
                                            >
                                                {user.name} ({user.role})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.penanggung_jawab_id}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kegiatan_id">
                                    Hubungkan dengan Kegiatan (Opsional)
                                </Label>
                                <Select
                                    value={data.kegiatan_id || undefined}
                                    onValueChange={(value) =>
                                        setData('kegiatan_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kegiatan terkait (opsional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kegiatanList.map((kegiatan) => (
                                            <SelectItem
                                                key={kegiatan.id}
                                                value={kegiatan.id.toString()}
                                            >
                                                {kegiatan.nama_kegiatan} -{' '}
                                                {kegiatan.tanggal_mulai}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.kegiatan_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="catatan">
                                    Catatan Tambahan
                                </Label>
                                <Textarea
                                    id="catatan"
                                    value={data.catatan}
                                    onChange={(e) =>
                                        setData('catatan', e.target.value)
                                    }
                                    placeholder="Catatan atau informasi tambahan..."
                                    rows={3}
                                />
                                <InputError message={errors.catatan} />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Link href={agendaIndex.url()}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="shadow-sm"
                                    >
                                        Batal
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="shadow-sm"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
