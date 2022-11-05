<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Products\ProductsController;
use App\Http\Controllers\Api\Category\CategoryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['as' => 'api.'], function () {
    Route::post('/login', [LoginController::class, 'login'])->name('login');
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout')->middleware('auth:sanctum');
    Route::post('/register', [RegisterController::class, 'register'])->name('register');
});


Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::apiResource('products', ProductsController::class);
    Route::get('/categories', [CategoryController::class, 'index']);
});
