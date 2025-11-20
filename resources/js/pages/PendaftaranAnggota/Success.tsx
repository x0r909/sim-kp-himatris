import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function Success() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
            <Card className="max-w-lg">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Pendaftaran Berhasil!</CardTitle>
                    <CardDescription className="text-base mt-2">
                        Terima kasih telah mendaftar sebagai anggota
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-muted-foreground">
                        Data pendaftaran kamu telah kami terima dan sedang dalam proses review oleh admin.
                        Kami akan menghubungi kamu melalui email atau WhatsApp untuk informasi selanjutnya.
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm font-medium mb-2">Yang Perlu Kamu Lakukan:</p>
                        <ul className="text-sm text-muted-foreground space-y-1 text-left">
                            <li>✓ Pastikan email dan nomor HP kamu aktif</li>
                            <li>✓ Tunggu konfirmasi dari admin (1-3 hari kerja)</li>
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
