<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKeuanganRequest;
use App\Http\Requests\UpdateKeuanganRequest;
use App\Models\Keuangan;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class KeuanganController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('viewAny', Keuangan::class);

        $keuangan = Keuangan::with('creator:id,name')
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'jenis' => $item->jenis,
                    'kategori' => $item->kategori,
                    'nominal' => $item->nominal,
                    'tanggal_transaksi' => $item->tanggal_transaksi->format('Y-m-d'),
                    'deskripsi' => $item->deskripsi,
                    'bukti_file' => $item->bukti_file,
                    'created_by_name' => $item->creator?->name ?? 'Unknown',
                    'created_at' => $item->created_at,
                ];
            });

        $canManage = auth()->user()->canManageKeuangan();

        return Inertia::render('Keuangan/Index', [
            'keuangan' => [
                'data' => $keuangan,
            ],
            'canManage' => $canManage,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Keuangan::class);

        return Inertia::render('Keuangan/Create');
    }

    public function store(StoreKeuanganRequest $request): RedirectResponse
    {
        $this->authorize('create', Keuangan::class);

        $data = $request->validated();
        $data['created_by'] = auth()->id();

        if ($request->hasFile('bukti_file')) {
            $data['bukti_file'] = $request->file('bukti_file')->store('keuangan', 'public');
        }

        Keuangan::create($data);

        return redirect()->route('keuangan.index')
            ->with('success', 'Transaksi keuangan berhasil ditambahkan');
    }

    public function show(Keuangan $keuangan): Response
    {
        $this->authorize('view', $keuangan);

        $keuangan->load(['creator:id,name', 'auditLogs.auditor:id,name']);

        $canManage = auth()->user()->canManageKeuangan();

        return Inertia::render('Keuangan/Show', [
            'keuangan' => $keuangan,
            'canManage' => $canManage,
        ]);
    }

    public function edit(Keuangan $keuangan): Response
    {
        $this->authorize('update', $keuangan);

        return Inertia::render('Keuangan/Edit', [
            'keuangan' => $keuangan,
        ]);
    }

    public function update(UpdateKeuanganRequest $request, Keuangan $keuangan): RedirectResponse
    {
        $this->authorize('update', $keuangan);

        $data = $request->validated();

        if ($request->hasFile('bukti_file')) {
            // Delete old file
            if ($keuangan->bukti_file) {
                Storage::disk('public')->delete($keuangan->bukti_file);
            }
            $data['bukti_file'] = $request->file('bukti_file')->store('keuangan', 'public');
        }

        $keuangan->update($data);

        return redirect()->route('keuangan.index')
            ->with('success', 'Transaksi keuangan berhasil diperbarui');
    }

    public function destroy(Keuangan $keuangan): RedirectResponse
    {
        $this->authorize('delete', $keuangan);

        // Delete file if exists
        if ($keuangan->bukti_file) {
            Storage::disk('public')->delete($keuangan->bukti_file);
        }

        $keuangan->delete();

        return redirect()->route('keuangan.index')
            ->with('success', 'Transaksi keuangan berhasil dihapus');
    }
}
