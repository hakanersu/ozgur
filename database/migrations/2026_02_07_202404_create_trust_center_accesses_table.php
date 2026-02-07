<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trust_center_accesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trust_center_id')->constrained()->cascadeOnDelete();
            $table->string('email');
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('state')->default('requested');
            $table->boolean('has_accepted_nda')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trust_center_accesses');
    }
};
