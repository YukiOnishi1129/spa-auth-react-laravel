<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * 会員登録アクション
     * @param Request request
     * @return json
     */
    public function register(Request $request)
    {
        // バリデーション
        $this->validator($request->all())->validate();
        // パラメーターよりユーザー認証用のインスタンスを作成
        $user = $this->create($request->all());
        // ログイン処理
        $this->guard()->login($user);
        // Auth::login($user);
        return response()->json([
            'user' => $user,
            'message' => 'registration successful'
        ], 200);
    }

    /**
     * Auth::guard呼び出しメソッド
     * @return \Illuminate\Support\Facades\Auth
     */
    protected function guard()
    {
        return Auth::guard();
    }

    /**
     * 会員登録パラメータのバリデーション
     * @param array $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:4']
        ]);
    }

    /**
     * ユーザーインスタンス作成メソッド
     * @param array $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password'])
        ]);
    }

    /**
     * ログインアクション
     * @param Request request
     * @return json
     */
    public function login(Request $request)
    {
        $credential = $request->only('email', 'password');

        if (Auth::attempt($credential)) {
            // ログイン成功
            $authuser = auth()->user();
            return response()->json(['message' => 'Login successful'], 200);
        } else {
            return response()->json(['message' => 'invalid email or password'], 401);
        }
    }

    /**
     * ログアウトアクション
     * @return json
     */
    public function logout()
    {
        // Log::info('ログアウト');
        Auth::logout();
        return response()->json(['message' => 'Logged Out'], 200);
    }
}
