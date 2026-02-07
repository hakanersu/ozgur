<?php

namespace App\Http\Requests\Vendor;

use App\Enums\BusinessImpact;
use App\Enums\DataSensitivity;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVendorRiskAssessmentRequest extends FormRequest
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
            'expires_at' => ['nullable', 'date'],
            'data_sensitivity' => ['required', 'string', Rule::enum(DataSensitivity::class)],
            'business_impact' => ['required', 'string', Rule::enum(BusinessImpact::class)],
            'notes' => ['nullable', 'string'],
        ];
    }
}
