<?php

namespace App\Http\Requests\Document;

use App\Enums\DocumentClassification;
use App\Enums\DocumentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDocumentRequest extends FormRequest
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
            'document_type' => ['required', 'string', Rule::enum(DocumentType::class)],
            'classification' => ['required', 'string', Rule::enum(DocumentClassification::class)],
        ];
    }
}
