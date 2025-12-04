<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\Product;

class FavoriteController extends Controller
{
    // Obtener favoritos del usuario autenticado
    public function index(Request $request)
    {
        $user = $request->user();
        $favorites = Favorite::where('user_id', $user->id)->with('product')->get();
        return response()->json($favorites);
    }

    // Marcar producto como favorito
    public function store(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);
        $favorite = Favorite::firstOrCreate([
            'user_id' => $user->id,
            'product_id' => $request->product_id,
        ]);
        return response()->json($favorite, 201);
    }

    // Quitar producto de favoritos
    public function destroy(Request $request, $product_id)
    {
        $user = $request->user();
        $deleted = Favorite::where('user_id', $user->id)
            ->where('product_id', $product_id)
            ->delete();
        return response()->json(['deleted' => $deleted > 0]);
    }
}
