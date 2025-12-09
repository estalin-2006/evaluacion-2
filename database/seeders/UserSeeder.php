<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Crear un usuario de prueba con contraseña encriptada
        User::create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('123456') // aquí se encripta la contraseña
        ]);
    }
}
