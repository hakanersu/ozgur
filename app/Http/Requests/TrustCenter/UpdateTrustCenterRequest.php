<?php

namespace App\Http\Requests\TrustCenter;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTrustCenterRequest extends FormRequest
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
            'is_active' => ['sometimes', 'boolean'],
            'slug' => ['sometimes', 'string', 'max:255', 'alpha_dash'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'brand_color' => ['nullable', 'string', 'max:7'],
        ];
    }
}
