<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use Illuminate\Http\Request;
use Auth;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //
    public function index()
    {
        // return 6666;
    }
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);
        $token = $user->createToken('API_Token')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }
    public function login(LoginRequest $request)
    {
        $credentials = $request->only(['email', 'password']);
        // $remember = $credentials['remember'] ?? false;
        // unset($credentials['remember']);

        if (!Auth::attempt($credentials)) {
            return response([
                'error' => 'The Provided credentials are not correct'
            ], 422);
        }
        $user = Auth::user();
        $token = $user->createToken('API_Token')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }
    public function logout(Request $request)
    {
        $use = Auth::user();
        Log::info($use);
        //Revoke the token that was used to authenticate the current request
        $use->currentAccessToken()->delete();
        return response(['success' => true]);
    }
    public function getauth(Request $request)
    {
        $use = Auth::user();
        return response(['user' => $use]);
    }
}
