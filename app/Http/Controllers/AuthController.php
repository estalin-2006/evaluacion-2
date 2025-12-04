<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // Método para el login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required', // Puede ser email o nombre de usuario
            'password' => 'required',
        ]);

        // Buscar el usuario por email o nombre de usuario
        $user = User::where('email', $request->email)
            ->orWhere('name', $request->email)
            ->first();

        // Verificar si el usuario existe y la contraseña es válida usando Hash::check
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Credenciales inválidas'], 401);
        }

        // Generar un token de autenticación
        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'token' => $token,
            'role' => $user->role,
        ]);
    }

    // Método para el registro
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:user,admin',
        ]);

        // Crear un nuevo usuario en la base de datos
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, // Guardar en texto plano (solo para pruebas)
            'role' => $request->role,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Usuario registrado exitosamente',
            'user' => $user,
        ]);
    }
}
