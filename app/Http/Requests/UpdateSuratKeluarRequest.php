<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSuratKeluarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->canManageAnggota();
    }

    public function rules(): array
    {
        return [
            'nomor_surat' => ['required', 'string', 'max:255', Rule::unique('surat_keluar')->ignore($this->route('surat_keluar'))],
            'tujuan' => ['required', 'string', 'max:255'],
            'tanggal_keluar' => ['required', 'date'],
            'perihal' => ['required', 'string', 'max:255'],
            'file_surat' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'tanda_tangan' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'nomor_surat.required' => 'Nomor surat harus diisi',
            'nomor_surat.unique' => 'Nomor surat sudah terdaftar',
            'tujuan.required' => 'Tujuan harus diisi',
            'tanggal_keluar.required' => 'Tanggal keluar harus diisi',
            'tanggal_keluar.date' => 'Tanggal keluar tidak valid',
            'perihal.required' => 'Perihal harus diisi',
            'file_surat.file' => 'File surat tidak valid',
            'file_surat.mimes' => 'Format file harus PDF',
            'file_surat.max' => 'Ukuran file maksimal 5MB',
            'tanda_tangan.required' => 'Tanda tangan harus diisi',
        ];
    }
}
