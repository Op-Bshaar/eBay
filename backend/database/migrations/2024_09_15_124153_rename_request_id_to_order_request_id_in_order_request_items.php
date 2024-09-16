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
        Schema::table('order_request_items', function (Blueprint $table) {
            $table->renameColumn('request_id', 'order_request_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_request_items', function (Blueprint $table) {
            $table->renameColumn('order_request_id', 'request_id');
        });
    }
};
