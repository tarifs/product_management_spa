<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $appends = ['category'];

    public function product_images() {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    public function product_attributes() {
        return $this->hasMany(ProductAttribute::class, 'product_id');
    }

    public function getCategoryAttribute() {
        $category_ids = json_decode($this->category_ids);
        return $categories = Category::whereIn('id', $category_ids)->get();
    }
}
