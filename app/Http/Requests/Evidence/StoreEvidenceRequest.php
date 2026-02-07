<?php

namespace App\Http\Requests\Evidence;

use App\Enums\EvidenceState;
use App\Enums\EvidenceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEvidenceRequest extends FormRequest
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
            'type' => ['required', 'string', Rule::enum(EvidenceType::class)],
            'url' => ['nullable', 'required_if:type,link', 'url'],
            'file' => ['nullable', 'required_if:type,file', 'file', 'max:10240'],
            'state' => ['required', 'string', Rule::enum(EvidenceState::class)],
        ];
    }
}
