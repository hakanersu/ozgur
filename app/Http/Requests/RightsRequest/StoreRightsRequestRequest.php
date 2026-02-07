<?php

namespace App\Http\Requests\RightsRequest;

use App\Enums\RightsRequestState;
use App\Enums\RightsRequestType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRightsRequestRequest extends FormRequest
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
            'request_type' => ['required', 'string', Rule::enum(RightsRequestType::class)],
            'request_state' => ['required', 'string', Rule::enum(RightsRequestState::class)],
            'data_subject' => ['nullable', 'string'],
            'contact' => ['nullable', 'string'],
            'details' => ['nullable', 'string'],
            'deadline' => ['nullable', 'date'],
            'action_taken' => ['nullable', 'string'],
        ];
    }
}
