<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Admin
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(["message" => "Acceso denegado"], 403);
        }

        return $next($request);
    }
}
