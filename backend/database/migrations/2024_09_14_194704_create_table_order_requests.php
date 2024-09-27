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
        Schema::create('order_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('first_name'); // Add first_name column
            $table->string('last_name');  // Add last_name column
            $table->string('phone')->nullable();
            $table->string('country', 100);
            $table->string('city', 100);
            $table->string('district', 100);
            $table->string('street', 255);
            $table->string('postal_code', 20);
            $table->decimal('total_price',8,2);
            $table->decimal('paid_amount',8,2)->default(0);
            $table->string('status',30)->default('pending');
            $table->string('gateway_payment_id')->nullable(); 
            $table->dateTime('link_generated_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_requests');
    }
};
