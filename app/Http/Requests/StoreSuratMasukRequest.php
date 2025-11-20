<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSuratMasukRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->canManageAnggota();
    }

    public function rules(): array
    {
        return [
            'nomor_surat' => ['required', 'string', 'max:255', 'unique:surat_masuk'],
            'pengirim' => ['required', 'string', 'max:255'],
            'tanggal_masuk' => ['required', 'date'],
            'perihal' => ['required', 'string', 'max:255'],
            'file_surat' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'keterangan' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'nomor_surat.required' => 'Nomor surat harus diisi',
            'nomor_surat.unique' => 'Nomor surat sudah terdaftar',
            'pengirim.required' => 'Pengirim harus diisi',
            'tanggal_masuk.required' => 'Tanggal masuk harus diisi',
            'tanggal_masuk.date' => 'Tanggal masuk tidak valid',
            'perihal.required' => 'Perihal harus diisi',
            'file_surat.required' => 'File surat harus diunggah',
            'file_surat.file' => 'File surat tidak valid',
            'file_surat.mimes' => 'Format file harus PDF, JPG, JPEG, atau PNG',
            'file_surat.max' => 'Ukuran file maksimal 5MB',
        ];
    }
}
