<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@test.com',
            'password' => bcrypt('123456'),
            'role' => 'Administrador'
        ]);

        User::factory(5)->create(); // usuarios random
    }
}
