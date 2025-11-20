<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAuditKeuanganRequest;
use App\Models\AuditKeuangan;
use App\Models\Keuangan;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AuditKeuanganController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('viewAny', AuditKeuangan::class);

        $audits = AuditKeuangan::with(['keuangan', 'auditor:id,name'])
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'keuangan' => [
                        'id' => $item->keuangan?->id ?? 0,
                        'jenis' => $item->keuangan?->jenis ?? '-',
                        'kategori' => $item->keuangan?->kategori ?? '-',
                        'nominal' => $item->keuangan?->nominal ?? 0,
                        'tanggal_transaksi' => $item->keuangan?->tanggal_transaksi?->format('Y-m-d') ?? '-',
                    ],
                    'status_audit' => $item->status_audit,
                    'tanggal_audit' => $item->tanggal_audit?->format('Y-m-d'),
                    'catatan' => $item->catatan,
                    'auditor_name' => $item->auditor?->name ?? 'Unknown',
                    'created_at' => $item->created_at,
                ];
            });

        $canManage = auth()->user()->canManageKeuangan();

        return Inertia::render('Keuangan/Audit/Index', [
            'auditLogs' => $audits,
            'canManage' => $canManage,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', AuditKeuangan::class);

        $keuangan = Keuangan::select(['id', 'jenis', 'kategori', 'nominal', 'tanggal_transaksi'])
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'label' => "{$item->jenis} - {$item->kategori} - Rp " . number_format($item->nominal, 0, ',', '.') . " ({$item->tanggal_transaksi->format('d/m/Y')})",
                ];
            });

        return Inertia::render('Keuangan/Audit/Create', [
            'keuangan' => $keuangan,
        ]);
    }

    public function store(StoreAuditKeuanganRequest $request): RedirectResponse
    {
        $this->authorize('create', AuditKeuangan::class);

        $data = $request->validated();
        $data['auditor_id'] = auth()->id();

        AuditKeuangan::create($data);

        return redirect()->route('audit-keuangan.index')
            ->with('success', 'Audit keuangan berhasil ditambahkan');
    }

    public function show(AuditKeuangan $auditKeuangan): Response
    {
        $this->authorize('view', $auditKeuangan);

        $auditKeuangan->load(['keuangan.creator:id,name', 'auditor:id,name']);

        return Inertia::render('Keuangan/Audit/Show', [
            'audit' => $auditKeuangan,
        ]);
    }
}
