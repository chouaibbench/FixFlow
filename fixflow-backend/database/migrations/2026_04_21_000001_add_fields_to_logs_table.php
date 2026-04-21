<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('logs', function (Blueprint $table) {
            $table->foreignId('ticket_id')->nullable()->constrained('tikets')->nullOnDelete()->after('user_id');
            $table->foreignId('machine_id')->nullable()->constrained('machines')->nullOnDelete()->after('ticket_id');
            $table->string('action')->nullable()->after('machine_id'); // created, assigned, status_changed, resolved
        });
    }

    public function down(): void
    {
        Schema::table('logs', function (Blueprint $table) {
            $table->dropForeign(['ticket_id']);
            $table->dropForeign(['machine_id']);
            $table->dropColumn(['ticket_id', 'machine_id', 'action']);
        });
    }
};
