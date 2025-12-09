<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Listado público
    public function index()
    {
        return Product::all();
    }

    // Mostrar uno
    public function show($id)
    {
        return Product::findOrFail($id);
    }

    // Crear (solo admin)
    public function store(Request $request)
    {
        $request->validate([
            "name" => "required",
            "description" => "required",
            "price" => "required|numeric",
            "image_url" => "required|string"
        ]);

        $product = Product::create($request->all());

        return response()->json([
            "message" => "Producto creado correctamente",
            "product" => $product
        ]);
    }

    // Actualizar
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            "name" => "required",
            "description" => "required",
            "price" => "required|numeric",
            "image_url" => "required"
        ]);

        $product->update($request->all());

        return response()->json([
            "message" => "Producto actualizado",
            "product" => $product
        ]);
    }

    // Eliminar
    public function destroy($id)
    {
        Product::destroy($id);

        return response()->json(["message" => "Producto eliminado"]);
    }
}
