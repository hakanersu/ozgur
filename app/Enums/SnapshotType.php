<?php

namespace App\Enums;

enum SnapshotType: string
{
    case Risks = 'risks';
    case Vendors = 'vendors';
    case Assets = 'assets';
    case ProcessingActivities = 'processing_activities';
}
