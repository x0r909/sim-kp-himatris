<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAbsensiRequest;
use App\Http\Requests\UpdateAbsensiRequest;
use App\Models\Absensi;
use App\Models\Anggota;
use App\Models\Kegiatan;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AbsensiController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('viewAny', Absensi::class);

        $absensi = Absensi::with(['kegiatan:id,nama_kegiatan', 'anggota'])
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'kegiatan_nama' => $item->kegiatan?->nama_kegiatan ?? 'Unknown',
                    'anggota_nama' => $item->anggota?->user?->name ?? $item->anggota?->nim ?? 'Unknown',
                    'status_hadir' => $item->status_hadir,
                    'waktu_absen' => $item->waktu_absen?->format('Y-m-d H:i'),
                    'created_at' => $item->created_at,
                ];
            });

        return Inertia::render('Absensi/Index', [
            'absensi' => [
                'data' => $absensi,
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Absensi::class);

        $kegiatan = Kegiatan::select(['id', 'nama_kegiatan'])->get();
        $anggota = Anggota::with('user:id,name')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->user?->name ?? $item->nim,
            ];
        });

        return Inertia::render('Absensi/Create', [
            'kegiatan' => $kegiatan,
            'anggota' => $anggota,
        ]);
    }

    public function store(StoreAbsensiRequest $request): RedirectResponse
    {
        $this->authorize('create', Absensi::class);

        $absensi = Absensi::create($request->validated());

        // Update total absensi anggota based on status
        $this->updateTotalAbsensi($absensi->anggota_id);

        return redirect()->route('absensi.index')
            ->with('success', 'Absensi berhasil ditambahkan');
    }

    public function show(Absensi $absensi): Response
    {
        $this->authorize('view', $absensi);

        $absensi->load(['kegiatan', 'anggota.user']);

        return Inertia::render('Absensi/Show', [
            'absensi' => $absensi,
        ]);
    }

    public function edit(Absensi $absensi): Response
    {
        $this->authorize('update', $absensi);

        $kegiatan = Kegiatan::select(['id', 'nama_kegiatan'])->get();
        $anggota = Anggota::with('user:id,name')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->user?->name ?? $item->nim,
            ];
        });

        return Inertia::render('Absensi/Edit', [
            'absensi' => $absensi,
            'kegiatan' => $kegiatan,
            'anggota' => $anggota,
        ]);
    }

    public function update(UpdateAbsensiRequest $request, Absensi $absensi): RedirectResponse
    {
        $this->authorize('update', $absensi);

        $oldAnggotaId = $absensi->anggota_id;

        $absensi->update($request->validated());

        // Update total absensi for both old and new anggota if changed
        $this->updateTotalAbsensi($oldAnggotaId);
        if ($absensi->anggota_id !== $oldAnggotaId) {
            $this->updateTotalAbsensi($absensi->anggota_id);
        }

        return redirect()->route('absensi.index')
            ->with('success', 'Absensi berhasil diperbarui');
    }

    public function destroy(Absensi $absensi): RedirectResponse
    {
        $this->authorize('delete', $absensi);

        $anggotaId = $absensi->anggota_id;

        $absensi->delete();

        // Update total absensi after deletion
        $this->updateTotalAbsensi($anggotaId);

        return redirect()->route('absensi.index')
            ->with('success', 'Absensi berhasil dihapus');
    }

    /**
     * Update total absensi anggota dan otomatis berikan SP jika perlu
     */
    protected function updateTotalAbsensi(int $anggotaId): void
    {
        $anggota = Anggota::find($anggotaId);

        if (! $anggota) {
            return;
        }

        // Hitung total ketidakhadiran (alpha, izin, sakit)
        $totalTidakHadir = Absensi::where('anggota_id', $anggotaId)
            ->whereIn('status_hadir', ['alpha', 'izin', 'sakit'])
            ->count();

        $anggota->total_absen = $totalTidakHadir;

        // Otomasi pemberian SP berdasarkan total ketidakhadiran
        $oldSpLevel = $anggota->sp_level;
        $newSpLevel = 0;
        $keterangan = null;

        if ($totalTidakHadir >= 10) {
            $newSpLevel = 3;
            $keterangan = "SP 3: Total {$totalTidakHadir}x tidak hadir";
        } elseif ($totalTidakHadir >= 7) {
            $newSpLevel = 2;
            $keterangan = "SP 2: Total {$totalTidakHadir}x tidak hadir";
        } elseif ($totalTidakHadir >= 4) {
            $newSpLevel = 1;
            $keterangan = "SP 1: Total {$totalTidakHadir}x tidak hadir";
        }

        // Update SP level jika ada perubahan
        if ($newSpLevel > $oldSpLevel) {
            $anggota->sp_level = $newSpLevel;
            $anggota->keterangan_sp = $keterangan;
        }

        $anggota->save();
    }
}
