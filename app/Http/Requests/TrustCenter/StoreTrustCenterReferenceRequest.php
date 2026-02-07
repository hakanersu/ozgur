<?php

namespace App\Http\Requests\TrustCenter;

use Illuminate\Foundation\Http\FormRequest;

class StoreTrustCenterReferenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'url' => ['nullable', 'url'],
            'logo_url' => ['nullable', 'url'],
            'rank' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
