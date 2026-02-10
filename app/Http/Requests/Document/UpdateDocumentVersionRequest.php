<?php

namespace App\Http\Requests\Document;

use App\Enums\DocumentClassification;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDocumentVersionRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'changelog' => ['nullable', 'string'],
            'classification' => ['required', 'string', Rule::enum(DocumentClassification::class)],
        ];
    }
}
