<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\ExternalApiController;
// ...existing code...

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/prueba', function() {
    return 'API funcionando';
});
Route::get('/weather', [WeatherController::class, 'getWeather']);
Route::get('/weather/open-meteo', [WeatherController::class, 'getWeatherFromOpenMeteo']);
Route::get('/external/dog-image', [ExternalApiController::class, 'getRandomDogImage']);


// Rutas CRUD de productos solo para admin
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::apiResource('products', App\Http\Controllers\ProductController::class);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return $request->user();
    });
    // Favoritos
    Route::get('/favorites', [App\Http\Controllers\FavoriteController::class, 'index']);
    Route::post('/favorites', [App\Http\Controllers\FavoriteController::class, 'store']);
    Route::delete('/favorites/{product_id}', [App\Http\Controllers\FavoriteController::class, 'destroy']);
});
