<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\OrderRequest;

class CancelOverdueOrders extends Command
{
    // The name and signature of the console command.
    protected $signature = 'orders:cancel-overdue';

    // The console command description.
    protected $description = 'Cancel unpaid orders that have exceeded the time limit';

    // Time limit for pending orders in minutes
    protected $timeLimitInMinutes = 30;

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Fetch all pending orders
        $orders = OrderRequest::where('status', 'pending')->get();

        foreach ($orders as $order) {
            // Cancel order if it exceeds the time limit
            $order->cancelIfOverdue($this->timeLimitInMinutes);
        }

        $this->info('Overdue orders have been processed.');
        return 0;
    }
}
