<?php

use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\AgendaController;
use App\Http\Controllers\AnalisisKeuanganController;
use App\Http\Controllers\AnggotaController;
use App\Http\Controllers\AuditKeuanganController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KegiatanController;
use App\Http\Controllers\KeuanganController;
use App\Http\Controllers\PendaftaranAnggotaController;
use App\Http\Controllers\PersuratanController;
use App\Http\Controllers\SuratKeluarController;
use App\Http\Controllers\SuratMasukController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('users', UserController::class);
    Route::resource('anggota', AnggotaController::class);
    Route::resource('pendaftaran-anggota', PendaftaranAnggotaController::class)->except(['edit', 'update']);
    Route::post('pendaftaran-anggota/{pendaftaranAnggotum}/approve', [PendaftaranAnggotaController::class, 'approve'])->name('pendaftaran-anggota.approve');
    Route::post('pendaftaran-anggota/{pendaftaranAnggotum}/reject', [PendaftaranAnggotaController::class, 'reject'])->name('pendaftaran-anggota.reject');
    Route::get('pendaftaran-success', [PendaftaranAnggotaController::class, 'success'])->name('pendaftaran-anggota.success');
    Route::get('persuratan', [PersuratanController::class, 'index'])->name('persuratan');
    Route::resource('surat-masuk', SuratMasukController::class);
    Route::resource('surat-keluar', SuratKeluarController::class);
    Route::resource('kegiatan', KegiatanController::class);
    Route::resource('absensi', AbsensiController::class);
    Route::resource('agenda', AgendaController::class);

    // Keuangan routes
    Route::resource('keuangan', KeuanganController::class);
    Route::get('analisis-keuangan', [AnalisisKeuanganController::class, 'index'])->name('analisis-keuangan');
    Route::resource('audit-keuangan', AuditKeuanganController::class)->only(['index', 'create', 'store', 'show']);
});

require __DIR__.'/settings.php';
