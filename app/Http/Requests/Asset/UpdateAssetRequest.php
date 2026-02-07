<?php

namespace App\Http\Requests\Asset;

use App\Enums\AssetType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssetRequest extends FormRequest
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
            'amount' => ['required', 'integer', 'min:1'],
            'owner_id' => ['nullable', 'integer', 'exists:people,id'],
            'asset_type' => ['required', 'string', Rule::enum(AssetType::class)],
            'data_types_stored' => ['nullable', 'string'],
            'vendor_ids' => ['nullable', 'array'],
            'vendor_ids.*' => ['integer', 'exists:vendors,id'],
        ];
    }
}
