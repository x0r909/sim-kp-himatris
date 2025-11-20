<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAnggotaRequest;
use App\Http\Requests\UpdateAnggotaRequest;
use App\Models\Anggota;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AnggotaController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('viewAny', Anggota::class);

        $anggota = Anggota::with('user:id,name')
            ->select(['id', 'user_id', 'nim', 'jurusan', 'jabatan', 'tahun_masuk', 'status', 'foto', 'sp_level', 'created_at'])
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'user_id' => $item->user_id,
                    'nama_lengkap' => $item->user?->name ?? 'Tidak ada akun',
                    'nim' => $item->nim,
                    'jurusan' => $item->jurusan,
                    'jabatan' => $item->jabatan,
                    'tahun_masuk' => $item->tahun_masuk,
                    'status' => $item->status,
                    'foto' => $item->foto,
                    'status_peringatan' => $item->status_peringatan,
                    'sp_level' => $item->sp_level,
                    'created_at' => $item->created_at,
                ];
            });

        return Inertia::render('Anggota/Index', [
            'anggota' => [
                'data' => $anggota,
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Anggota::class);

        // Get users that are not already anggota (optional - for BPH that have accounts)
        $availableUsers = User::whereDoesntHave('anggota')->get(['id', 'name', 'username']);

        return Inertia::render('Anggota/Create', [
            'availableUsers' => $availableUsers,
        ]);
    }

    public function store(StoreAnggotaRequest $request): RedirectResponse
    {
        $this->authorize('create', Anggota::class);

        $data = $request->validated();

        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('anggota', 'public');
        }

        $anggota = Anggota::create($data);

        // Create first histori jabatan
        if ($anggota->jabatan) {
            $anggota->historiJabatan()->create([
                'jabatan' => $anggota->jabatan,
                'tahun_mulai' => $anggota->tahun_masuk,
                'periode' => 'aktif',
            ]);
        }

        return redirect()->route('anggota.index')
            ->with('success', 'Anggota berhasil ditambahkan');
    }

    public function show(Anggota $anggotum): Response
    {
        $this->authorize('view', $anggotum);

        $anggotum->load(['user', 'historiJabatan' => function ($query) {
            $query->orderBy('tahun_mulai', 'desc');
        }]);

        return Inertia::render('Anggota/Show', [
            'anggota' => $anggotum,
        ]);
    }

    public function edit(Anggota $anggotum): Response
    {
        $this->authorize('update', $anggotum);

        $anggotum->load('user:id,name');

        // Get users without anggota, plus the current user if exists
        $availableUsers = User::whereDoesntHave('anggota')
            ->orWhere('id', $anggotum->user_id)
            ->get(['id', 'name', 'username']);

        return Inertia::render('Anggota/Edit', [
            'anggotum' => $anggotum,
            'availableUsers' => $availableUsers,
        ]);
    }

    public function update(UpdateAnggotaRequest $request, Anggota $anggotum): RedirectResponse
    {
        $this->authorize('update', $anggotum);

        // Save old foto path and jabatan before processing
        $oldFoto = $anggotum->foto;
        $oldJabatan = $anggotum->jabatan;

        $data = $request->validated();

        if ($request->hasFile('foto')) {
            // Delete old foto if exists
            if ($oldFoto && Storage::disk('public')->exists($oldFoto)) {
                Storage::disk('public')->delete($oldFoto);
            }
            $data['foto'] = $request->file('foto')->store('anggota', 'public');
        }

        $anggotum->update($data);

        // If jabatan changed, update histori
        if (isset($data['jabatan']) && $data['jabatan'] !== $oldJabatan) {
            // Mark old jabatan as selesai
            $anggotum->historiJabatan()
                ->where('periode', 'aktif')
                ->update([
                    'periode' => 'selesai',
                    'tahun_selesai' => date('Y'),
                ]);

            // Create new histori jabatan
            $anggotum->historiJabatan()->create([
                'jabatan' => $data['jabatan'],
                'tahun_mulai' => date('Y'),
                'periode' => 'aktif',
            ]);
        }

        return redirect()->route('anggota.index')
            ->with('success', 'Anggota berhasil diupdate');
    }

    public function destroy(Anggota $anggotum): RedirectResponse
    {
        $this->authorize('delete', $anggotum);

        // Delete foto if exists
        if ($anggotum->foto && Storage::disk('public')->exists($anggotum->foto)) {
            Storage::disk('public')->delete($anggotum->foto);
        }

        $anggotum->delete();

        return redirect()->route('anggota.index')
            ->with('success', 'Anggota berhasil dihapus');
    }
}
