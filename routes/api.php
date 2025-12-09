<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

Route::post('/auth/register',[AuthController::class,'register']);
Route::post('/auth/login',[AuthController::class,'login']);

Route::middleware('auth:sanctum')->group(function(){
    Route::post('/auth/logout',[AuthController::class,'logout']);

    Route::get('/products',[ProductController::class,'index']);
    Route::get('/products/{id}',[ProductController::class,'show']);
    Route::post('/products',[ProductController::class,'store']);
    Route::put('/products/{id}',[ProductController::class,'update']);
    Route::delete('/products/{id}',[ProductController::class,'destroy']);

    Route::post('/products/{id}/favorito',[ProductController::class,'toggleFavorito']);
    Route::get('/products/{id}/comments',[ProductController::class,'getComments']);
    Route::post('/products/{id}/comments',[ProductController::class,'addComment']);

    // Ruta para API externa (proxy)
    Route::get('/quotes', function() {
    $response = Http::get('https://type.fit/api/quotes');
    if ($response->ok()) {
        return $response->json();
    }
    return response()->json(['error' => 'No se pudo obtener la frase'], 500);
});

});
