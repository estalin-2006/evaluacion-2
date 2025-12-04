<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Define the routes for the application.
     */
   public function boot(): void
{
    $this->routes(function () {
        // Cargar rutas API
        Route::prefix('api')
             ->middleware('api')
             ->group(base_path('routes/api.php'));

        // Cargar rutas web
        Route::middleware('web')
             ->group(base_path('routes/web.php'));
    });
}

}
