const payment = [
  {
    cd: "1002",
    tx: "RIMESSA DIRETTA VISTA FATTURA",
    ref: ["RIMESSA DIRETTA RICEVIMENTO FATTURA"],
  },
  {
    cd: "8030",
    tx: "BONIFICO 30GG DATA FATTURA",
    ref: [
      "BONIFICO BANCARIO FINE MESE FT",
      "RIMESSA DIRETTA 30 GG DT FT",
      "FINE MESE",
      "BONIFICO BANCARIO 30 GG.DT.FT.FM.",
    ],
  },
  {
    cd: "8060",
    tx: "BONIFICO 60GG DATA FATTURA",
    ref: ["RIM.DIRETTA 60 GG. DATA FT.", "BONIFICO BANCARIO 60 GG DT FT"],
  },
  {
    cd: "8090",
    tx: "BONIFICO 90GG DATA FATTURA",
    ref: ["R.D. 90 GG.DATA FATTURA"],
  },
  {
    cd: "2030",
    tx: "RIBA 30GG FM DATA FATTURA",
    ref: ["RI.BA.FINE MESE", "RI.BA. 30 GG.DF.FM."],
  },
  {
    cd: "2060",
    tx: "RIBA 60GG FM DATA FATTURA",
    ref: ["RICEVUTA BANCARIA 60 GG DT.FT.", "R.B. 60 GG."],
  },
  {
    cd: "2090",
    tx: "RIBA 90GG FM DATA FATTURA",
    ref: ["R.D. 90 GG.DATA FATTURA"],
  },
];

const specialPayment = [
  { ref: ["RIM.DIRETTA 30/60/90 GG."], nuoviCodici: ["8030", "8060", "8090"] },
  {
    ref: ["RIC.BANCARIA 30/60/90 GG DF FM"],
    nuoviCodici: ["2030", "2060", "2090"],
  },
  {
    ref: ["RIC BANC 30/60"],
    nuoviCodici: ["2030", "2060"],
  },
];
export { payment };
export { specialPayment };

const varietà = `
COME DA CONTRATTO
BONIFICO AL 10 GIORNO MESE SUCC.DT.FT.
BONIFICO VALUTA FISSA 15 CORRENTE MESE
RI.BA. AL 20 GIORNO DEL MESE SUCC.DT.FT.
RI.BA. AL 5 GIORNO DEL MESE SUCC.DT.FT.
`;
