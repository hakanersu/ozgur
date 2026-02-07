<?php

namespace App\Http\Requests\ProcessingActivity;

use App\Enums\ResidualRisk;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDpiaRequest extends FormRequest
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
            'description' => ['nullable', 'string'],
            'necessity_and_proportionality' => ['nullable', 'string'],
            'potential_risk' => ['nullable', 'string'],
            'mitigations' => ['nullable', 'string'],
            'residual_risk' => ['nullable', 'string', Rule::enum(ResidualRisk::class)],
        ];
    }
}
