<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreKeuanganRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin' || $this->user()?->role === 'bendahara';
    }

    public function rules(): array
    {
        return [
            'jenis' => ['required', Rule::in(['masuk', 'keluar'])],
            'kategori' => ['required', 'string', 'max:255'],
            'nominal' => ['required', 'numeric', 'min:0'],
            'tanggal_transaksi' => ['required', 'date'],
            'deskripsi' => ['required', 'string'],
            'bukti_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'jenis.required' => 'Jenis transaksi harus diisi',
            'jenis.in' => 'Jenis transaksi harus masuk atau keluar',
            'kategori.required' => 'Kategori harus diisi',
            'nominal.required' => 'Nominal harus diisi',
            'nominal.numeric' => 'Nominal harus berupa angka',
            'nominal.min' => 'Nominal tidak boleh negatif',
            'tanggal_transaksi.required' => 'Tanggal transaksi harus diisi',
            'tanggal_transaksi.date' => 'Tanggal transaksi tidak valid',
            'deskripsi.required' => 'Deskripsi harus diisi',
            'bukti_file.file' => 'Bukti harus berupa file',
            'bukti_file.mimes' => 'Bukti harus berupa file PDF, JPG, JPEG, atau PNG',
            'bukti_file.max' => 'Ukuran file bukti maksimal 2MB',
        ];
    }
}
