<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category')->default('other');
            $table->string('legal_name')->nullable();
            $table->string('headquarter_address')->nullable();
            $table->string('website_url')->nullable();
            $table->string('privacy_policy_url')->nullable();
            $table->string('sla_url')->nullable();
            $table->string('dpa_url')->nullable();
            $table->string('status_page_url')->nullable();
            $table->string('security_page_url')->nullable();
            $table->json('certifications')->nullable();
            $table->json('countries')->nullable();
            $table->timestamps();

            $table->index('organization_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
