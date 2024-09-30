<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class UnsetAdmin extends Command
{
    // The name and signature of the console command.
    protected $signature = 'user:unset-admin {username}';

    // The console command description.
    protected $description = 'Unset a user as admin by username';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $username = $this->argument('username');

        // Find the user by username
        $user = User::where('username', $username)->first();

        if (!$user) {
            $this->error('User not found.');
            return 1;
        }

        // Unset user as admin
        $user->is_admin = false;
        $user->save();

        $this->info('User ' . $username . ' has been unset as admin.');
        return 0;
    }
}
