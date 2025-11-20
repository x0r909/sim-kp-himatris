<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use App\Models\Kegiatan;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgendaController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $this->authorize('viewAny', Agenda::class);

        $query = Agenda::with(['penanggungJawab', 'kegiatan', 'creator'])
            ->orderBy('tanggal_mulai', 'asc');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by jenis
        if ($request->has('jenis') && $request->jenis !== 'all') {
            $query->where('jenis', $request->jenis);
        }

        // Filter by month
        if ($request->has('month')) {
            $query->whereMonth('tanggal_mulai', $request->month);
        }

        // Filter by year
        if ($request->has('year')) {
            $query->whereYear('tanggal_mulai', $request->year);
        }

        $agenda = $query->get();

        $canManage = auth()->user()->canAccessAllModules() || auth()->user()->isSekretaris();

        return Inertia::render('Agenda/Index', [
            'agenda' => $agenda,
            'canManage' => $canManage,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Agenda::class);

        $users = User::where('status', 'aktif')
            ->orderBy('name')
            ->get(['id', 'name', 'role']);

        $kegiatanList = Kegiatan::orderBy('tanggal_mulai', 'desc')
            ->get(['id', 'nama_kegiatan', 'tanggal_mulai']);

        return Inertia::render('Agenda/Create', [
            'users' => $users,
            'kegiatanList' => $kegiatanList,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Agenda::class);

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'lokasi' => 'nullable|string|max:255',
            'jenis' => 'required|in:rapat,seminar,workshop,kegiatan,lainnya',
            'penanggung_jawab_id' => 'required|exists:users,id',
            'kegiatan_id' => 'nullable|exists:kegiatan,id',
            'status' => 'required|in:draft,published,completed,cancelled',
            'catatan' => 'nullable|string',
        ]);

        $validated['created_by'] = auth()->id();

        Agenda::create($validated);

        return redirect()->route('agenda.index')
            ->with('success', 'Agenda berhasil ditambahkan');
    }

    public function show(Agenda $agenda)
    {
        $this->authorize('view', $agenda);

        $agenda->load(['penanggungJawab', 'kegiatan', 'creator', 'updater']);

        $canManage = auth()->user()->canAccessAllModules() || auth()->user()->isSekretaris();

        return Inertia::render('Agenda/Show', [
            'agenda' => $agenda,
            'canManage' => $canManage,
        ]);
    }

    public function edit(Agenda $agenda)
    {
        $this->authorize('update', $agenda);

        $agenda->load(['penanggungJawab', 'kegiatan']);

        $users = User::where('status', 'aktif')
            ->orderBy('name')
            ->get(['id', 'name', 'role']);

        $kegiatanList = Kegiatan::orderBy('tanggal_mulai', 'desc')
            ->get(['id', 'nama_kegiatan', 'tanggal_mulai']);

        return Inertia::render('Agenda/Edit', [
            'agenda' => $agenda,
            'users' => $users,
            'kegiatanList' => $kegiatanList,
        ]);
    }

    public function update(Request $request, Agenda $agenda)
    {
        $this->authorize('update', $agenda);

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'lokasi' => 'nullable|string|max:255',
            'jenis' => 'required|in:rapat,seminar,workshop,kegiatan,lainnya',
            'penanggung_jawab_id' => 'required|exists:users,id',
            'kegiatan_id' => 'nullable|exists:kegiatan,id',
            'status' => 'required|in:draft,published,completed,cancelled',
            'catatan' => 'nullable|string',
        ]);

        $validated['updated_by'] = auth()->id();

        $agenda->update($validated);

        return redirect()->route('agenda.index')
            ->with('success', 'Agenda berhasil diperbarui');
    }

    public function destroy(Agenda $agenda)
    {
        $this->authorize('delete', $agenda);

        $agenda->delete();

        return redirect()->route('agenda.index')
            ->with('success', 'Agenda berhasil dihapus');
    }
}
