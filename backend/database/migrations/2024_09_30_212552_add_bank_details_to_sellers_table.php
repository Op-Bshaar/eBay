<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
        /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sellers', function (Blueprint $table) {
            $table->string('bank_name',100)->nullable();
            $table->string('bank_recepient_name',100)->nullable();
            $table->string('bank_account_number',50)->nullable();
            $table->string('iban',34)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sellers', function (Blueprint $table) {
            $table->dropColumn(['bank_name', 'bank_recepient_name', 'bank_account_number', 'iban']);
        });
    }
};
