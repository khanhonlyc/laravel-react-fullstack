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
        return 6666;
    }
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
        // return response(['user' => 'admin', 'token' => '123']);
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
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }
    // public function login(LoginRequest $request)
    // {
    //     if (Auth::attempt([
    //             'email' => $request->email, 
    //             'password' => $request->password
    //         ])) { 
    //         $authUser = Auth::user(); 
    //         // $success['token'] =  $authUser->createToken('MyAuthApp')->plainTextToken; 
    //         // $success['name'] =  $authUser->name;
    //         return response($authUser);
    //         // return $this->apiResponseService->responseSuccess($success, 'User signed in');
    //     } else { 
    //         return response(123);
    //         // return $this->apiResponseService->responseError('Unauthorised.', ['error' => 'Unauthorised'], 401);
    //     } 
    // }
    public function logout(Request $request)
    {

    }
}
