<?php

use App\Http\Controllers\AuditController;
use App\Http\Controllers\ControlController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentVersionController;
use App\Http\Controllers\EvidenceController;
use App\Http\Controllers\FrameworkController;
use App\Http\Controllers\MeasureController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\PeopleController;
use App\Http\Controllers\RiskController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\DataProtectionImpactAssessmentController;
use App\Http\Controllers\ProcessingActivityController;
use App\Http\Controllers\RightsRequestController;
use App\Http\Controllers\TransferImpactAssessmentController;
use App\Http\Controllers\VendorContactController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\VendorRiskAssessmentController;
use Illuminate\Support\Facades\Route;

// Compliance module routes, scoped under organizations/{organization}

Route::resource('frameworks', FrameworkController::class)->names('organizations.frameworks');
Route::resource('controls', ControlController::class)->names('organizations.controls');
Route::resource('measures', MeasureController::class)->names('organizations.measures');
Route::resource('risks', RiskController::class)->names('organizations.risks');
Route::resource('audits', AuditController::class)->names('organizations.audits');
Route::resource('documents', DocumentController::class)->names('organizations.documents');
Route::resource('vendors', VendorController::class)->names('organizations.vendors');
Route::resource('people', PeopleController::class)->names('organizations.people');
Route::resource('tasks', TaskController::class)->names('organizations.tasks');
Route::resource('meetings', MeetingController::class)->names('organizations.meetings');

Route::post('measures/{measure}/evidence', [EvidenceController::class, 'store'])->name('organizations.measures.evidence.store');
Route::delete('measures/{measure}/evidence/{evidence}', [EvidenceController::class, 'destroy'])->name('organizations.measures.evidence.destroy');

Route::post('documents/{document}/versions', [DocumentVersionController::class, 'store'])->name('organizations.documents.versions.store');
Route::post('documents/{document}/versions/{version}/publish', [DocumentVersionController::class, 'publish'])->name('organizations.documents.versions.publish');
Route::delete('documents/{document}/versions/{version}', [DocumentVersionController::class, 'destroy'])->name('organizations.documents.versions.destroy');

Route::post('vendors/{vendor}/contacts', [VendorContactController::class, 'store'])->name('organizations.vendors.contacts.store');
Route::delete('vendors/{vendor}/contacts/{contact}', [VendorContactController::class, 'destroy'])->name('organizations.vendors.contacts.destroy');

Route::post('vendors/{vendor}/risk-assessments', [VendorRiskAssessmentController::class, 'store'])->name('organizations.vendors.risk-assessments.store');
Route::delete('vendors/{vendor}/risk-assessments/{assessment}', [VendorRiskAssessmentController::class, 'destroy'])->name('organizations.vendors.risk-assessments.destroy');

Route::resource('processing-activities', ProcessingActivityController::class)->names('organizations.processing-activities');
Route::resource('rights-requests', RightsRequestController::class)->names('organizations.rights-requests');

Route::post('processing-activities/{processing_activity}/dpia', [DataProtectionImpactAssessmentController::class, 'store'])->name('organizations.processing-activities.dpia.store');
Route::delete('processing-activities/{processing_activity}/dpia/{dpia}', [DataProtectionImpactAssessmentController::class, 'destroy'])->name('organizations.processing-activities.dpia.destroy');

Route::post('processing-activities/{processing_activity}/tia', [TransferImpactAssessmentController::class, 'store'])->name('organizations.processing-activities.tia.store');
Route::delete('processing-activities/{processing_activity}/tia/{tia}', [TransferImpactAssessmentController::class, 'destroy'])->name('organizations.processing-activities.tia.destroy');
