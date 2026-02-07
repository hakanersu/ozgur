<?php

use App\Http\Requests\Document\StoreDocumentRequest;
use Illuminate\Support\Facades\Validator;

function validateDocument(array $data): \Illuminate\Validation\Validator
{
    return Validator::make($data, (new StoreDocumentRequest)->rules());
}

test('store document request passes with valid data', function () {
    $validator = validateDocument([
        'title' => 'Security Policy',
        'document_type' => 'policy',
        'classification' => 'internal',
    ]);

    expect($validator->passes())->toBeTrue();
});

test('store document request requires title', function () {
    $validator = validateDocument([
        'document_type' => 'policy',
        'classification' => 'internal',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('title'))->toBeTrue();
});

test('store document request requires document type', function () {
    $validator = validateDocument([
        'title' => 'Security Policy',
        'classification' => 'internal',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('document_type'))->toBeTrue();
});

test('store document request requires classification', function () {
    $validator = validateDocument([
        'title' => 'Security Policy',
        'document_type' => 'policy',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('classification'))->toBeTrue();
});

test('store document request rejects invalid document type', function () {
    $validator = validateDocument([
        'title' => 'Security Policy',
        'document_type' => 'invalid',
        'classification' => 'internal',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('document_type'))->toBeTrue();
});

test('store document request rejects invalid classification', function () {
    $validator = validateDocument([
        'title' => 'Security Policy',
        'document_type' => 'policy',
        'classification' => 'invalid',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('classification'))->toBeTrue();
});

test('store document request rejects title exceeding max length', function () {
    $validator = validateDocument([
        'title' => str_repeat('a', 256),
        'document_type' => 'policy',
        'classification' => 'internal',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('title'))->toBeTrue();
});
