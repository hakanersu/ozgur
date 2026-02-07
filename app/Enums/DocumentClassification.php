<?php

namespace App\Enums;

enum DocumentClassification: string
{
    case Public = 'public';
    case Internal = 'internal';
    case Confidential = 'confidential';
    case Secret = 'secret';
}
