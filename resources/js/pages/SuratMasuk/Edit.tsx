import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index, update } from '@/routes/surat-masuk';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface SuratMasuk {
    id: number;
    nomor_surat: string;
    pengirim: string;
    tanggal_masuk: string;
    perihal: string;
    file_surat: string;
    keterangan: string | null;
}

interface EditProps extends PageProps {
    suratMasuk: SuratMasuk;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Surat Masuk', href: index.url() },
    { title: 'Edit Surat Masuk', href: '#' },
];

export default function Edit({ suratMasuk }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        nomor_surat: suratMasuk.nomor_surat,
        pengirim: suratMasuk.pengirim,
        tanggal_masuk: suratMasuk.tanggal_masuk,
        perihal: suratMasuk.perihal,
        file_surat: null as File | null,
        keterangan: suratMasuk.keterangan || '',
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(update.url(suratMasuk.id), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Surat Masuk" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Edit Surat Masuk</h1>
                    <p className="text-sm text-muted-foreground">
                        Perbarui informasi surat masuk
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-lg border bg-card p-6"
                >
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="nomor_surat">
                                Nomor Surat <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="nomor_surat"
                                type="text"
                                value={data.nomor_surat}
                                onChange={(e) =>
                                    setData('nomor_surat', e.target.value)
                                }
                                placeholder="Contoh: 001/SM/I/2024"
                            />
                            <InputError message={errors.nomor_surat} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pengirim">
                                Pengirim <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="pengirim"
                                type="text"
                                value={data.pengirim}
                                onChange={(e) =>
                                    setData('pengirim', e.target.value)
                                }
                                placeholder="Nama pengirim surat"
                            />
                            <InputError message={errors.pengirim} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tanggal_masuk">
                                Tanggal Masuk <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="tanggal_masuk"
                                type="date"
                                value={data.tanggal_masuk}
                                onChange={(e) =>
                                    setData('tanggal_masuk', e.target.value)
                                }
                            />
                            <InputError message={errors.tanggal_masuk} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="file_surat">
                                File Surat Baru (opsional)
                            </Label>
                            <Input
                                id="file_surat"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) =>
                                    setData('file_surat', e.target.files?.[0] || null)
                                }
                            />
                            <InputError message={errors.file_surat} />
                            <p className="text-xs text-muted-foreground">
                                File saat ini: {suratMasuk.file_surat.split('/').pop()} | Maksimal 5MB
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="perihal">
                            Perihal <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="perihal"
                            type="text"
                            value={data.perihal}
                            onChange={(e) =>
                                setData('perihal', e.target.value)
                            }
                            placeholder="Perihal surat"
                        />
                        <InputError message={errors.perihal} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="keterangan">Keterangan</Label>
                        <Textarea
                            id="keterangan"
                            value={data.keterangan}
                            onChange={(e) =>
                                setData('keterangan', e.target.value)
                            }
                            placeholder="Keterangan tambahan atau ringkasan isi surat"
                            rows={4}
                        />
                        <InputError message={errors.keterangan} />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href={index.url()}>Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && (
                                <Spinner className="mr-2 size-4" />
                            )}
                            Perbarui
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
