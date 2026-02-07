<?php

use App\Models\TrustCenter;
use App\Models\TrustCenterAccess;

beforeEach(function () {
    $this->withoutVite();
});

test('active trust center is accessible publicly', function () {
    $trustCenter = TrustCenter::factory()->active()->create();

    $this->get(route('trust-center.public.show', $trustCenter->slug))
        ->assertOk();
});

test('inactive trust center returns 404', function () {
    $trustCenter = TrustCenter::factory()->create(['is_active' => false]);

    $this->get(route('trust-center.public.show', $trustCenter->slug))
        ->assertNotFound();
});

test('anyone can request access', function () {
    $trustCenter = TrustCenter::factory()->active()->create();

    $this->post(route('trust-center.public.request-access', $trustCenter->slug), [
        'email' => 'john@example.com',
        'name' => 'John Doe',
        'company' => 'Acme Inc',
    ])
        ->assertRedirect();

    expect(TrustCenterAccess::where('email', 'john@example.com')->first())->not->toBeNull();
});

test('access request requires email', function () {
    $trustCenter = TrustCenter::factory()->active()->create();

    $this->post(route('trust-center.public.request-access', $trustCenter->slug), [
        'email' => '',
        'name' => 'John Doe',
    ])
        ->assertSessionHasErrors('email');
});

test('access request requires name', function () {
    $trustCenter = TrustCenter::factory()->active()->create();

    $this->post(route('trust-center.public.request-access', $trustCenter->slug), [
        'email' => 'john@example.com',
        'name' => '',
    ])
        ->assertSessionHasErrors('name');
});
