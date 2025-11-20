<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKegiatanRequest;
use App\Http\Requests\UpdateKegiatanRequest;
use App\Models\Kegiatan;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class KegiatanController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('viewAny', Kegiatan::class);

        $kegiatan = Kegiatan::with('penanggungJawab:id,name')
            ->withCount('absensi')
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_kegiatan' => $item->nama_kegiatan,
                    'tanggal_mulai' => $item->tanggal_mulai->format('Y-m-d'),
                    'tanggal_selesai' => $item->tanggal_selesai->format('Y-m-d'),
                    'penanggung_jawab_name' => $item->penanggungJawab?->name ?? 'Unknown',
                    'total_absensi' => $item->absensi_count,
                    'created_at' => $item->created_at,
                ];
            });

        return Inertia::render('Kegiatan/Index', [
            'kegiatan' => [
                'data' => $kegiatan,
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Kegiatan::class);

        $users = User::select(['id', 'name'])->get();

        return Inertia::render('Kegiatan/Create', [
            'users' => $users,
        ]);
    }

    public function store(StoreKegiatanRequest $request): RedirectResponse
    {
        $this->authorize('create', Kegiatan::class);

        Kegiatan::create($request->validated());

        return redirect()->route('kegiatan.index')
            ->with('success', 'Kegiatan berhasil ditambahkan');
    }

    public function show(Kegiatan $kegiatan): Response
    {
        $this->authorize('view', $kegiatan);

        $kegiatan->load(['penanggungJawab:id,name', 'absensi.anggota']);

        return Inertia::render('Kegiatan/Show', [
            'kegiatan' => $kegiatan,
        ]);
    }

    public function edit(Kegiatan $kegiatan): Response
    {
        $this->authorize('update', $kegiatan);

        $users = User::select(['id', 'name'])->get();

        return Inertia::render('Kegiatan/Edit', [
            'kegiatan' => $kegiatan,
            'users' => $users,
        ]);
    }

    public function update(UpdateKegiatanRequest $request, Kegiatan $kegiatan): RedirectResponse
    {
        $this->authorize('update', $kegiatan);

        $kegiatan->update($request->validated());

        return redirect()->route('kegiatan.index')
            ->with('success', 'Kegiatan berhasil diperbarui');
    }

    public function destroy(Kegiatan $kegiatan): RedirectResponse
    {
        $this->authorize('delete', $kegiatan);

        $kegiatan->delete();

        return redirect()->route('kegiatan.index')
            ->with('success', 'Kegiatan berhasil dihapus');
    }
}
