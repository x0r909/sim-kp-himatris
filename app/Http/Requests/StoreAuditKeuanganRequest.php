<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAuditKeuanganRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin' || $this->user()?->role === 'bendahara';
    }

    public function rules(): array
    {
        return [
            'keuangan_id' => ['required', 'exists:keuangan,id'],
            'status_audit' => ['required', Rule::in(['approved', 'rejected', 'pending'])],
            'tanggal_audit' => ['required', 'date'],
            'catatan' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'keuangan_id.required' => 'Transaksi keuangan harus dipilih',
            'keuangan_id.exists' => 'Transaksi keuangan tidak ditemukan',
            'status_audit.required' => 'Status audit harus diisi',
            'status_audit.in' => 'Status audit tidak valid',
            'tanggal_audit.required' => 'Tanggal audit harus diisi',
            'tanggal_audit.date' => 'Tanggal audit tidak valid',
            'catatan.required' => 'Catatan audit harus diisi',
        ];
    }
}
