<?php

namespace App\Enums;

enum TransferSafeguard: string
{
    case StandardContractualClauses = 'standard_contractual_clauses';
    case BindingCorporateRules = 'binding_corporate_rules';
    case AdequacyDecision = 'adequacy_decision';
    case Derogations = 'derogations';
    case CodesOfConduct = 'codes_of_conduct';
    case CertificationMechanisms = 'certification_mechanisms';
}
