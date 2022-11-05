<?php

namespace App\Services\Utils;

use Exception;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class FileUploadService
{

    /**
     * uploadFile
     *
     * @param mixed $file
     * @param mixed $upload_path
     * @param mixed $delete_path
     * @return void
     */
    public function uploadFile($file, $upload_path = null, $delete_path = null)
    {
        try {
            // Upload image
            // Delete old file
            if ($delete_path) {
                $this->delete($delete_path);
            }
            // Upload new file
            return $this->upload($file, $upload_path);
        } catch (Exception $ex) {
            return null;
        }
    }

    /**
     * upload
     *
     * @param mixed $file
     * @param mixed $path
     * @param $thumbnail
     * @return void
     */
    public function upload($file, $path = 'others')
    {
        try {
            $name = time() . Str::random(60);
            $directory = storage_path("app/public/" . $path);
            !file_exists($directory) && mkdir($directory, 0777, true);
            Image::make($file)->encode('jpg', 10)->resize(null, 500, function($constraint) {
                $constraint->aspectRatio();
            })->save($directory . '/' . $name. '.' . 'jpg');
            return $name ?? '';
        } catch (\Exception $ex) {
            return '';
        }
    }

    /**
     * delete
     *
     * @param mixed $path
     * @return void
     */
    public function delete($path = '')
    {
        try {
            // Delete image form public directory
            $path = storage_path("app/public/" . $path);
            if (file_exists($path)) unlink($path);
        } catch (\Exception $ex) {
        }
    }
}
