export interface Contact {
  contactName: string;
  email: string;
  fax: string;
  phone: string;
}

export interface IContactsReponse {
  data: Contact[];
}

export const APOContactsReponse: IContactsReponse = {
  data: [
    {
      contactName: "PPMSAPO User",
      email: "ppdms.apo.user@gmail.com",
      fax: "8008008007",
      phone: "8008008007",
    },
  ],
};

export interface FSCCode {
  code: string;
  description: string;
  longName: string;
  categoryCode: string;
}

export interface IFSCCodeReponse {
  data: FSCCode[];
}

export const FSCCodeReponse: IFSCCodeReponse = {
  data: [
    {
      code: "1005",
      description:
        "GUNS, PISTOLS, SHOTGUNS, RIFLES, FIREARM, WEAPON THROUGH 30 MM",
      longName:
        "1005 - GUNS, PISTOLS, SHOTGUNS, RIFLES, FIREARM, WEAPON THROUGH 30 MM",
      categoryCode: "26 - Miscellaneous",
    },
    {
      code: "1010",
      description:
        "GUNS, PISTOLS, RIFLES, SHOTGUNS, FIREARM, WEAPON 30 MM TO 75 MM",
      longName:
        "1010 - GUNS, PISTOLS, RIFLES, SHOTGUNS, FIREARM, WEAPON 30 MM TO 75 MM",
      categoryCode: "26 - Miscellaneous",
    },
    {
      code: "1510",
      description: "AIRCRAFT, FIXED WING",
      longName: "1510 - AIRCRAFT, FIXED WING",
      categoryCode: "2 - Aircraft",
    },
    {
      code: "1520",
      description: "AIRCRAFT, ROTARY WING",
      longName: "1520 - AIRCRAFT, ROTARY WING",
      categoryCode: "2 - Aircraft",
    },
    {
      code: "2310",
      description: "PASSENGER MOTOR VEHICLES, AUTO, CAR",
      longName: "2310 - PASSENGER MOTOR VEHICLES, AUTO, CAR",
      categoryCode: "4 - Automobiles",
    },
    {
      code: "2311",
      description: "CRASH TEST VEHICLES, CAR, AUTO",
      longName: "2311 - CRASH TEST VEHICLES, CAR, AUTO",
      categoryCode: "26 - Miscellaneous",
    },
    {
      code: "2312",
      description: "SALVAGE/SCRAP VEHICLES, AUTO, CAR",
      longName: "2312 - SALVAGE/SCRAP VEHICLES, AUTO, CAR",
      categoryCode: "26 - Miscellaneous",
    },

    {
      code: "2320",
      description: "TRUCKS AND TRACK TRACTORS, WHEELED",
      longName: "2320 - TRUCKS AND TRACK TRACTORS, WHEELED",
      categoryCode: "37 - Trucks, Trailers and Tractors",
    },
  ],
};
