<?php

namespace App\Enums;

enum FrameworkStatus: string
{
    case Draft = 'draft';
    case Active = 'active';
    case Archived = 'archived';
}
