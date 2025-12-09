<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();

            // Relación con usuario
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // Relación con producto
            $table->foreignId('product_id')
                  ->constrained('products')
                  ->onDelete('cascade');

            $table->timestamps();

            // Evitar duplicados: el usuario no puede dar favorito 2 veces al mismo producto
            $table->unique(['user_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
