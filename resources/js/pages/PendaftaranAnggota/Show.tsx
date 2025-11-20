import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, User, Mail, Phone, Calendar, MapPin, FileText, Clock } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { index as pendaftaranIndex } from '@/actions/App/Http/Controllers/PendaftaranAnggotaController';

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
    jenis_kelamin: string;
    jurusan: string;
    angkatan: string;
    alamat: string | null;
    alasan_bergabung: string | null;
    foto: string | null;
    status: 'pending' | 'approved' | 'rejected';
    catatan_penolakan: string | null;
    reviewer: Reviewer | null;
    reviewed_at: string | null;
    created_at: string;
}

interface ShowProps {
    pendaftaran: PendaftaranItem;
    canManage: boolean;
}

export default function Show({ pendaftaran, canManage }: ShowProps) {
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    
    const { data, setData, post, processing, reset } = useForm({
        catatan_penolakan: '',
    });

    const handleApprove = () => {
        if (confirm('Apakah Anda yakin ingin menyetujui pendaftaran ini?')) {
            router.post(`/pendaftaran-anggota/${pendaftaran.id}/approve`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleReject = () => {
        post(`/pendaftaran-anggota/${pendaftaran.id}/reject`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectDialog(false);
                reset();
            },
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case 'approved':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Disetujui</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Ditolak</Badge>;
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <Link href={pendaftaranIndex.url()}>
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Kembali
                                </Button>
                            </Link>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Detail Pendaftaran</h1>
                        <p className="text-muted-foreground mt-1">Informasi lengkap calon anggota</p>
                    </div>
                    <div>
                        {getStatusBadge(pendaftaran.status)}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Diri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                                            <p className="font-medium">{pendaftaran.nama_lengkap}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">NIM</p>
                                            <p className="font-medium">{pendaftaran.nim}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="font-medium">{pendaftaran.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">No. HP</p>
                                            <p className="font-medium">{pendaftaran.no_hp}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                                            <p className="font-medium">{pendaftaran.jenis_kelamin}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Tanggal Daftar</p>
                                            <p className="font-medium">
                                                {new Date(pendaftaran.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {pendaftaran.alamat && (
                                    <div className="flex items-start gap-3 border-t pt-4">
                                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground mb-1">Alamat</p>
                                            <p className="font-medium">{pendaftaran.alamat}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Data Akademik</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Jurusan</p>
                                        <p className="font-medium">{pendaftaran.jurusan}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Angkatan</p>
                                        <p className="font-medium">{pendaftaran.angkatan}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {pendaftaran.alasan_bergabung && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Alasan Bergabung</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-wrap">
                                        {pendaftaran.alasan_bergabung}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {pendaftaran.status === 'rejected' && pendaftaran.catatan_penolakan && (
                            <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
                                <CardHeader>
                                    <CardTitle className="text-red-700 dark:text-red-400">Alasan Penolakan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-wrap">
                                        {pendaftaran.catatan_penolakan}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {pendaftaran.foto && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Foto</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <img
                                        src={`/storage/${pendaftaran.foto}`}
                                        alt={pendaftaran.nama_lengkap}
                                        className="w-full rounded-lg"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {pendaftaran.reviewed_at && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Review</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Direview oleh</p>
                                        <p className="font-medium">{pendaftaran.reviewer?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Tanggal Review</p>
                                        <p className="font-medium">
                                            {new Date(pendaftaran.reviewed_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {canManage && pendaftaran.status === 'pending' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Aksi</CardTitle>
                                    <CardDescription>
                                        Review pendaftaran anggota baru
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button
                                        className="w-full"
                                        variant="default"
                                        onClick={handleApprove}
                                        disabled={processing}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Setujui Pendaftaran
                                    </Button>
                                    <Button
                                        className="w-full"
                                        variant="destructive"
                                        onClick={() => setShowRejectDialog(true)}
                                        disabled={processing}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Tolak Pendaftaran
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Pendaftaran</DialogTitle>
                        <DialogDescription>
                            Berikan alasan penolakan yang jelas kepada calon anggota
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="catatan_penolakan">Alasan Penolakan *</Label>
                            <Textarea
                                id="catatan_penolakan"
                                value={data.catatan_penolakan}
                                onChange={(e) => setData('catatan_penolakan', e.target.value)}
                                placeholder="Jelaskan alasan penolakan..."
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={processing || !data.catatan_penolakan}
                        >
                            {processing ? 'Memproses...' : 'Tolak Pendaftaran'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
