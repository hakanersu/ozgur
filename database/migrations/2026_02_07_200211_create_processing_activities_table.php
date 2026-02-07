<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('processing_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('purpose')->nullable();
            $table->string('data_subject_category')->nullable();
            $table->string('personal_data_category')->nullable();
            $table->string('special_or_criminal_data');
            $table->string('consent_evidence_link', 2048)->nullable();
            $table->string('lawful_basis');
            $table->text('recipients')->nullable();
            $table->string('location')->nullable();
            $table->boolean('international_transfers')->default(false);
            $table->string('transfer_safeguards')->nullable();
            $table->string('retention_period')->nullable();
            $table->text('security_measures')->nullable();
            $table->string('dpia_needed');
            $table->string('tia_needed');
            $table->timestamp('last_review_date')->nullable();
            $table->timestamp('next_review_date')->nullable();
            $table->string('role');
            $table->foreignId('data_protection_officer_id')->nullable()->constrained('people')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('processing_activities');
    }
};
