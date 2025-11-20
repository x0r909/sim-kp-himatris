import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index, store } from '@/routes/keuangan';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Keuangan', href: index.url() },
    { title: 'Tambah Transaksi', href: '#' },
];

export default function Create({}: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        jenis: '',
        kategori: '',
        nominal: '',
        tanggal_transaksi: new Date().toISOString().split('T')[0],
        deskripsi: '',
        bukti_file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url(), {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('bukti_file', file);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Transaksi" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div>
                    <h1 className="text-2xl font-bold">Tambah Transaksi Baru</h1>
                    <p className="text-sm text-muted-foreground">
                        Catat pemasukan atau pengeluaran organisasi
                    </p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="jenis">
                                    Jenis Transaksi{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.jenis}
                                    onValueChange={(value) =>
                                        setData('jenis', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis transaksi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="masuk">
                                            Kas Masuk
                                        </SelectItem>
                                        <SelectItem value="keluar">
                                            Kas Keluar
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.jenis} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kategori">
                                    Kategori{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="kategori"
                                    value={data.kategori}
                                    onChange={(e) =>
                                        setData('kategori', e.target.value)
                                    }
                                    placeholder="Contoh: Iuran Anggota, Konsumsi Rapat, dll"
                                />
                                <InputError message={errors.kategori} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nominal">
                                    Nominal{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        Rp
                                    </span>
                                    <Input
                                        id="nominal"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.nominal}
                                        onChange={(e) =>
                                            setData('nominal', e.target.value)
                                        }
                                        className="pl-10"
                                        placeholder="0"
                                    />
                                </div>
                                <InputError message={errors.nominal} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tanggal_transaksi">
                                    Tanggal Transaksi{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="tanggal_transaksi"
                                    type="date"
                                    value={data.tanggal_transaksi}
                                    onChange={(e) =>
                                        setData(
                                            'tanggal_transaksi',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.tanggal_transaksi} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">
                                Deskripsi{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) =>
                                    setData('deskripsi', e.target.value)
                                }
                                placeholder="Jelaskan detail transaksi"
                                rows={4}
                            />
                            <InputError message={errors.deskripsi} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bukti_file">
                                Upload Bukti (Opsional)
                            </Label>
                            <Input
                                id="bukti_file"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                            />
                            <p className="text-xs text-muted-foreground">
                                Format: PDF, JPG, PNG. Maksimal 2MB
                            </p>
                            <InputError message={errors.bukti_file} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing && (
                                    <Spinner className="mr-2 size-4" />
                                )}
                                Simpan
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                asChild
                                disabled={processing}
                            >
                                <Link href={index.url()}>Batal</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
