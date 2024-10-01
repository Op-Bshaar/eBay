<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddShippingInfoToOrderRequestItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_request_items', function (Blueprint $table) {
            $table->string('shipping_company', 100)->nullable()->after('status'); // Add a 'shipping_company' column
            $table->string('shipment_number', 100)->nullable()->after('shipping_company'); // Add a 'shipment_number' column
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('order_request_items', function (Blueprint $table) {
            $table->dropColumn('shipping_company');
            $table->dropColumn('shipment_number');
        });
    }
}
