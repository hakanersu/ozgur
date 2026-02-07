<?php

namespace App\Http\Requests\ProcessingActivity;

use Illuminate\Foundation\Http\FormRequest;

class StoreTiaRequest extends FormRequest
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
            'data_subjects' => ['nullable', 'string'],
            'legal_mechanism' => ['nullable', 'string'],
            'transfer' => ['nullable', 'string'],
            'local_law_risk' => ['nullable', 'string'],
            'supplementary_measures' => ['nullable', 'string'],
        ];
    }
}
