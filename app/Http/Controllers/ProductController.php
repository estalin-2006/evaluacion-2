<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Favorite;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        return Product::all();
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        $product->favorites_count = $product->favorites()->count();
        $product->comments = $product->comments()->with('user:id,name')->get();
        return $product;
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'img_url' => 'required|url' // URL de Firebase
        ]);

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'image_url' => $request->img_url
        ]);

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->only(['name','description','price']));
        
        if($request->hasFile('image')){
            $path = $request->file('image')->store('products','public');
            $product->image_url = Storage::url($path);
            $product->save();
        }

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message'=>'Producto eliminado']);
    }

    public function toggleFavorito($id)
    {
        $user = Auth::user();
        $fav = Favorite::where('user_id',$user->id)->where('product_id',$id)->first();

        if($fav){
            $fav->delete();
            return response()->json(['favorito'=>false]);
        } else {
            Favorite::create(['user_id'=>$user->id,'product_id'=>$id]);
            return response()->json(['favorito'=>true]);
        }
    }

    public function getComments($id)
    {
        return Comment::where('product_id',$id)->with('user:id,name')->get();
    }

    public function addComment(Request $request, $id)
    {
        $request->validate([
            'comment' => 'required|string|max:200'
        ]);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'product_id' => $id,
            'comment' => $request->comment
        ]);

        return response()->json($comment, 201);
    }
}
