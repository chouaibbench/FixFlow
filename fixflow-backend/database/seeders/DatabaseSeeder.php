<?php

namespace Database\Seeders;

use App\Models\Machine;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'worker@fixflow.com'], [
            'name'     => 'J Worker',
            'email'    => 'worker@fixflow.com',
            'password' => Hash::make('password123'),
            'role'     => 'worker',
        ]);

        User::updateOrCreate(['email' => 'tech@fixflow.com'], [
            'name'     => 'M Technician',
            'email'    => 'tech@fixflow.com',
            'password' => Hash::make('password123'),
            'role'     => 'technician',
        ]);

        User::updateOrCreate(['email' => 'admin@fixflow.com'], [
            'name'     => 'Admin',
            'email'    => 'admin@fixflow.com',
            'password' => Hash::make('password123'),
            'role'     => 'admin',
            'phone'    => '+212 656 819 828',
        ]);

        $machines = [
            ['name' => 'CNC Machine A1',      'location' => 'Workshop Floor 1', 'last_maintenance' => '2026-03-01'],
            ['name' => 'Hydraulic Press B2',  'location' => 'Workshop Floor 2', 'last_maintenance' => '2026-02-15'],
            ['name' => 'Conveyor Belt C3',     'location' => 'Assembly Line 1',  'last_maintenance' => '2026-01-20'],
            ['name' => 'Welding Robot D4',     'location' => 'Assembly Line 2',  'last_maintenance' => '2026-03-10'],
            ['name' => 'Lathe Machine E5',     'location' => 'Workshop Floor 1', 'last_maintenance' => null],
        ];

        foreach ($machines as $machine) {
            Machine::updateOrCreate(['name' => $machine['name']], $machine);
        }
    }
}
