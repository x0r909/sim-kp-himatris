<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->canManageUsers();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($this->user), 'alpha_dash'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($this->user)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in(['admin', 'ketua', 'wakil_ketua', 'sekretaris_umum', 'sekretaris_1', 'sekretaris_2', 'bendahara_1', 'bendahara_2', 'anggota'])],
            'status' => ['required', Rule::in(['aktif', 'nonaktif'])],
            'foto' => ['nullable', 'image', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama harus diisi',
            'username.required' => 'Username harus diisi',
            'username.unique' => 'Username sudah digunakan',
            'username.alpha_dash' => 'Username hanya boleh berisi huruf, angka, dash dan underscore',
            'email.required' => 'Email harus diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.min' => 'Password minimal 8 karakter',
            'password.confirmed' => 'Konfirmasi password tidak cocok',
            'role.required' => 'Role harus dipilih',
            'role.in' => 'Role tidak valid',
            'status.required' => 'Status harus dipilih',
            'foto.image' => 'File harus berupa gambar',
            'foto.max' => 'Ukuran foto maksimal 2MB',
        ];
    }
}
