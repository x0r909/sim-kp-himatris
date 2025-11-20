<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAbsensiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->canManageAnggota();
    }

    public function rules(): array
    {
        return [
            'kegiatan_id' => ['required', 'exists:kegiatan,id'],
            'anggota_id' => ['required', 'exists:anggota,id'],
            'status_hadir' => ['required', Rule::in(['hadir', 'alpha', 'izin', 'sakit'])],
            'waktu_absen' => ['required', 'date'],
            'keterangan' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'kegiatan_id.required' => 'Kegiatan harus dipilih',
            'kegiatan_id.exists' => 'Kegiatan tidak ditemukan',
            'anggota_id.required' => 'Anggota harus dipilih',
            'anggota_id.exists' => 'Anggota tidak ditemukan',
            'status_hadir.required' => 'Status kehadiran harus dipilih',
            'status_hadir.in' => 'Status kehadiran tidak valid',
            'waktu_absen.required' => 'Waktu absen harus diisi',
            'waktu_absen.date' => 'Waktu absen tidak valid',
        ];
    }
}
