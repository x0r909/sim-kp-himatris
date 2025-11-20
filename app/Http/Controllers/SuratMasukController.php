<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSuratMasukRequest;
use App\Http\Requests\UpdateSuratMasukRequest;
use App\Models\SuratMasuk;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SuratMasukController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('viewAny', SuratMasuk::class);

        $suratMasuk = SuratMasuk::with('creator:id,name')
            ->select(['id', 'nomor_surat', 'pengirim', 'tanggal_masuk', 'perihal', 'file_surat', 'created_by', 'created_at'])
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nomor_surat' => $item->nomor_surat,
                    'pengirim' => $item->pengirim,
                    'tanggal_masuk' => $item->tanggal_masuk->format('Y-m-d'),
                    'perihal' => $item->perihal,
                    'file_surat' => $item->file_surat,
                    'created_by_name' => $item->creator?->name ?? 'Unknown',
                    'created_at' => $item->created_at,
                ];
            });

        return Inertia::render('SuratMasuk/Index', [
            'suratMasuk' => [
                'data' => $suratMasuk,
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', SuratMasuk::class);

        return Inertia::render('SuratMasuk/Create');
    }

    public function store(StoreSuratMasukRequest $request): RedirectResponse
    {
        $this->authorize('create', SuratMasuk::class);

        $data = $request->validated();
        $data['created_by'] = auth()->id();

        if ($request->hasFile('file_surat')) {
            $data['file_surat'] = $request->file('file_surat')->store('surat_masuk', 'public');
        }

        SuratMasuk::create($data);

        return redirect()->route('surat-masuk.index')
            ->with('success', 'Surat masuk berhasil ditambahkan');
    }

    public function show(SuratMasuk $suratMasuk): Response
    {
        $this->authorize('view', $suratMasuk);

        $suratMasuk->load('creator:id,name');

        return Inertia::render('SuratMasuk/Show', [
            'suratMasuk' => $suratMasuk,
        ]);
    }

    public function edit(SuratMasuk $suratMasuk): Response
    {
        $this->authorize('update', $suratMasuk);

        return Inertia::render('SuratMasuk/Edit', [
            'suratMasuk' => $suratMasuk,
        ]);
    }

    public function update(UpdateSuratMasukRequest $request, SuratMasuk $suratMasuk): RedirectResponse
    {
        $this->authorize('update', $suratMasuk);

        $data = $request->validated();

        if ($request->hasFile('file_surat')) {
            // Delete old file if exists
            if ($suratMasuk->file_surat) {
                Storage::disk('public')->delete($suratMasuk->file_surat);
            }
            $data['file_surat'] = $request->file('file_surat')->store('surat_masuk', 'public');
        }

        $suratMasuk->update($data);

        return redirect()->route('surat-masuk.index')
            ->with('success', 'Surat masuk berhasil diperbarui');
    }

    public function destroy(SuratMasuk $suratMasuk): RedirectResponse
    {
        $this->authorize('delete', $suratMasuk);

        // Delete file if exists
        if ($suratMasuk->file_surat) {
            Storage::disk('public')->delete($suratMasuk->file_surat);
        }

        $suratMasuk->delete();

        return redirect()->route('surat-masuk.index')
            ->with('success', 'Surat masuk berhasil dihapus');
    }
}
