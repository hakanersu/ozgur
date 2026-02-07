<?php

namespace App\Enums;

enum RightsRequestType: string
{
    case Access = 'access';
    case Deletion = 'deletion';
    case Portability = 'portability';
}
