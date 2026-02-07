<?php

namespace App\Enums;

enum DocumentType: string
{
    case Other = 'other';
    case Isms = 'isms';
    case Policy = 'policy';
    case Procedure = 'procedure';
}
