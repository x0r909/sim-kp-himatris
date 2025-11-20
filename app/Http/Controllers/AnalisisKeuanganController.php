<?php

namespace App\Http\Controllers;

use App\Models\Keuangan;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalisisKeuanganController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Keuangan::class);

        $year = $request->input('year', now()->year);
        $month = $request->input('month');

        // Calculate saldo (balance) and total transactions
        $totalMasuk = Keuangan::where('jenis', 'masuk')->sum('nominal');
        $totalKeluar = Keuangan::where('jenis', 'keluar')->sum('nominal');
        $saldoAkhir = $totalMasuk - $totalKeluar;
        $totalTransaksi = Keuangan::count();

        // Monthly data for chart
        $monthlyData = Keuangan::selectRaw('
                MONTH(tanggal_transaksi) as month,
                jenis,
                SUM(nominal) as total
            ')
            ->whereYear('tanggal_transaksi', $year)
            ->groupBy('month', 'jenis')
            ->orderBy('month')
            ->get()
            ->groupBy('month')
            ->map(function ($items) {
                $masuk = $items->where('jenis', 'masuk')->first()->total ?? 0;
                $keluar = $items->where('jenis', 'keluar')->first()->total ?? 0;

                return [
                    'masuk' => $masuk,
                    'keluar' => $keluar,
                ];
            });

        // Fill missing months with 0
        $chartData = collect(range(1, 12))->map(function ($month) use ($monthlyData) {
            return [
                'month' => $month,
                'masuk' => $monthlyData->get($month)['masuk'] ?? 0,
                'keluar' => $monthlyData->get($month)['keluar'] ?? 0,
            ];
        });

        // Category breakdown
        $categoryBreakdown = Keuangan::selectRaw('kategori, jenis, SUM(nominal) as total')
            ->when($month, function ($query) use ($year, $month) {
                $query->whereYear('tanggal_transaksi', $year)
                    ->whereMonth('tanggal_transaksi', $month);
            })
            ->groupBy('kategori', 'jenis')
            ->orderBy('total', 'desc')
            ->get();

        // Recent transactions
        $recentTransactions = Keuangan::with('creator:id,name')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'jenis' => $item->jenis,
                    'kategori' => $item->kategori,
                    'nominal' => $item->nominal,
                    'tanggal_transaksi' => $item->tanggal_transaksi->format('Y-m-d'),
                    'deskripsi' => $item->deskripsi,
                    'created_by_name' => $item->creator?->name ?? 'Unknown',
                ];
            });

        return Inertia::render('Keuangan/Analisis', [
            'totalMasuk' => $totalMasuk,
            'totalKeluar' => $totalKeluar,
            'saldoAkhir' => $saldoAkhir,
            'totalTransaksi' => $totalTransaksi,
            'chartData' => $chartData,
            'byCategory' => $categoryBreakdown,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
