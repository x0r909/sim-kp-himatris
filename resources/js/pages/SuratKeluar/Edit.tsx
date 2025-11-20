import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index, update } from '@/routes/surat-keluar';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface SuratKeluar {
    id: number;
    nomor_surat: string;
    tujuan: string;
    tanggal_keluar: string;
    perihal: string;
    file_surat: string;
    tanda_tangan: string;
}

interface EditProps extends PageProps {
    suratKeluar: SuratKeluar;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Surat Keluar', href: index.url() },
    { title: 'Edit Surat Keluar', href: '#' },
];

export default function Edit({ suratKeluar }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        nomor_surat: suratKeluar.nomor_surat,
        tujuan: suratKeluar.tujuan,
        tanggal_keluar: suratKeluar.tanggal_keluar,
        perihal: suratKeluar.perihal,
        file_surat: null as File | null,
        tanda_tangan: suratKeluar.tanda_tangan,
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(update.url(suratKeluar.id), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Surat Keluar" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Edit Surat Keluar</h1>
                    <p className="text-sm text-muted-foreground">
                        Perbarui informasi surat keluar
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
                                placeholder="Contoh: 001/SK/I/2024"
                            />
                            <InputError message={errors.nomor_surat} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tujuan">
                                Tujuan <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="tujuan"
                                type="text"
                                value={data.tujuan}
                                onChange={(e) =>
                                    setData('tujuan', e.target.value)
                                }
                                placeholder="Tujuan surat"
                            />
                            <InputError message={errors.tujuan} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tanggal_keluar">
                                Tanggal Keluar <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="tanggal_keluar"
                                type="date"
                                value={data.tanggal_keluar}
                                onChange={(e) =>
                                    setData('tanggal_keluar', e.target.value)
                                }
                            />
                            <InputError message={errors.tanggal_keluar} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tanda_tangan">
                                Tanda Tangan <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="tanda_tangan"
                                type="text"
                                value={data.tanda_tangan}
                                onChange={(e) =>
                                    setData('tanda_tangan', e.target.value)
                                }
                                placeholder="Nama penandatangan"
                            />
                            <InputError message={errors.tanda_tangan} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="file_surat">
                                File Surat Baru (opsional)
                            </Label>
                            <Input
                                id="file_surat"
                                type="file"
                                accept=".pdf"
                                onChange={(e) =>
                                    setData('file_surat', e.target.files?.[0] || null)
                                }
                            />
                            <InputError message={errors.file_surat} />
                            <p className="text-xs text-muted-foreground">
                                File saat ini: {suratKeluar.file_surat.split('/').pop()} | Maksimal 5MB
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
