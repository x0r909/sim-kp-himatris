<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAnggotaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->canManageAnggota();
    }

    public function rules(): array
    {
        return [
            'nim' => ['required', 'string', 'max:255', 'unique:anggota'],
            'jurusan' => ['required', 'string', 'max:255'],
            'jabatan' => ['required', 'string', 'max:255'],
            'tahun_masuk' => ['required', 'integer', 'min:1900', 'max:' . date('Y')],
            'status' => ['required', Rule::in(['aktif', 'nonaktif', 'alumni'])],
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:2048'],
            'sp_level' => ['nullable', 'integer', 'between:0,3'],
            'keterangan_sp' => ['nullable', 'string'],
            'user_id' => ['nullable', 'exists:users,id'],
            'total_absen' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'nim.required' => 'NIM harus diisi',
            'nim.unique' => 'NIM sudah terdaftar',
            'jurusan.required' => 'Jurusan harus diisi',
            'jabatan.required' => 'Jabatan harus diisi',
            'tahun_masuk.required' => 'Tahun masuk harus diisi',
            'tahun_masuk.integer' => 'Tahun masuk harus berupa angka',
            'tahun_masuk.min' => 'Tahun masuk tidak valid',
            'tahun_masuk.max' => 'Tahun masuk tidak boleh melebihi tahun sekarang',
            'status.required' => 'Status harus dipilih',
            'status.in' => 'Status tidak valid',
            'foto.image' => 'File harus berupa gambar',
            'foto.mimes' => 'Format foto harus jpg, jpeg, png, atau gif',
            'foto.max' => 'Ukuran foto maksimal 2MB',
            'sp_level.integer' => 'Level SP harus berupa angka',
            'sp_level.between' => 'Level SP harus antara 0-3',
            'user_id.exists' => 'User tidak ditemukan',
            'total_absen.integer' => 'Total absen harus berupa angka',
            'total_absen.min' => 'Total absen tidak boleh negatif',
        ];
    }
}
