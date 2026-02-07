<?php

namespace App\Enums;

enum ProcessingRole: string
{
    case Controller = 'controller';
    case Processor = 'processor';
}
