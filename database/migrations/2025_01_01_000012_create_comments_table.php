<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();

            // Relación con usuario
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // Relación con producto
            $table->foreignId('product_id')
                  ->constrained('products')
                  ->onDelete('cascade');

            // Comentario
            $table->string('comment', 200);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
