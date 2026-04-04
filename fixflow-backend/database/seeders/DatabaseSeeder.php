<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'worker@fixflow.com'], [
            'name'     => 'John Worker',
            'email'    => 'worker@fixflow.com',
            'password' => Hash::make('password123'),
            'role'     => 'worker',
        ]);

        User::updateOrCreate(['email' => 'tech@fixflow.com'], [
            'name'     => 'Mike Technician',
            'email'    => 'tech@fixflow.com',
            'password' => Hash::make('password123'),
            'role'     => 'technician',
        ]);
    }
}
