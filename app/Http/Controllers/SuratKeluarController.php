<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSuratKeluarRequest;
use App\Http\Requests\UpdateSuratKeluarRequest;
use App\Models\SuratKeluar;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SuratKeluarController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('viewAny', SuratKeluar::class);

        $suratKeluar = SuratKeluar::with('creator:id,name')
            ->select(['id', 'nomor_surat', 'tujuan', 'tanggal_keluar', 'perihal', 'file_surat', 'tanda_tangan', 'created_by', 'created_at'])
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nomor_surat' => $item->nomor_surat,
                    'tujuan' => $item->tujuan,
                    'tanggal_keluar' => $item->tanggal_keluar->format('Y-m-d'),
                    'perihal' => $item->perihal,
                    'file_surat' => $item->file_surat,
                    'tanda_tangan' => $item->tanda_tangan,
                    'created_by_name' => $item->creator?->name ?? 'Unknown',
                    'created_at' => $item->created_at,
                ];
            });

        return Inertia::render('SuratKeluar/Index', [
            'suratKeluar' => [
                'data' => $suratKeluar,
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', SuratKeluar::class);

        return Inertia::render('SuratKeluar/Create');
    }

    public function store(StoreSuratKeluarRequest $request): RedirectResponse
    {
        $this->authorize('create', SuratKeluar::class);

        $data = $request->validated();
        $data['created_by'] = auth()->id();

        if ($request->hasFile('file_surat')) {
            $data['file_surat'] = $request->file('file_surat')->store('surat_keluar', 'public');
        }

        SuratKeluar::create($data);

        return redirect()->route('surat-keluar.index')
            ->with('success', 'Surat keluar berhasil ditambahkan');
    }

    public function show(SuratKeluar $suratKeluar): Response
    {
        $this->authorize('view', $suratKeluar);

        $suratKeluar->load('creator:id,name');

        return Inertia::render('SuratKeluar/Show', [
            'suratKeluar' => $suratKeluar,
        ]);
    }

    public function edit(SuratKeluar $suratKeluar): Response
    {
        $this->authorize('update', $suratKeluar);

        return Inertia::render('SuratKeluar/Edit', [
            'suratKeluar' => $suratKeluar,
        ]);
    }

    public function update(UpdateSuratKeluarRequest $request, SuratKeluar $suratKeluar): RedirectResponse
    {
        $this->authorize('update', $suratKeluar);

        $data = $request->validated();

        if ($request->hasFile('file_surat')) {
            // Delete old file if exists
            if ($suratKeluar->file_surat) {
                Storage::disk('public')->delete($suratKeluar->file_surat);
            }
            $data['file_surat'] = $request->file('file_surat')->store('surat_keluar', 'public');
        }

        $suratKeluar->update($data);

        return redirect()->route('surat-keluar.index')
            ->with('success', 'Surat keluar berhasil diperbarui');
    }

    public function destroy(SuratKeluar $suratKeluar): RedirectResponse
    {
        $this->authorize('delete', $suratKeluar);

        // Delete file if exists
        if ($suratKeluar->file_surat) {
            Storage::disk('public')->delete($suratKeluar->file_surat);
        }

        $suratKeluar->delete();

        return redirect()->route('surat-keluar.index')
            ->with('success', 'Surat keluar berhasil dihapus');
    }
}
