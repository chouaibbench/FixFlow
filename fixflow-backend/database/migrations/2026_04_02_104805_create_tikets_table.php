<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tikets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('machine_id')->constrained()->onDelet('cascade');
            $table->foreingId('reported_by')->constrained('users')->onDelete('cascad');
            $table->foreingId('assinged_to')->nullable()->constrained('users')->nullOnDelete();
            $table->text('description');
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('meduim');
            $table->enum('status', ['pending', 'in-progress', 'resolved'])->default('pending');
            $table->string('photo_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tikets');
    }
};
