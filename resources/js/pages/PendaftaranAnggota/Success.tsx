import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function Success() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Card className="max-w-lg">
                <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">
                        Pendaftaran Berhasil!
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">
                        Terima kasih telah mendaftar sebagai anggota
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-muted-foreground">
                        Data pendaftaran kamu telah kami terima dan sedang dalam
                        proses review oleh admin. Kami akan menghubungi kamu
                        melalui email atau WhatsApp untuk informasi selanjutnya.
                    </p>
                    <div className="rounded-lg bg-muted p-4">
                        <p className="mb-2 text-sm font-medium">
                            Yang Perlu Kamu Lakukan:
                        </p>
                        <ul className="space-y-1 text-left text-sm text-muted-foreground">
                            <li>✓ Pastikan email dan nomor HP kamu aktif</li>
                            <li>
                                ✓ Tunggu konfirmasi dari admin (1-3 hari kerja)
                            </li>
                            <li>✓ Cek email kamu secara berkala</li>
                        </ul>
                    </div>
                    <Button asChild className="w-full">
                        <a href="/">Kembali ke Beranda</a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
