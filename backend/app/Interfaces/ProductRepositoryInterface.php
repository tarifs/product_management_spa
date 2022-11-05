<?php

namespace App\Interfaces;

interface ProductRepositoryInterface
{
    public function addProduct($request);
    public function getAllProducts();
    public function getProductDetails($slug);
    public function deleteProduct($slug);
}
