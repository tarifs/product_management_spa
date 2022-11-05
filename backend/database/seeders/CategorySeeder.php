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
                'email' => 'food',
            ],
            [
                'name' => 'Vegetables',
                'email' => 'vegetables',
            ],
            [
                'name' => 'Frozen',
                'email' => 'frozen',
            ]
        ]);
    }
}
