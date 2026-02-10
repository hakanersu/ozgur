<?php

use App\Models\User;
use Filament\Facades\Filament;

beforeEach(function () {
    Filament::setCurrentPanel('admin');
});

it('allows admin users to access the admin panel', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/admin')
        ->assertSuccessful();
});

it('forbids non-admin users from accessing the admin panel', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin')
        ->assertForbidden();
});

it('redirects guests to the admin login page', function () {
    $this->get('/admin')
        ->assertRedirect();
});
