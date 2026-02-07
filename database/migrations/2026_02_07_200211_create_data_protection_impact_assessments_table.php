<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_protection_impact_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('processing_activity_id')->constrained()->cascadeOnDelete();
            $table->text('description')->nullable();
            $table->text('necessity_and_proportionality')->nullable();
            $table->text('potential_risk')->nullable();
            $table->text('mitigations')->nullable();
            $table->string('residual_risk')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_protection_impact_assessments');
    }
};
