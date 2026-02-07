<?php

use App\Http\Controllers\MembershipController;
use App\Http\Controllers\OrganizationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('organizations', OrganizationController::class);

    Route::prefix('organizations/{organization}')
        ->middleware(\App\Http\Middleware\EnsureOrganization::class)
        ->group(function () {
            Route::resource('members', MembershipController::class)
                ->only(['index', 'store', 'update', 'destroy'])
                ->names('organizations.members');

            require __DIR__.'/compliance.php';
        });
});

require __DIR__.'/settings.php';
