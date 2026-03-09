<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('compliance_frameworks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trust_center_id')->constrained()->cascadeOnDelete();
            $table->foreignId('framework_id')->constrained()->cascadeOnDelete();
            $table->integer('rank')->default(0);
            $table->string('visibility')->default('none'); // none, public
            $table->timestamps();

            $table->unique(['trust_center_id', 'framework_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('compliance_frameworks');
    }
};
