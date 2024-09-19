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
        Schema::table('order_requests', function (Blueprint $table) {
            $table->dropColumn('gateway_payment_id');

            // Add the 'link_generated' boolean field (or use another name)
            $table->boolean('link_generated')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_requests', function (Blueprint $table) {
             // Add the 'gateway_payment_id' field back
             $table->string('gateway_payment_id');

             // Remove the 'link_generated' field
             $table->dropColumn('link_generated');
        });
    }
};
