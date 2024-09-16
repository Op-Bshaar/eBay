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
            // Drop the existing address column
            $table->dropColumn('address');
            
            // Add new address fields
            $table->string('country', 100);
            $table->string('city', 100);
            $table->string('district', 100);
            $table->string('street', 255);
            $table->string('postal_code', 20);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_requests', function (Blueprint $table) {
            // Rollback: remove the new fields and restore the single address column
            $table->dropColumn(['country', 'city', 'district', 'street', 'postal_code']);
            $table->string('address', 255)->nullable();
        });
    }
};
