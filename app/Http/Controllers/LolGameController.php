<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LolGameController extends Controller
{
    public function index()
    {
        // Sample LoL game data
        $games = [
            [
                'id' => 1,
                'name' => 'Summoner\'s Rift Match',
                'description' => 'A classic 5v5 match on Summoner\'s Rift.',
                'duration' => '35:42',
                'mode' => 'Ranked Solo/Duo',
                'champion' => 'Ahri',
                'kills' => 8,
                'deaths' => 3,
                'assists' => 12,
                'result' => 'Victory',
                'image_url' => 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg'
            ],
            [
                'id' => 2,
                'name' => 'ARAM Showdown',
                'description' => 'All Random All Mid chaos.',
                'duration' => '18:15',
                'mode' => 'ARAM',
                'champion' => 'Jinx',
                'kills' => 15,
                'deaths' => 7,
                'assists' => 8,
                'result' => 'Defeat',
                'image_url' => 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg'
            ],
            [
                'id' => 3,
                'name' => 'Twisted Treeline Battle',
                'description' => '3v3 action on the Twisted Treeline.',
                'duration' => '22:30',
                'mode' => 'Ranked Flex',
                'champion' => 'Vi',
                'kills' => 5,
                'deaths' => 2,
                'assists' => 10,
                'result' => 'Victory',
                'image_url' => 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vi_0.jpg'
            ]
        ];

        return response()->json($games);
    }
}
