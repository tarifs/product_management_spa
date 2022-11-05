<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('categories')->truncate();
        DB::table('categories')->insert([
            [
                'name' => 'Food',
                'slug' => 'food',
            ],
            [
                'name' => 'Vegetables',
                'slug' => 'vegetables',
            ],
            [
                'name' => 'Frozen',
                'slug' => 'frozen',
            ]
        ]);
    }
}
