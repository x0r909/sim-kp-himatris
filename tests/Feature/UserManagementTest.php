<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\{actingAs, assertDatabaseHas, assertDatabaseMissing};

beforeEach(function () {
    Storage::fake('public');
});

it('can view users index page as admin', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    actingAs($admin)
        ->get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Users/Index'));
});

it('can view users index page as bendahara', function () {
    $bendahara = User::factory()->create(['role' => 'bendahara']);

    actingAs($bendahara)
        ->get(route('users.index'))
        ->assertOk();
});

it('cannot view users index page as anggota', function () {
    $anggota = User::factory()->create(['role' => 'anggota']);

    actingAs($anggota)
        ->get(route('users.index'))
        ->assertForbidden();
});

it('can create a new user as admin', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'New User',
            'email' => 'newuser@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'anggota',
            'status' => 'aktif',
        ])
        ->assertRedirect(route('users.index'));

    assertDatabaseHas('users', [
        'name' => 'New User',
        'email' => 'newuser@test.com',
        'role' => 'anggota',
        'status' => 'aktif',
    ]);
});

it('validates required fields when creating user', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    actingAs($admin)
        ->post(route('users.store'), [])
        ->assertInvalid(['name', 'email', 'password', 'role', 'status']);
});

it('can update user as admin', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@test.com',
        'role' => 'anggota',
    ]);

    actingAs($admin)
        ->put(route('users.update', $user), [
            'name' => 'Updated Name',
            'email' => 'updated@test.com',
            'role' => 'bendahara',
            'status' => 'aktif',
        ])
        ->assertRedirect(route('users.index'));

    assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
        'email' => 'updated@test.com',
        'role' => 'bendahara',
    ]);
});

it('can delete user as admin', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();

    actingAs($admin)
        ->delete(route('users.destroy', $user))
        ->assertRedirect(route('users.index'));

    assertDatabaseMissing('users', ['id' => $user->id]);
});

it('cannot delete own account', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    actingAs($admin)
        ->delete(route('users.destroy', $admin))
        ->assertForbidden();

    assertDatabaseHas('users', ['id' => $admin->id]);
});

it('cannot access user management as guest', function () {
    $this->get(route('users.index'))
        ->assertRedirect(route('login'));
});
