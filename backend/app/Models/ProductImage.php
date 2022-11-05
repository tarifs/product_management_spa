<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;
    const FILE_STORE_PATH = 'product/images';

    protected $fillable = ['product_id', 'image'];
    protected $appends = ['image_url'];


    public function getImageUrlAttribute()
    {
        if($this->image) {
            return asset('storage/' . self::FILE_STORE_PATH .'/'.$this->image.'.jpg');
        }
    }
}
