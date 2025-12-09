<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Obtener los comentarios de un producto
     */
    public function getComments($product_id)
    {
        $comments = Comment::where('product_id', $product_id)
                           ->with('user:id,name') // Trae info del usuario (opcional)
                           ->orderBy('created_at', 'desc')
                           ->get();

        return response()->json($comments);
    }

    /**
     * Agregar un comentario a un producto
     */
    public function addComment(Request $request, $product_id)
    {
        // Validar contenido
        $request->validate([
            'content' => 'required|string|max:200'
        ]);

        $user = Auth::user();

        $comment = Comment::create([
            'user_id' => $user->id,
            'product_id' => $product_id,
            'comment' => $request->content, // coincide con la columna de la tabla
        ]);

        return response()->json([
            'message' => 'Comentario agregado correctamente',
            'comment' => $comment
        ], 201);
    }
}
