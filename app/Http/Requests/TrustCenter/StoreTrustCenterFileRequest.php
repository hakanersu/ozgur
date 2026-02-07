<?php

namespace App\Http\Requests\TrustCenter;

use App\Enums\TrustCenterVisibility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTrustCenterFileRequest extends FormRequest
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
            'category' => ['nullable', 'string', 'max:255'],
            'file' => ['required', 'file', 'max:10240'],
            'visibility' => ['required', 'string', Rule::enum(TrustCenterVisibility::class)],
        ];
    }
}
