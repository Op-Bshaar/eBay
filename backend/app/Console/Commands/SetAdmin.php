<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class SetAdmin extends Command
{
    // The name and signature of the console command.
    protected $signature = 'user:set-admin {username}';

    // The console command description.
    protected $description = 'Set a user as admin by username';

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

        // Set user as admin
        $user->is_admin = true;
        $user->save();

        $this->info('User ' . $username . ' has been set as admin.');
        return 0;
    }
}