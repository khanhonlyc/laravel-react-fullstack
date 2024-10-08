<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Survey extends Model
{
    use HasSlug;
    use HasFactory;

    protected $fillable = ['title', 'description', 'expire_date', 'image', 'user_id', 'status', 'created_at', 'updated_at'];

public function getSlugOptions():SlugOptions
{
    return SlugOptions::create()
    ->generateSlugsFrom('title')
    ->saveSlugsTo('slug');
}

public function questions()
{
    return $this->hasMany(SurveyQuestion::class);
}
}
