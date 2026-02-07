<?php

use App\Http\Requests\Vendor\StoreVendorRequest;
use Illuminate\Support\Facades\Validator;

function validateVendor(array $data): \Illuminate\Validation\Validator
{
    return Validator::make($data, (new StoreVendorRequest)->rules());
}

test('store vendor request passes with valid data', function () {
    $validator = validateVendor([
        'name' => 'Acme Corp',
        'category' => 'cloud_provider',
    ]);

    expect($validator->passes())->toBeTrue();
});

test('store vendor request passes with all fields', function () {
    $validator = validateVendor([
        'name' => 'Acme Corp',
        'description' => 'Cloud infrastructure provider',
        'category' => 'cloud_provider',
        'legal_name' => 'Acme Corporation Inc.',
        'headquarter_address' => '123 Main St, San Francisco, CA',
        'website_url' => 'https://acme.example.com',
        'privacy_policy_url' => 'https://acme.example.com/privacy',
        'sla_url' => 'https://acme.example.com/sla',
        'dpa_url' => 'https://acme.example.com/dpa',
        'status_page_url' => 'https://status.acme.example.com',
        'security_page_url' => 'https://acme.example.com/security',
        'certifications' => ['SOC2', 'ISO27001'],
        'countries' => ['US', 'DE', 'GB'],
    ]);

    expect($validator->passes())->toBeTrue();
});

test('store vendor request requires name', function () {
    $validator = validateVendor([
        'category' => 'cloud_provider',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('name'))->toBeTrue();
});

test('store vendor request requires category', function () {
    $validator = validateVendor([
        'name' => 'Acme Corp',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('category'))->toBeTrue();
});

test('store vendor request rejects invalid category', function () {
    $validator = validateVendor([
        'name' => 'Acme Corp',
        'category' => 'invalid_category',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('category'))->toBeTrue();
});

test('store vendor request rejects invalid url fields', function (string $field) {
    $validator = validateVendor([
        'name' => 'Acme Corp',
        'category' => 'cloud_provider',
        $field => 'not-a-url',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has($field))->toBeTrue();
})->with([
    'website_url',
    'privacy_policy_url',
    'sla_url',
    'dpa_url',
    'status_page_url',
    'security_page_url',
]);

test('store vendor request rejects country codes exceeding max length', function () {
    $validator = validateVendor([
        'name' => 'Acme Corp',
        'category' => 'cloud_provider',
        'countries' => ['TOOLONG'],
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('countries.0'))->toBeTrue();
});

test('store vendor request rejects name exceeding max length', function () {
    $validator = validateVendor([
        'name' => str_repeat('a', 256),
        'category' => 'cloud_provider',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('name'))->toBeTrue();
});
