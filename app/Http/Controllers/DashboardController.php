<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Agenda;
use App\Models\Anggota;
use App\Models\AuditKeuangan;
use App\Models\Kegiatan;
use App\Models\Keuangan;
use App\Models\PendaftaranAnggota;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Stats yang bisa dilihat semua role
        $stats = [
            // Anggota
            'total_anggota' => Anggota::count(),
            'anggota_aktif' => Anggota::where('status', 'aktif')->count(),
            
            // Pendaftaran (hanya untuk admin, ketua, wakil, sekum)
            'pendaftaran_pending' => 0,
            
            // Persuratan
            'surat_masuk_bulan_ini' => SuratMasuk::whereMonth('tanggal_masuk', now()->month)
                ->whereYear('tanggal_masuk', now()->year)
                ->count(),
            'surat_keluar_bulan_ini' => SuratKeluar::whereMonth('tanggal_keluar', now()->month)
                ->whereYear('tanggal_keluar', now()->year)
                ->count(),
            
            // Kegiatan & Agenda
            'kegiatan_aktif' => Kegiatan::where('tanggal_selesai', '>=', now()->toDateString())->count(),
            'agenda_bulan_ini' => Agenda::whereMonth('tanggal_mulai', now()->month)
                ->whereYear('tanggal_mulai', now()->year)
                ->count(),
            
            // Keuangan
            'total_pemasukan' => 0,
            'total_pengeluaran' => 0,
            'saldo' => 0,
            
            // Audit
            'audit_tertunda' => 0,
        ];

        // Data pendaftaran untuk admin, ketua, wakil, sekum
        if (in_array($user->role, ['admin', 'ketua', 'wakil_ketua', 'sekretaris_umum'])) {
            $stats['pendaftaran_pending'] = PendaftaranAnggota::where('status', 'pending')->count();
        }

        // Data keuangan untuk admin, BPH inti, bendahara
        if (in_array($user->role, ['admin', 'ketua', 'wakil_ketua', 'sekretaris_umum', 'bendahara_1', 'bendahara_2'])) {
            $stats['total_pemasukan'] = Keuangan::where('jenis', 'pemasukan')->sum('nominal');
            $stats['total_pengeluaran'] = Keuangan::where('jenis', 'pengeluaran')->sum('nominal');
            $stats['saldo'] = $stats['total_pemasukan'] - $stats['total_pengeluaran'];
            $stats['audit_tertunda'] = AuditKeuangan::where('status_audit', 'pending')->count();
        }

        // Data aktivitas terbaru
        $recent_activities = [];

        // Surat masuk terbaru (untuk yang punya akses persuratan)
        if (in_array($user->role, ['admin', 'ketua', 'wakil_ketua', 'sekretaris_umum', 'sekretaris_1', 'sekretaris_2'])) {
            $recent_surat_masuk = SuratMasuk::latest('tanggal_masuk')
                ->limit(5)
                ->get(['id', 'nomor_surat', 'perihal', 'tanggal_masuk']);
            
            foreach ($recent_surat_masuk as $surat) {
                $recent_activities[] = [
                    'type' => 'surat_masuk',
                    'title' => 'Surat Masuk: ' . $surat->perihal,
                    'description' => 'No: ' . $surat->nomor_surat,
                    'date' => $surat->tanggal_masuk,
                ];
            }
        }

        // Kegiatan terbaru
        if (in_array($user->role, ['admin', 'ketua', 'wakil_ketua', 'sekretaris_umum', 'sekretaris_1', 'sekretaris_2'])) {
            $recent_kegiatan = Kegiatan::latest('created_at')
                ->limit(5)
                ->get(['id', 'nama_kegiatan', 'tanggal_mulai', 'tanggal_selesai']);
            
            foreach ($recent_kegiatan as $kegiatan) {
                $status = now()->toDateString() <= $kegiatan->tanggal_selesai ? 'Berlangsung' : 'Selesai';
                $recent_activities[] = [
                    'type' => 'kegiatan',
                    'title' => 'Kegiatan: ' . $kegiatan->nama_kegiatan,
                    'description' => 'Status: ' . $status,
                    'date' => $kegiatan->tanggal_mulai,
                ];
            }
        }

        // Sort activities by date
        usort($recent_activities, function ($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        $recent_activities = array_slice($recent_activities, 0, 10);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recent_activities' => $recent_activities,
            'user_role' => $user->role,
        ]);
    }
}
