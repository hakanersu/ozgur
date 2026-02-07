<?php

namespace App\Http\Requests\TrustCenter;

use App\Enums\TrustCenterAccessState;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTrustCenterAccessRequest extends FormRequest
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
            'state' => ['required', 'string', Rule::enum(TrustCenterAccessState::class)],
        ];
    }
}
