<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\SurveyUpdateRequest;
use App\Models\SurveyQuestion;
use Illuminate\Http\Request;
use App\Http\Resources\SurveyResource;
use Illuminate\Support\Facades\File;
use App\Models\Survey;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use App\Enums\QuestionTypeEnum;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Support\Arr;
use Log;


class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        $user = $request->user();
        $resurt = Survey::where('user_id', $user->id)->orderBy('created_at', 'desc')->paginate(5);
        // return response()->json($resurt);
        return SurveyResource::collection($resurt);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreSurveyRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreSurveyRequest $request)
    {
        //
        $data = $request->only(['title', 'image', 'user_id', 'status', 'description', 'expire_date', 'questions']);
        // $data = $request->validate();
        // Log::info($data);
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }
        $survey = Survey::create($data);
        foreach ($data['questions'] as $question) {
            $question['survey_id'] = $survey->id;
            $this->createQuestion($question);
        }
        return new SurveyResource($survey);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function show(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorized action');
        }
        return new SurveyResource($survey);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  SurveyUpdateRequest  $request
     * @param  Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function update(SurveyUpdateRequest $request, Survey $survey)
    {
        // $data = $request->validate();
        $data = $request->only(['title', 'image', 'user_id', 'status', 'description', 'expire_date', 'questions']);
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            if ($survey->image) {
                $absolutePath = public_path($survey->image);
                File::delete($absolutePath);
            }
        }
        // Update surver in the database
        $survey->update($data);
        
        $existingIds = $survey->questions()->pluck('id')->toArray();
        // $existingIds = SurveyQuestion::where('survey_id', 31)->pluck('id')->toArray();
        // $newIds = Arr::pluck();
        $newIds = Arr::pluck($data['questions'], 'id');
        Log::info(">>>>>>>>>>>>>", $newIds);
        $toDelete = array_diff($existingIds, $newIds);
        Log::info(">>>>>>>>>>>>> delete", $toDelete);
        $toAdd = array_diff($newIds, $existingIds);
        Log::info(">>>>>>>>>>>>> toAdd", $toAdd);

        SurveyQuestion::destroy($toDelete);

        //create new questions
        foreach ($data['questions'] as $question) {
            if (in_array($question['id'], $toAdd)) {
                $question['survey_id'] = $survey->id;
                $this->createQuestion($question);
            }
        }

        //update existing questions
        $questionMap = collect($data['questions'])->keyBy('id');
        foreach ($survey->questions as $question) {
            if (isset($questionMap[$question->id])) {
                $this->updateQuestion($question, $questionMap[$question->id]);
            }
        }
        return new SurveyResource($survey);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Survey $survey
     * @return \Illuminate\Http\Response
     */
    public function destroy(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorized action');
        }
        if ($survey->image) {
            $absolutePath = public_path($survey->image);
            File::delete($absolutePath);
        }
        $survey->delete();
        return response('', 204);
    }

    private function saveImage($image)
    {
        // Check if image is valid base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            // Take out the base64 encoded text without mime type
            $image = substr($image, strpos($image, ',') + 1);
            // Get file extension
            $type = strtolower($type[1]); // jpg, png, gif

            // Check if file is an image
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('invalid image type');
            }
            $image = str_replace(' ', '+', $image);
            $image = base64_decode($image);

            if ($image === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match data URI with image data');
        }

        $dir = 'images/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;
        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }
        file_put_contents($relativePath, $image);

        return $relativePath;
    }
    private function createQuestion($data)
    {
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }
        $validator = Validator::make($data, [
            'question' => 'required|string',
            'type' => ['required', new Enum(QuestionTypeEnum::class)],
            'description' => 'nullable|string',
            'data' => 'present',
            'survey_id' => 'required|exists:App\Models\Survey,id'//'unique:App\Survey,id',
        ]);
        return SurveyQuestion::create($validator->validate());
    }

    /**
     * Update a question and return true or false
     * @param \App\Models\SurveyQuestion $question
     * @param mixed $data
     * @return bool
     * @throws \Illuminate\Validation\ValidationException
     * @author Zura Sekhniashvili <zurasekhniashvili@gmail.com>
     */
    private function updateQuestion(SurveyQuestion $question, $data)
    {
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }
        $validator = Validator::make($data, [
            'id' => 'exists:App\Models\SurveyQuestion,id',
            'question' => 'required|string',
            'type' => ['required', new Enum(QuestionTypeEnum::class)],
            'description' => 'nullable|string',
            'data' => 'present',
        ]);
        return $question->update($validator->validate());
    }

    private function getBySlug(Survey $survey){
        // if(!$survey->st)
        return response('getBySlug');
    }
}
