<?php

namespace App\Enums;

enum VendorCategory: string
{
    case Analytics = 'analytics';
    case CloudMonitoring = 'cloud_monitoring';
    case CloudProvider = 'cloud_provider';
    case Collaboration = 'collaboration';
    case CustomerSupport = 'customer_support';
    case DataStorage = 'data_storage';
    case DocumentManagement = 'document_management';
    case EmployeeManagement = 'employee_management';
    case Engineering = 'engineering';
    case Finance = 'finance';
    case IdentityProvider = 'identity_provider';
    case It = 'it';
    case Marketing = 'marketing';
    case OfficeOperations = 'office_operations';
    case Other = 'other';
    case PasswordManagement = 'password_management';
    case ProductAndDesign = 'product_and_design';
    case ProfessionalServices = 'professional_services';
    case Recruiting = 'recruiting';
    case Sales = 'sales';
    case Security = 'security';
    case VersionControl = 'version_control';
}
