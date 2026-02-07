<?php

use App\Http\Controllers\MembershipController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\PublicTrustCenterController;
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
        return Inertia::render('dashboard', [
            'organizations' => request()->user()
                ->organizations()
                ->withCount('memberships')
                ->orderBy('name')
                ->get(),
        ]);
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

// Public Trust Center (no auth required)
Route::get('trust/{trustCenter:slug}', [PublicTrustCenterController::class, 'show'])->name('trust-center.public.show');
Route::post('trust/{trustCenter:slug}/request-access', [PublicTrustCenterController::class, 'requestAccess'])->name('trust-center.public.request-access');

require __DIR__.'/settings.php';
