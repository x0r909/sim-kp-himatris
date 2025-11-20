import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import { ClipboardCheckIcon } from 'lucide-react';
import { index as auditIndex, store as auditStore } from '@/actions/App/Http/Controllers/AuditKeuanganController';

interface KeuanganOption {
    id: number;
    label: string;
}

interface CreateProps {
    keuanganList: KeuanganOption[];
}

export default function Create({ keuanganList }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        keuangan_id: '',
        status_audit: '',
        tanggal_audit: new Date().toISOString().split('T')[0],
        catatan: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(auditStore.url());
    };

    return (
        <AppLayout title="Tambah Audit Keuangan">
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <ClipboardCheckIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tambah Audit Keuangan</h1>
                        <p className="text-sm text-muted-foreground">
                            Buat audit baru untuk transaksi keuangan
                        </p>
                    </div>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Form Audit</CardTitle>
                        <CardDescription>Lengkapi informasi audit transaksi</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="keuangan_id">Transaksi</Label>
                                <Select
                                    value={data.keuangan_id}
                                    onValueChange={(value) => setData('keuangan_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih transaksi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {keuanganList.map((keuangan) => (
                                            <SelectItem key={keuangan.id} value={keuangan.id.toString()}>
                                                {keuangan.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.keuangan_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status_audit">Status Audit</Label>
                                <Select
                                    value={data.status_audit}
                                    onValueChange={(value) => setData('status_audit', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status audit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="approved">Disetujui</SelectItem>
                                        <SelectItem value="rejected">Ditolak</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status_audit} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tanggal_audit">Tanggal Audit</Label>
                                <Input
                                    id="tanggal_audit"
                                    type="date"
                                    value={data.tanggal_audit}
                                    onChange={(e) => setData('tanggal_audit', e.target.value)}
                                    required
                                />
                                <InputError message={errors.tanggal_audit} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="catatan">Catatan Audit</Label>
                                <Textarea
                                    id="catatan"
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    placeholder="Tulis catatan hasil audit..."
                                    rows={5}
                                    required
                                />
                                <InputError message={errors.catatan} />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Link href={auditIndex.url()}>
                                    <Button type="button" variant="outline" className="shadow-sm">
                                        Batal
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="shadow-sm">
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
