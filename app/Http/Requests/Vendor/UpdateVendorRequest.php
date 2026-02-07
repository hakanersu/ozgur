<?php

namespace App\Http\Requests\Vendor;

use App\Enums\VendorCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVendorRequest extends FormRequest
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
            'description' => ['nullable', 'string'],
            'category' => ['required', 'string', Rule::enum(VendorCategory::class)],
            'legal_name' => ['nullable', 'string', 'max:255'],
            'headquarter_address' => ['nullable', 'string', 'max:255'],
            'website_url' => ['nullable', 'url'],
            'privacy_policy_url' => ['nullable', 'url'],
            'sla_url' => ['nullable', 'url'],
            'dpa_url' => ['nullable', 'url'],
            'status_page_url' => ['nullable', 'url'],
            'security_page_url' => ['nullable', 'url'],
            'certifications' => ['nullable', 'array'],
            'certifications.*' => ['string'],
            'countries' => ['nullable', 'array'],
            'countries.*' => ['string', 'max:3'],
        ];
    }
}
