<?php

use App\Filament\Resources\UserResource\Pages\CreateUser;
use App\Filament\Resources\UserResource\Pages\EditUser;
use App\Filament\Resources\UserResource\Pages\ListUsers;
use App\Models\User;
use Filament\Facades\Filament;

use function Pest\Livewire\livewire;

beforeEach(function () {
    Filament::setCurrentPanel('admin');
    $this->actingAs(User::factory()->admin()->create());
});

it('can list users', function () {
    $users = User::factory()->count(3)->create();

    livewire(ListUsers::class)
        ->assertOk()
        ->assertCanSeeTableRecords($users);
});

it('can render the create page', function () {
    livewire(CreateUser::class)
        ->assertOk();
});

it('can create a user', function () {
    $newUser = User::factory()->make();

    livewire(CreateUser::class)
        ->fillForm([
            'name' => $newUser->name,
            'email' => $newUser->email,
            'password' => 'password',
            'is_admin' => false,
            'locale' => 'en',
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $this->assertDatabaseHas(User::class, [
        'name' => $newUser->name,
        'email' => $newUser->email,
    ]);
});

it('can render the edit page', function () {
    $user = User::factory()->create();

    livewire(EditUser::class, ['record' => $user->getRouteKey()])
        ->assertOk();
});

it('can update a user', function () {
    $user = User::factory()->create();
    $newData = User::factory()->make();

    livewire(EditUser::class, ['record' => $user->getRouteKey()])
        ->fillForm([
            'name' => $newData->name,
            'email' => $newData->email,
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    $this->assertDatabaseHas(User::class, [
        'id' => $user->id,
        'name' => $newData->name,
        'email' => $newData->email,
    ]);
});

it('validates required fields on create', function () {
    livewire(CreateUser::class)
        ->fillForm([
            'name' => null,
            'email' => null,
            'password' => null,
        ])
        ->call('create')
        ->assertHasFormErrors(['name' => 'required', 'email' => 'required', 'password' => 'required']);
});
