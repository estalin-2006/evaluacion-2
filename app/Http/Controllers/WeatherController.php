<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    /**
     * Fetch weather data from OpenWeather API.
     */
    public function getWeather(Request $request)
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
        ]);

        $lat = $request->input('lat');
        $lon = $request->input('lon');
        $apiKey = env('OPENWEATHER_API_KEY');

        $response = Http::get("https://api.openweathermap.org/data/3.0/onecall", [
            'lat' => $lat,
            'lon' => $lon,
            'exclude' => 'minutely,hourly,daily,alerts',
            'appid' => $apiKey,
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Unable to fetch weather data'], 500);
        }

        return response()->json($response->json());
    }

    /**
     * Fetch weather data from Open-Meteo API.
     */
    public function getWeatherFromOpenMeteo(Request $request)
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
        ]);

        $lat = $request->input('lat');
        $lon = $request->input('lon');

        $response = Http::get("https://api.open-meteo.com/v1/forecast", [
            'latitude' => $lat,
            'longitude' => $lon,
            'current_weather' => true,
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Unable to fetch weather data from Open-Meteo'], 500);
        }

        return response()->json($response->json());
    }
}