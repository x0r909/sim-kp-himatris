<?php

namespace App\Http\Controllers;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PersuratanController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('viewAny', SuratMasuk::class);

        // Get summary statistics
        $summary = [
            'total_surat_masuk' => SuratMasuk::count(),
            'total_surat_keluar' => SuratKeluar::count(),
            'surat_masuk_bulan_ini' => SuratMasuk::whereMonth('tanggal_masuk', now()->month)
                ->whereYear('tanggal_masuk', now()->year)
                ->count(),
            'surat_keluar_bulan_ini' => SuratKeluar::whereMonth('tanggal_keluar', now()->month)
                ->whereYear('tanggal_keluar', now()->year)
                ->count(),
        ];

        // Get recent surat masuk (5 latest)
        $recentSuratMasuk = SuratMasuk::select(['id', 'nomor_surat', 'pengirim', 'tanggal_masuk', 'perihal'])
            ->latest('tanggal_masuk')
            ->limit(5)
            ->get();

        // Get recent surat keluar (5 latest)
        $recentSuratKeluar = SuratKeluar::select(['id', 'nomor_surat', 'tujuan', 'tanggal_keluar', 'perihal'])
            ->latest('tanggal_keluar')
            ->limit(5)
            ->get();

        return Inertia::render('Persuratan/Index', [
            'summary' => $summary,
            'recent_surat_masuk' => $recentSuratMasuk,
            'recent_surat_keluar' => $recentSuratKeluar,
        ]);
    }
}
