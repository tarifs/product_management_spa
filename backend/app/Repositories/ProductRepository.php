<?php

namespace App\Repositories;

use App\Interfaces\ProductRepositoryInterface;
use App\Models\Product;
use App\Models\ProductAttribute;
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

    private function productAttributeSave($product_id, $attributes) {
        foreach(json_decode($attributes, true) as $attribute) {
            ProductAttribute::create([
                'product_id' => $product_id,
                'size' => $attribute['size'],
                'color' => $attribute['color'],
            ]);

        }
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
        try {
            $product = new Product();
            $product->user_id = $request->user_id;
            $product->name = $request->name;
            $product->slug = Str::slug($request->name);
            $product->price = $request->price;
            $product->category_ids = json_encode($request->category_ids);

            if($product->save()) {
                //product attributes
                $this->productAttributeSave($product->id, $request->product_attributes);
                //product images
                $this->productImageUpload($product->id, $request->product_images);
                return response()->json([
                    'status' => 'success',
                    'message' => 'Product added successfully.'
                ]);
            }
        }catch(\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ]);
        }
    }
}
