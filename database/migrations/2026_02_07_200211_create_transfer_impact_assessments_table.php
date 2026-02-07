<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transfer_impact_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('processing_activity_id')->constrained()->cascadeOnDelete();
            $table->text('data_subjects')->nullable();
            $table->text('legal_mechanism')->nullable();
            $table->text('transfer')->nullable();
            $table->text('local_law_risk')->nullable();
            $table->text('supplementary_measures')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transfer_impact_assessments');
    }
};
