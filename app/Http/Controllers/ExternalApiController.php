<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ExternalApiController extends Controller
{
    /**
     * Fetch a random dog image from Dog CEO API.
     */
    public function getRandomDogImage()
    {
        $response = Http::get('https://dog.ceo/api/breeds/image/random');

        if ($response->failed()) {
            return response()->json(['error' => 'Unable to fetch data from Dog CEO API'], 500);
        }

        return response()->json($response->json());
    }
}