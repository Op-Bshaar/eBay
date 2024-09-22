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
        Schema::table('sellers', function (Blueprint $table) {
            // Make the 'rating' column nullable and set its default value to null
            $table->integer('rating')->nullable()->default(null)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sellers', function (Blueprint $table) {
            // Revert the changes: remove nullable and default value, adjust as necessary
            $table->integer('rating')->nullable(false)->default(1)->change();
        });
    }
};
