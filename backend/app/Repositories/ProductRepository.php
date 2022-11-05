<?php

namespace App\Repositories;

use App\Interfaces\ProductRepositoryInterface;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\Utils\FileUploadService;
use Illuminate\Support\Str;

class ProductRepository implements ProductRepositoryInterface {

    protected FileUploadService $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    private function productImageUpload($product_id, $product_images) {
        foreach($product_images as $product_image) {
            $image_name = $this->fileUploadService->uploadFile($product_image, ProductImage::FILE_STORE_PATH);
            ProductImage::create([
                'product_id' => $product_id,
                'image' => $image_name
            ]);
        }

    }

    private function productAttributeSave($product_id, $sizes, $colors) {
//        $size_temp = [];
//        $color_temp = [];
//        $t = explode(" ", $sizes);
//        foreach($t as $s) {
//            return response()->json($s);
//
//            $size_temp[$s->key] = $s->value;
//        }
//        foreach($colors as $c) {
//            $color_temp[$c->key] = $c->value;
//        }
//        return response()->json(['s' => $size_temp, 'c' => $color_temp]);
//        foreach($size_temp as $key => $val) {
//            $size = $val;
//            $color = $color_temp[$key];
//        }
    }

    public function getAllProducts()
    {
        $products = [];
        $user = auth('sanctum')->user();
        if($user) {
            $products = Product::where('user_id', $user->id)->latest()->get();
        }
        return response()->json($products);
    }

    public function getProductDetails($slug)
    {
        $data = Product::with(['product_attributes', 'product_images'])->where('slug', $slug)->first();
        return response()->json($data);
    }

    public function deleteProduct($slug) {
        $product = Product::where('slug', $slug)->first();
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully.']);
    }

    public function addProduct($request) {
        $product = new Product();
        $product->user_id = $request->user_id;
        $product->name = $request->name;
        $product->slug = Str::slug($request->name);
        $product->price = $request->price;
        $product->category_ids = json_encode($request->category_ids);

        if($product->save()) {
            //product images
            $this->productImageUpload($product->id, $request->product_images);
            return response()->json([
                'status' => 'success',
                'message' => 'Product added successfully.'
            ]);
        }
    }
}
