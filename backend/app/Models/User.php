<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Auth\Notifications\ResetPassword;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable ,ResetPassword;

    protected $fillable = [
        'username',
        'email',
        'phone',
        'password',
        'is_verified',
        'verification_code',
    ];

    protected $hidden = [
        'password',
        'verification_code',
    ];
}
