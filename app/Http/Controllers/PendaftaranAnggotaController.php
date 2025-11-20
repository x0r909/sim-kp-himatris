<?php

namespace App\Http\Controllers;

use App\Models\PendaftaranAnggota;
use App\Models\Anggota;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PendaftaranAnggotaController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $this->authorize('viewAny', PendaftaranAnggota::class);

        $query = PendaftaranAnggota::with('reviewer')
            ->orderBy('created_at', 'desc');

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama_lengkap', 'like', "%{$request->search}%")
                    ->orWhere('nim', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $pendaftaran = $query->paginate(10)->withQueryString();

        $stats = [
            'total' => PendaftaranAnggota::count(),
            'pending' => PendaftaranAnggota::where('status', 'pending')->count(),
            'approved' => PendaftaranAnggota::where('status', 'approved')->count(),
            'rejected' => PendaftaranAnggota::where('status', 'rejected')->count(),
        ];

        return Inertia::render('PendaftaranAnggota/Index', [
            'pendaftaran' => $pendaftaran,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('PendaftaranAnggota/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nim' => 'required|string|unique:pendaftaran_anggota,nim|unique:anggota,nim',
            'email' => 'required|email|unique:pendaftaran_anggota,email|unique:anggota,email',
            'no_hp' => 'required|string|max:20',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'jurusan' => 'required|string|max:255',
            'angkatan' => 'required|string|max:4',
            'alamat' => 'nullable|string',
            'alasan_bergabung' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('pendaftaran', 'public');
        }

        $validated['status'] = 'pending';

        PendaftaranAnggota::create($validated);

        return redirect()->route('pendaftaran-anggota.success')
            ->with('success', 'Pendaftaran berhasil! Silakan tunggu konfirmasi dari admin.');
    }

    public function show(PendaftaranAnggota $pendaftaranAnggotum)
    {
        $this->authorize('view', $pendaftaranAnggotum);

        $pendaftaranAnggotum->load('reviewer');

        $canManage = auth()->user()->canAccessAllModules() || auth()->user()->isSekretaris();

        return Inertia::render('PendaftaranAnggota/Show', [
            'pendaftaran' => $pendaftaranAnggotum,
            'canManage' => $canManage,
        ]);
    }

    public function destroy(PendaftaranAnggota $pendaftaranAnggotum)
    {
        $this->authorize('delete', $pendaftaranAnggotum);

        if ($pendaftaranAnggotum->foto) {
            Storage::disk('public')->delete($pendaftaranAnggotum->foto);
        }

        $pendaftaranAnggotum->delete();

        return redirect()->route('pendaftaran-anggota.index')
            ->with('success', 'Data pendaftaran berhasil dihapus');
    }

    public function approve(PendaftaranAnggota $pendaftaranAnggotum)
    {
        $this->authorize('approve', $pendaftaranAnggotum);

        $anggota = Anggota::create([
            'nama' => $pendaftaranAnggotum->nama_lengkap,
            'nim' => $pendaftaranAnggotum->nim,
            'email' => $pendaftaranAnggotum->email,
            'no_hp' => $pendaftaranAnggotum->no_hp,
            'jenis_kelamin' => $pendaftaranAnggotum->jenis_kelamin,
            'jurusan' => $pendaftaranAnggotum->jurusan,
            'angkatan' => $pendaftaranAnggotum->angkatan,
            'alamat' => $pendaftaranAnggotum->alamat,
            'foto' => $pendaftaranAnggotum->foto,
            'status' => 'aktif',
            'tanggal_bergabung' => now(),
        ]);

        $pendaftaranAnggotum->update([
            'status' => 'approved',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        return redirect()->route('pendaftaran-anggota.index')
            ->with('success', 'Pendaftaran berhasil disetujui dan anggota baru telah ditambahkan');
    }

    public function reject(Request $request, PendaftaranAnggota $pendaftaranAnggotum)
    {
        $this->authorize('reject', $pendaftaranAnggotum);

        $validated = $request->validate([
            'catatan_penolakan' => 'required|string',
        ]);

        $pendaftaranAnggotum->update([
            'status' => 'rejected',
            'catatan_penolakan' => $validated['catatan_penolakan'],
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        return redirect()->route('pendaftaran-anggota.index')
            ->with('success', 'Pendaftaran telah ditolak');
    }

    public function success()
    {
        return Inertia::render('PendaftaranAnggota/Success');
    }
}
