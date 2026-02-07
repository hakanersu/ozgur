<?php

namespace App\Http\Requests\ProcessingActivity;

use App\Enums\AssessmentNeeded;
use App\Enums\LawfulBasis;
use App\Enums\ProcessingRole;
use App\Enums\SpecialOrCriminalData;
use App\Enums\TransferSafeguard;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProcessingActivityRequest extends FormRequest
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
            'purpose' => ['nullable', 'string', 'max:255'],
            'data_subject_category' => ['nullable', 'string', 'max:255'],
            'personal_data_category' => ['nullable', 'string', 'max:255'],
            'special_or_criminal_data' => ['required', 'string', Rule::enum(SpecialOrCriminalData::class)],
            'consent_evidence_link' => ['nullable', 'string', 'max:2048'],
            'lawful_basis' => ['required', 'string', Rule::enum(LawfulBasis::class)],
            'recipients' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'international_transfers' => ['required', 'boolean'],
            'transfer_safeguards' => ['nullable', 'string', Rule::enum(TransferSafeguard::class)],
            'retention_period' => ['nullable', 'string', 'max:255'],
            'security_measures' => ['nullable', 'string'],
            'dpia_needed' => ['required', 'string', Rule::enum(AssessmentNeeded::class)],
            'tia_needed' => ['required', 'string', Rule::enum(AssessmentNeeded::class)],
            'last_review_date' => ['nullable', 'date'],
            'next_review_date' => ['nullable', 'date'],
            'role' => ['required', 'string', Rule::enum(ProcessingRole::class)],
            'data_protection_officer_id' => ['nullable', 'exists:people,id'],
        ];
    }
}
