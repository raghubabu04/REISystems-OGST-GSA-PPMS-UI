export const otherModeOfPayment = [
  {
    id: "otherModeOfPayment",
    value: "Other Mode Of Payment",
    isSelected: false,
  },
];

export  enum cardTypes{
  VISA="Visa",
  MASTER="Master",
  AMEX="American Express",
  DISCOVER="Discover",
  OTHER="Other"
}


export const cardTypeOptions = [
  {
    id: "visa",
    value: cardTypes.VISA,
  },
  {
    id: "master",
    value: cardTypes.MASTER,
  },
  {
    id: "americanExpress",
    value: cardTypes.AMEX,
  },
  {
    id: "discover",
    value: cardTypes.DISCOVER,
  },
  {
    id: "other",
    value: cardTypes.OTHER,
  },
];


export function formatContractNumber(contractNumber) {
  let formattedContractNumber;

  formattedContractNumber =
  contractNumber.substring(0, 1) +
    "-" +
    contractNumber.substring(1, 2) +
    "-" +
    contractNumber.substring(2, 5) +
    "-" +
    contractNumber.substring(5, 6) +
    "-" +
    contractNumber.substring(6, 8) +
    "-" +
    contractNumber.substring(8, 11);
  if (contractNumber.length > 11) {
    formattedContractNumber =
    formattedContractNumber + "-" + contractNumber.substring(11, contractNumber.length);
  }
  return formattedContractNumber;
}


