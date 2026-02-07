<?php

namespace App\Enums;

enum BusinessImpact: string
{
    case Low = 'low';
    case Medium = 'medium';
    case High = 'high';
    case Critical = 'critical';
}
