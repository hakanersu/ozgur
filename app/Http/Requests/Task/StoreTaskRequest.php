<?php

namespace App\Http\Requests\Task;

use App\Enums\TaskState;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
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
            'state' => ['required', 'string', Rule::enum(TaskState::class)],
            'deadline' => ['nullable', 'date'],
            'assigned_to_id' => ['nullable', 'exists:people,id'],
            'measure_id' => ['nullable', 'exists:measures,id'],
        ];
    }
}
