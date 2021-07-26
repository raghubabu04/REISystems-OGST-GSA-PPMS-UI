export const AllocationsResponseMocked = [
  {
    transferControlNumber: "9920249894",
    requestStatus: "REQUESTED",
    propertyAACId: "285A72",
    requestedDate: "2020-10-16",
    allocatedDate: null,
    transferDate: null,
    requestedBy: "ppdms.extpr.user@gmail.com",
    noOfICNs: 1,
    city: "CHICAGO",
    state: "IL",
    zip: 60606,
    excessReleaseDate: null,
    surplusReleaseDate: "11/06/2020",
    priority: "",
    region: "6",
    isSrd: true,
    agencyBureau: {
      code: "2804",
      longName:
        "Social Security Administration                                                                      ",
      isInternalAgency: false,
    },
    noOfAllocatedICNs: 0,
  },
  {
    transferControlNumber: "9920419406",
    requestStatus: "REQUESTED",
    propertyAACId: "123159",
    requestedDate: "2020-10-16",
    allocatedDate: null,
    transferDate: null,
    requestedBy: "ppdms.apo.user@gmail.com",
    noOfICNs: 1,
    city: "LEXINGTON",
    state: "KY",
    zip: 40511,
    excessReleaseDate: "10/31/2020",
    surplusReleaseDate: null,
    priority: "",
    region: "8",
    isSrd: false,
    agencyBureau: {
      code: "1210",
      longName:
        "National Institute of Food and Agriculture                                                          ",
      isInternalAgency: true,
    },
    noOfAllocatedICNs: 0,
  },
  {
    transferControlNumber: "9920317633",
    requestStatus: "REQUESTED",
    propertyAACId: "123159",
    requestedDate: "2020-10-16",
    allocatedDate: null,
    transferDate: null,
    requestedBy: "ppdms.sm.user@gmail.com",
    noOfICNs: 1,
    city: "LEXINGTON",
    state: "KY",
    zip: 40511,
    excessReleaseDate: "10/31/2020",
    surplusReleaseDate: null,
    priority: "AL -DR 4419 Tornados     ",
    region: "8",
    isSrd: false,
    agencyBureau: {
      code: "1210",
      longName:
        "National Institute of Food and Agriculture                                                          ",
      isInternalAgency: true,
    },
    noOfAllocatedICNs: 0,
  },
  {
    transferControlNumber: "9920680580",
    requestStatus: "REQUESTED",
    propertyAACId: "123159",
    requestedDate: "2020-10-16",
    allocatedDate: null,
    transferDate: null,
    requestedBy: "ppdms.apo.user@gmail.com",
    noOfICNs: 1,
    city: "LEXINGTON",
    state: "KY",
    zip: 40511,
    excessReleaseDate: "10/31/2020",
    surplusReleaseDate: null,
    priority: "",
    region: "4",
    isSrd: false,
    agencyBureau: {
      code: "1210",
      longName:
        "National Institute of Food and Agriculture                                                          ",
      isInternalAgency: true,
    },
    noOfAllocatedICNs: 0,
  },
  {
    transferControlNumber: "9920083080",
    requestStatus: "REQUESTED",
    propertyAACId: "123159",
    requestedDate: "2020-10-16",
    allocatedDate: null,
    transferDate: null,
    requestedBy: "ppdms.apo.user@gmail.com",
    noOfICNs: 1,
    city: "LEXINGTON",
    state: "KY",
    zip: 40511,
    excessReleaseDate: "10/31/2020",
    surplusReleaseDate: null,
    priority: "",
    region: "4",
    isSrd: false,
    agencyBureau: {
      code: "1210",
      longName: "National Institute of Food and Agriculture",
      isInternalAgency: true,
    },
    noOfAllocatedICNs: 0,
  },
];

export const ApproveTransferOrdersResponseMocked = {
  currentPageNumber: 1,
  currentPageSize: 10,
  totalElements: 12,
  totalPages: 2,

  allocationDTOS: [
    {
      agencyBureau: {
        code: "1210",
        isInternalAgency: true,
        longName: "National Institute of Food and Agriculture",
      },
      allocatedDate: "2020-11-10",
      city: "LEXINGTON",
      excessReleaseDate: null,
      isSrd: true,
      noOfAllocatedICNs: 1,
      noOfDeniedICNs: 0,
      noOfICNs: 1,
      priority: "CA - DR 4382 Wildfires   ",
      propertyAACId: "123159",
      region: "4",
      requestStatus: "Allocation Confirmed",
      requestedBy: "ppdms.if.user@gmail.com",
      requestedDate: "2020-11-05",
      state: "KY",
      surplusReleaseDate: "11/27/2020",
      totalOAC: 600,
      transferControlNumber: "9920832793",
      transferDate: null,
      zip: 40511,
    },
    {
      agencyBureau: {
        code: "1210",
        isInternalAgency: true,
        longName: "National Institute of Food and Agriculture",
      },
      allocatedDate: null,
      city: "MOSCOW",
      excessReleaseDate: null,
      isSrd: true,
      noOfAllocatedICNs: 1,
      noOfDeniedICNs: 0,
      noOfICNs: 1,
      priority: "AR - DR 4441 Storms      ",
      propertyAACId: "123159",
      region: "8",
      requestStatus: "Allocation Confirmed",
      requestedBy: "ppdms.if.user@gmail.com",
      requestedDate: "2020-11-05",
      state: "ID",
      surplusReleaseDate: "12/01/2020",
      totalOAC: 300,
      transferControlNumber: "9920571258",
      transferDate: null,
      zip: 83843,
    },
    {
      agencyBureau: {
        code: "1210",
        isInternalAgency: true,
        longName: "National Institute of Food and Agriculture",
      },
      allocatedDate: null,
      city: "MOSCOW",
      excessReleaseDate: null,
      isSrd: true,
      noOfAllocatedICNs: 1,
      noOfDeniedICNs: 0,
      noOfICNs: 1,
      priority: "AL -DR 4419 Tornados     ",
      propertyAACId: "123159",
      region: "8",
      requestStatus: "Allocation Confirmed",
      requestedBy: "ppdms.nuo.user@gmail.com",
      requestedDate: "2020-11-10",
      state: "ID",
      surplusReleaseDate: "12/01/2020",
      totalOAC: 300,
      transferControlNumber: "9920703370",
      transferDate: null,
      zip: 83843,
    },
    {
      agencyBureau: {
        code: "4757",
        isInternalAgency: false,
        longName: "Federal Supply Service, Personal Property Centers",
      },
      allocatedDate: null,
      city: "SELMA",
      excessReleaseDate: null,
      isSrd: true,
      noOfAllocatedICNs: 2,
      noOfDeniedICNs: 0,
      noOfICNs: 2,
      priority: "",
      propertyAACId: "4745EA",
      region: "3",
      requestStatus: "Allocation Confirmed",
      requestedBy: "ppdms.md.sasp.admn@gmail.com",
      requestedDate: "2020-11-05",
      state: "AL",
      surplusReleaseDate: "11/10/2020",
      totalOAC: 2000,
      transferControlNumber: "MD20719205",
      transferDate: null,
      zip: 36703,
    },
    {
      agencyBureau: {
        code: "4757",
        isInternalAgency: false,
        longName: "Federal Supply Service, Personal Property Centers",
      },
      city: "RICHLAND",
      excessReleaseDate: null,
      isSrd: true,
      noOfAllocatedICNs: 1,
      noOfDeniedICNs: 0,
      noOfICNs: 1,
      priority: "",
      propertyAACId: "473292",
      region: "9",
      requestStatus: "Allocation Confirmed",
      requestedBy: "ppdms.md.sasp.admn@gmail.com",
      requestedDate: "2020-11-05",
      state: "WA",
      surplusReleaseDate: "11/10/2020",
      totalOAC: 1111,
      transferControlNumber: "MD20847123",
      transferDate: null,
      zip: 99352,
    },
    {
      agencyBureau: {
        code: "4757",
        isInternalAgency: false,
        longName: "Federal Supply Service, Personal Property Centers",
      },
      city: "SELMA",
      excessReleaseDate: null,
      isSrd: true,
      noOfAllocatedICNs: 1,
      noOfDeniedICNs: 1,
      noOfICNs: 2,
      priority: "",
      propertyAACId: "4745EA",
      region: "3",
      requestStatus: "Allocation Confirmed",
      requestedBy: "ppdms.md.sasp.admn@gmail.com",
      requestedDate: "2020-11-05",
      state: "AL",
      surplusReleaseDate: "11/10/2020",
      totalOAC: 1000,
      transferControlNumber: "MD20687536",
      transferDate: null,
      zip: 36703,
    },
    {
      agencyBureau: {
        code: "4757",
        isInternalAgency: false,
        longName: "Federal Supply Service, Personal Property Centers",
      },
      excessReleaseDate: null,
      isSrd: true,
      noOfAllocatedICNs: 1,
      noOfDeniedICNs: 0,
      noOfICNs: 1,
      priority: "",
      propertyAACId: "4745EA",
      region: "3",
      requestStatus: "Allocation Confirmed",
      requestedBy: "ppdms.md.sasp.admn@gmail.com",
      requestedDate: "2020-11-05",
      state: "AL",
      surplusReleaseDate: "11/10/2020",
      totalOAC: 1000,
      transferControlNumber: "MD20569043",
      transferDate: null,
      zip: 36703,
    },
    {
      agencyBureau: {
        code: "4757",
        isInternalAgency: false,
        longName: "Federal Supply Service, Personal Property Centers",
      },
      allocatedDate: null,
      city: "RICHLAND",
      excessReleaseDate: null,
      isSrd: true,
      noOfAllocatedICNs: 1,
      noOfDeniedICNs: 0,
      noOfICNs: 1,
      priority: "",
      propertyAACId: "473292",
      region: "9",
      requestStatus: "Allocation Confirmed",
      requestedBy: "ppdms.md.sasp.admn@gmail.com",
      requestedDate: "2020-11-05",
      state: "WA",
      surplusReleaseDate: "11/10/2020",
      totalOAC: 111,
      transferControlNumber: "MD20438794",
      transferDate: null,
      zip: 99352,
    },
    {
      agencyBureau: {
        code: "4757",
        isInternalAgency: false,
        longName: "Federal Supply Service, Personal Property Centers",
      },
      allocatedDate: null,
      city: "SELMA",
      excessReleaseDate: null,
      isSrd: true,
      noOfAllocatedICNs: 1,
      noOfDeniedICNs: 0,
      noOfICNs: 1,
      priority: "AL -DR 4419 Tornados     ",
      propertyAACId: "4745EA",
      region: "3",
      requestStatus: "Allocation Confirmed",
      requestedBy: "ppdms.sm.user@gmail.com",
      requestedDate: "2020-11-05",
      state: "AL",
      surplusReleaseDate: "11/10/2020",
      totalOAC: 2000,
      transferControlNumber: "9920041661",
      transferDate: null,
      zip: 36703,
    },
    {
      agencyBureau: {
        code: "1210",
        isInternalAgency: true,
        longName: "National Institute of Food and Agriculture",
      },
      allocatedDate: null,
      city: "LEXINGTON",
      excessReleaseDate: "11/20/2020",
      isSrd: false,
      noOfAllocatedICNs: 1,
      noOfDeniedICNs: 0,
      noOfICNs: 1,
      priority: "CA- EM 3415 Earthquakes  ",
      propertyAACId: "123159",
      region: "4",
      requestStatus: "Allocation Confirmed",
      requestedBy: "ppdms.if.user@gmail.com",
      requestedDate: "2020-11-05",
      state: "KY",
      surplusReleaseDate: null,
      totalOAC: 200,
      transferControlNumber: "9920737529",
      transferDate: null,
      zip: 40511,
    },
    // {
    //   agencyBureau: {
    //     code: "1210",
    //     isInternalAgency: true,
    //     longName: "National Institute of Food and Agriculture",
    //   },
    //   allocatedDate: null,
    //   city: "LEXINGTON",
    //   excessReleaseDate: "11/20/2020",
    //   isSrd: false,
    //   noOfAllocatedICNs: 1,
    //   noOfDeniedICNs: 0,
    //   noOfICNs: 1,
    //   priority: "CA - DR 4344 Wildfires   ",
    //   propertyAACId: "123159",
    //   region: "4",
    //   requestStatus: "Allocation Confirmed",
    //   requestedBy: "ppdms.if.user@gmail.com",
    //   requestedDate: "2020-11-05",
    //   state: "KY",
    //   surplusReleaseDate: null,
    //   totalOAC: 9092091020,
    //   transferControlNumber: "9920974259",
    //   transferDate: null,
    //   zip: 40511,
    // },
    // {
    //   agencyBureau: {
    //     code: "1210",
    //     isInternalAgency: true,
    //     longName: "National Institute of Food and Agriculture",
    //   },
    //   allocatedDate: null,
    //   city: "CLANTON",
    //   excessReleaseDate: "11/20/2020",
    //   isSrd: false,
    //   noOfAllocatedICNs: 1,
    //   noOfDeniedICNs: 0,
    //   noOfICNs: 1,
    //   priority: "",
    //   propertyAACId: "123159",
    //   region: "3",
    //   requestStatus: "Allocation Confirmed",
    //   requestedBy: "ppdms.if.user@gmail.com",
    //   requestedDate: "2020-11-05",
    //   state: "AL",
    //   surplusReleaseDate: null,
    //   totalOAC: 2000,
    //   transferControlNumber: "9920967108",
    //   transferDate: null,
    //   zip: 35045,
    // },
  ],
};

export const searchCriteriaMocked = {
  apoEmail: "",
  apoFirstName: "",
  apoLastName: "",
  priority: "",
  region: "",
  requestStatus: [],
  requestedAACId: "",
  state: "",
  transferControlNumber: "",
};

export const AllocationsApproveTransferOrdersStateMocked = {
  tcnItems: ApproveTransferOrdersResponseMocked.allocationDTOS,
  totalRows: ApproveTransferOrdersResponseMocked.totalElements,
  isLoading: false,
  currentPage: ApproveTransferOrdersResponseMocked.currentPageNumber,
  error: "",
};

export const TCNDetailsMocked = [
  {
    transferControlNumber: "9820334244",
    tcnStatus: "PENDING_ALLOCATION",
    location: "CHICAGO,IL,60606",
    priority: "AL - EM 3394 Nate        ",
    justification: null,
    excessReleaseDate: null,
    surplusReleaseDate: "11/09/2020",
    propertyAACId: "285A72",
    region: "9",
    requestedDate: "2020-10-20",
    tcnTotalItems: 2,
    agencyBureau: {
      code: "2804",
      longName:
        "Social Security Administration                                                                      ",
      isInternalAgency: false,
    },
    userProfileAndShippingDetails: {
      shippingDTO: {
        id: null,
        firstName: "PPMS SM",
        lastName: "User",
        middleName: "",
        emailAddress: "ppdms.sm.user@gmail.com",
        phoneNumber: 8008008007,
        phoneExt: "",
        faxNumber: null,
        zipCode: null,
        aac: "4745EA",
        agencyBureauCd: "4757",
        locationState: null,
        password: null,
        approvingOfficialEmail: null,
        approvingOfficial: {
          id: null,
          firstName: "PPMSAO2",
          lastName: "User",
          middleName: "",
          emailAddress: "ppdms.ao2.user@gmail.com",
          phoneNumber: 8008008016,
          phoneExt: "",
          faxNumber: null,
          zipCode: null,
          aac: null,
          agencyBureauCd: "4757",
          locationState: null,
          password: null,
          approvingOfficialEmail: null,
          approvingOfficial: null,
          shippingAddressLine1: null,
          shippingAddressLine2: null,
          shippingAddressLine3: null,
          shippingAddressCity: null,
          shippingAddressStateCode: null,
          shippingAddressZip: null,
          shippingAddressZip2: null,
          instructions: null,
        },
        shippingAddressLine1: "500 C St NW",
        shippingAddressLine2: "St. 102",
        shippingAddressLine3: "",
        shippingAddressCity: "Washington ",
        shippingAddressStateCode: "DC",
        shippingAddressZip: 20121,
        shippingAddressZip2: null,
        instructions: null,
      },
      shippingAttn: null,
      shippingAddress: {
        createdAt: "2020-10-20T16:57:50.000+0000",
        updatedAt: "2020-10-20T16:57:50.000+0000",
        createdBy: "ppdms.pa.user@gmail.com",
        updatedBy: "ppdms.pa.user@gmail.com",
        addressId: 268,
        line1: "1800 F St",
        line2: "St. 100",
        line3: "",
        city: "Washington ",
        stateCode: "DC",
        zip: 20121,
        zip2: null,
        overseasZip: null,
        isDeleted: false,
        instructions: null,
      },
    },
    requestItems: [
      {
        requestItem: {
          propertyId: 14,
          cartCount: 1,
          itemControlNumber: "285A720293air1K",
          agencyBureau: "2804",
          itemName: "testing FSC1550",
          presignedUrl: "",
          quantityAvailable: 1,
          quantityRequested: 0,
          quantityAvailableForAllocation: 0,
          quantityAllocated: 1,
          dateAvailable: null,
          releaseDate: null,
          activity: null,
          cartId: null,
          unitOfIssue: "EA",
          itemStatus: "SUBMITTED",
          location: "CHICAGO,IL,60606",
          conditionCode: "1",
          originalAcquisitionCost: 1000.0,
          categoryName: "Aircraft",
          demilitarizationCode: "A",
          reimbursementRequired: "N",
          fairMarketValue: 800.0,
          federalSupplyClass: "1550",
          federalSupplyClassDescription: "DRONES",
          city: "CHICAGO",
          state: "IL",
          zip1: 60606,
          zip2: null,
          priority: "AL - EM 3394 Nate        ",
          priorityCode: "D0L",
          justification: null,
          surplusReleaseDate: "11/09/2020",
          requestedItemId: 14,
        },
      },
      {
        requestItem: {
          propertyId: 15,
          cartCount: 1,
          itemControlNumber: "285A720293air2K",
          agencyBureau: "2804",
          itemName: "testing1550",
          presignedUrl: "",
          quantityAvailable: 2,
          quantityRequested: 0,
          quantityAvailableForAllocation: 1,
          quantityAllocated: 1,
          dateAvailable: null,
          releaseDate: null,
          activity: null,
          cartId: null,
          unitOfIssue: "EA",
          itemStatus: "SUBMITTED",
          location: "CHICAGO,IL,60606",
          conditionCode: "1",
          originalAcquisitionCost: 1000.0,
          categoryName: "Aircraft",
          demilitarizationCode: "A",
          reimbursementRequired: "N",
          fairMarketValue: 600.0,
          federalSupplyClass: "1550",
          federalSupplyClassDescription: "DRONES",
          city: "CHICAGO",
          state: "IL",
          zip1: 60606,
          zip2: null,
          priority: "AL - EM 3394 Nate        ",
          priorityCode: "D0L",
          justification: null,
          surplusReleaseDate: "11/09/2020",
          requestedItemId: 15,
        },
      },
    ],
    allUploadedItems: {
      image: [],
      documents: [
        {
          controlNumber: "9820334244",
          uri: "tcn-uploads/9820334244/9.doc",
          name: "PPDMS-984.doc",
          itemType: "application/msword",
          description: null,
          attachmentOrder: 1,
          virusScanStatus: "CLEAN",
          id: 9,
          size: 14625,
          preSignedURI: null,
          type: null,
          documentType: "Other",
          documentTypeDescription: "Testing this again",
          valid: true,
          invalid: false,
        },
        {
          controlNumber: "9820334244",
          uri: "tcn-uploads/9820334244/10.xlsx",
          name: "PI2 - Sprint 1 task assignments for Falcon and Raven.xlsx",
          itemType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          description: null,
          attachmentOrder: 2,
          virusScanStatus: "CLEAN",
          id: 10,
          size: 20862,
          preSignedURI: null,
          type: null,
          documentType: null,
          documentTypeDescription: null,
          valid: true,
          invalid: false,
        },
      ],
    },
    showConfirmButton: true,
    icnStatusMap: {
      "285A720293air2K": "ALLOCATED",
      "285A720293air1K": "ALLOCATED",
    },
  },
];

export const uploadedFilesMocked = [
  {
    attachmentOrder: 1,
    controlNumber: "MD21976170",
    createdBy: "ppdms.sm.user@gmail.com",
    description: "SF123Form",
    documentType: "System Generated",
    documentTypeDescription: null,
    downloadUrl: "tcn-uploads/MD21976170/3.pdf",
    id: 3,
    invalid: false,
    itemType: "application/pdf",
    modifiedDate: "2021-01-05 16:03:57",
    name: "SF123Form_01-05-2021.pdf",
    placeholder: "SF123Form_01-05-2021.pdf",
    preSignedURI: null,
    priority: 1,
    protected: false,
    size: 855766,
    type: "application/pdf",
    uri: "tcn-uploads/MD21976170/3.pdf",
    valid: true,
    virusScanStatus: "CLEAN",
  },
  {
    attachmentOrder: 2,
    controlNumber: "MD21957231",
    createdBy: "ppdms.sm.user@gmail.com",
    description: null,
    documentType: "Special Donee Request Justification",
    documentTypeDescription: "",
    downloadUrl: "tcn-uploads/MD21957231/223.xls",
    id: 223,
    invalid: false,
    itemType: "application/vnd.ms-excel",
    modifiedDate: "2021-01-06 16:44:10",
    name: "FILED and VALIDATIONS .xls",
    placeholder: "FILED and VALIDATIONS .xls",
    preSignedURI: null,
    priority: 2,
    protected: false,
    size: 76540,
    type: "application/vnd.ms-excel",
    uri: "tcn-uploads/MD21957231/223.xls",
    valid: true,
    virusScanStatus: "CLEAN",
  },
];
