import { store as pendaftaranStore } from '@/actions/App/Http/Controllers/PendaftaranAnggotaController';
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
import { useForm } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: '',
        nim: '',
        email: '',
        no_hp: '',
        jenis_kelamin: '',
        jurusan: '',
        angkatan: '',
        alamat: '',
        alasan_bergabung: '',
        foto: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(pendaftaranStore.url());
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-12">
                <div className="mx-auto max-w-3xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-4xl font-bold">
                            Pendaftaran Anggota Baru
                        </h1>
                        <p className="text-muted-foreground">
                            Bergabunglah dengan kami dan kembangkan potensimu!
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5" />
                                Form Pendaftaran
                            </CardTitle>
                            <CardDescription>
                                Isi formulir di bawah ini dengan lengkap dan
                                benar. Data kamu akan direview oleh admin.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {/* Data Diri */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        Data Diri
                                    </h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="nama_lengkap">
                                            Nama Lengkap *
                                        </Label>
                                        <Input
                                            id="nama_lengkap"
                                            value={data.nama_lengkap}
                                            onChange={(e) =>
                                                setData(
                                                    'nama_lengkap',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Masukkan nama lengkap"
                                        />
                                        <InputError
                                            message={errors.nama_lengkap}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="nim">NIM *</Label>
                                            <Input
                                                id="nim"
                                                value={data.nim}
                                                onChange={(e) =>
                                                    setData(
                                                        'nim',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Masukkan NIM"
                                            />
                                            <InputError message={errors.nim} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="jenis_kelamin">
                                                Jenis Kelamin *
                                            </Label>
                                            <Select
                                                value={
                                                    data.jenis_kelamin ||
                                                    undefined
                                                }
                                                onValueChange={(value) =>
                                                    setData(
                                                        'jenis_kelamin',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Laki-laki">
                                                        Laki-laki
                                                    </SelectItem>
                                                    <SelectItem value="Perempuan">
                                                        Perempuan
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.jenis_kelamin}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Email *
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="email@example.com"
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="no_hp">
                                                No. HP *
                                            </Label>
                                            <Input
                                                id="no_hp"
                                                value={data.no_hp}
                                                onChange={(e) =>
                                                    setData(
                                                        'no_hp',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="08xxxxxxxxxx"
                                            />
                                            <InputError
                                                message={errors.no_hp}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Data Akademik */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        Data Akademik
                                    </h3>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="jurusan">
                                                Jurusan *
                                            </Label>
                                            <Input
                                                id="jurusan"
                                                value={data.jurusan}
                                                onChange={(e) =>
                                                    setData(
                                                        'jurusan',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Masukkan jurusan"
                                            />
                                            <InputError
                                                message={errors.jurusan}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="angkatan">
                                                Angkatan *
                                            </Label>
                                            <Input
                                                id="angkatan"
                                                value={data.angkatan}
                                                onChange={(e) =>
                                                    setData(
                                                        'angkatan',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="2024"
                                                maxLength={4}
                                            />
                                            <InputError
                                                message={errors.angkatan}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="alamat">Alamat</Label>
                                        <Textarea
                                            id="alamat"
                                            value={data.alamat}
                                            onChange={(e) =>
                                                setData(
                                                    'alamat',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Masukkan alamat lengkap"
                                            rows={3}
                                        />
                                        <InputError message={errors.alamat} />
                                    </div>
                                </div>

                                {/* Lainnya */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        Lainnya
                                    </h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="alasan_bergabung">
                                            Alasan Bergabung
                                        </Label>
                                        <Textarea
                                            id="alasan_bergabung"
                                            value={data.alasan_bergabung}
                                            onChange={(e) =>
                                                setData(
                                                    'alasan_bergabung',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ceritakan alasan kamu ingin bergabung..."
                                            rows={4}
                                        />
                                        <InputError
                                            message={errors.alasan_bergabung}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="foto">
                                            Foto (Opsional)
                                        </Label>
                                        <Input
                                            id="foto"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png"
                                            onChange={(e) =>
                                                setData(
                                                    'foto',
                                                    e.target.files?.[0] || null,
                                                )
                                            }
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Format: JPG, JPEG, PNG. Maksimal 2MB
                                        </p>
                                        <InputError message={errors.foto} />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1"
                                    >
                                        {processing
                                            ? 'Mengirim...'
                                            : 'Daftar Sekarang'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        * Wajib diisi
                    </p>
                </div>
            </div>
        </div>
    );
}
