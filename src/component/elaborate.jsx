import React, { useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { useEffect } from "react";
import { tabella_di_raccordo as tabella_di_raccordo_data } from "../data/tabella-di-raccordo";
import { fatture } from "../data/fatture2023";
// import { incassi } from "../data/primaNotaAgosto";
import { payment, specialPayment } from "../data/payment";
import { docType } from "../data/docType";
import { incassiAnno as incassi } from "../data/Prima Nota 20231128";
import { raccordoBpoint } from "../data/raccordoAnagCliBpoint";
import { comeDaContratto } from "../data/fatture-da-contratto";

const Elaborate = () => {
  const tabRaccordoBpoint = raccordoBpoint.split("\n").map((e) => {
    return {
      codBpoint: e.split(";")[0],
      Partita_IVA: e.split(";")[2],
      Codice_fiscale: e.split(";")[1],
    };
  });
  // console.log("tabRaccordoBpoint", tabRaccordoBpoint);

  const tracciatoDestinazione = [];

  const createDestRow = (e) => {
    tracciatoDestinazione.push({
      tipoDoc: e.tipoDoc,
      dataDoc: e.dataDoc,
      testoTestata: e.testoTestata,
      importo: e.importo,
      attribuzione: e.attribuzione,
      modalitàPagamento: e.modalitàPagamento,
    });
  };
  // testoTestata = codice cliente in b.point
  //attribuzione = numero documento originario

  const tabRaccordoAnagrafiche = [];
  //   console.log(tabella_di_raccordo_data);
  const tabellaRows = tabella_di_raccordo_data.split("\n");
  //   console.log(tabellaRows);

  for (const row of tabellaRows) {
    const splittedRow = row.split(";");
    tabRaccordoAnagrafiche.push({
      Cod_WKInfo: splittedRow[0],
      IDKey: splittedRow[1],
      IDProd: splittedRow[2],
      codice_SAP: splittedRow[3],
      Partita_IVA: splittedRow[4],
      Codice_fiscale: splittedRow[5],
      Ragione_sociale: splittedRow[6],
    });
  }
  // console.log("tab raccordo anagrafiche", tabRaccordoAnagrafiche);
  //fine tabella di raccordo anagrafiche
  const fattureElaborate = [];
  const fattureRows = fatture.split("\n");
  //   console.log(fattureRows);
  // tabella fatture
  let dataFattureRow = {};
  let i = 0;
  for (const fattureRow of fattureRows) {
    try {
      if (fattureRow.slice(0, 4)) {
        const numRigha = fattureRow.slice(0, 4);
        switch (numRigha) {
          case "0055":
            dataFattureRow.Tipo_documento = fattureRow.slice(5).trim();
            break;
          case "0067":
            dataFattureRow.Data_documento = fattureRow.slice(5).trim();
            break;
          case "0054":
            dataFattureRow.modalitàPagamento = fattureRow.slice(5).trim();
            break;
          case "0038":
            dataFattureRow.Partita_IVA = fattureRow.slice(5).trim();
            break;
          case "0037":
            dataFattureRow.Codice_fiscale = fattureRow.slice(5).trim();
            break;
          case "0047":
            dataFattureRow.Ragione_sociale = fattureRow.slice(5).trim();
            break;
          case "0051":
            dataFattureRow.attribuzione = fattureRow.slice(5).trim();
            break;
          case "0156":
            dataFattureRow.totDocumento = fattureRow.slice(5).trim();
            break;
          case "0081":
            dataFattureRow.imponibile = fattureRow.slice(5).trim();
            break;
          case "0124":
            dataFattureRow.iva = fattureRow.slice(5).trim();
            break;
          case "0036":
            dataFattureRow.Città = fattureRow.slice(5).trim();
            break;
          case "0033":
            dataFattureRow.cap = fattureRow.slice(5).trim();
            break;
          case "0032":
            dataFattureRow.indirizzo = fattureRow.slice(5).trim();
            break;
          default:
            break;
        }
        if (numRigha === "0156") {
          if (dataFattureRow.totDocumento !== "0,00") {
            fattureElaborate.push(dataFattureRow);
          }
          dataFattureRow = {};
        }
      }
    } catch (error) {
      //   console.log(i);
      //   console.log(error);
    }
  }

  // console.log("fatture elaborate", fattureElaborate);

  //fine aggiunta codice sap
  const incassiRows = incassi.split("\n");
  // console.log("incassi row", incassiRow);
  //importo i pagamenti
  const incassiElaborati = [];
  let dataIncassi = {};
  for (const incassoRow of incassiRows) {
    const incassoRowSplittato = incassoRow.split(";");
    if (incassoRowSplittato[12] === "00203") {
      if (incassoRowSplittato[8] !== "") {
        dataIncassi = {
          ...dataIncassi,
          testoTestata: incassoRowSplittato[8],
          RagioneSocile: incassoRowSplittato[9],
          Codice_fiscale: incassoRowSplittato[10],
          Partita_IVA: incassoRowSplittato[11],
        };
      }
      dataIncassi = {
        ...dataIncassi,
        Movimento: incassoRowSplittato[0],
        Registro: incassoRowSplittato[1],
        Sezionale: incassoRowSplittato[2],
        Data_Operazione: incassoRowSplittato[3],
        Protocollo: incassoRowSplittato[4],
        Data_documento: incassoRowSplittato[5],
        Numero_Documento: incassoRowSplittato[6],
        Totale_Documento: incassoRowSplittato[7],
        Causale: incassoRowSplittato[12],
        Descrizione_Causale: incassoRowSplittato[13],
        Annotazioni: incassoRowSplittato[14],
        Cdc: incassoRowSplittato[15],
        Codice_Conto: incassoRowSplittato[16],
        Quarto_Livello: incassoRowSplittato[17],
        Descricione_Conto: incassoRowSplittato[18],
        Dare: incassoRowSplittato[19],
        Avere: incassoRowSplittato[20],
        Imponibile: incassoRowSplittato[21],
        Codice_iva: incassoRowSplittato[22],
        Imposta: incassoRowSplittato[23],
        Merci: incassoRowSplittato[24],
        Bdr: incassoRowSplittato[25],
        Detrazione: incassoRowSplittato[26],
        Importo_Detraibile: incassoRowSplittato[27],
        Importo_Indetraibile: incassoRowSplittato[28],
        Causale_iva: incassoRowSplittato[29],
        Descrizione_Causale_Iva: incassoRowSplittato[30],
        Causale_Analitica: incassoRowSplittato[31],
        Descrizione_Analitica: incassoRowSplittato[32],
      };
      incassiElaborati.push(dataIncassi);
    }
  }
  let aperture = [];
  let dataAperture = {};
  for (const incassoRow of incassiRows) {
    const incassoRowSplittato = incassoRow.split(";");
    if (
      incassoRowSplittato[12] === "00241" ||
      incassoRowSplittato[12] === "00242"
    ) {
      dataAperture = {
        ...dataIncassi,
        testoTestata: incassoRowSplittato[8],
        RagioneSocile: incassoRowSplittato[9],
        Codice_fiscale: incassoRowSplittato[10],
        Partita_IVA: incassoRowSplittato[11],
        Movimento: incassoRowSplittato[0],
        Registro: incassoRowSplittato[1],
        Sezionale: incassoRowSplittato[2],
        Data_Operazione: incassoRowSplittato[3],
        Protocollo: incassoRowSplittato[4],
        Data_documento: incassoRowSplittato[5],
        Numero_Documento: incassoRowSplittato[6],
        Totale_Documento: incassoRowSplittato[7],
        Causale: incassoRowSplittato[12],
        Descrizione_Causale: incassoRowSplittato[13],
        Annotazioni: incassoRowSplittato[14],
        Cdc: incassoRowSplittato[15],
        Codice_Conto: incassoRowSplittato[16],
        Quarto_Livello: incassoRowSplittato[17],
        Descricione_Conto: incassoRowSplittato[18],
        Dare: incassoRowSplittato[19],
        Avere: incassoRowSplittato[20],
        Imponibile: incassoRowSplittato[21],
        Codice_iva: incassoRowSplittato[22],
        Imposta: incassoRowSplittato[23],
        Merci: incassoRowSplittato[24],
        Bdr: incassoRowSplittato[25],
        Detrazione: incassoRowSplittato[26],
        Importo_Detraibile: incassoRowSplittato[27],
        Importo_Indetraibile: incassoRowSplittato[28],
        Causale_iva: incassoRowSplittato[29],
        Descrizione_Causale_Iva: incassoRowSplittato[30],
        Causale_Analitica: incassoRowSplittato[31],
        Descrizione_Analitica: incassoRowSplittato[32],
      };
      aperture.push(dataAperture);
    }
  }
  aperture = aperture.map((e) => {
    let codSapPI = tabRaccordoAnagrafiche.filter(
      (anagrafica) => anagrafica.Partita_IVA === e.Partita_IVA
    );
    let codSapCF = tabRaccordoAnagrafiche.filter(
      (anagrafica) => anagrafica.Codice_fiscale === e.Codice_fiscale
    );
    let codBpointPI = tabRaccordoBpoint.filter(
      (anagrafica) =>
        Number(anagrafica.Partita_IVA.trim()) === Number(e.Partita_IVA.trim())
    );
    let codBpointCF = tabRaccordoBpoint.filter(
      (anagrafica) =>
        Number(anagrafica.Codice_fiscale.trim()) ===
        Number(e.Codice_fiscale.trim())
    );

    // console.log("filtered", codSapPI);
    let dataRet = { ...e };
    if (codSapPI[0]) {
      //   console.log(codSap[0].codice_SAP);
      dataRet = {
        ...dataRet,
        codice_SAP: codSapPI[0].codice_SAP,
        //testoTestata: codSapPI[0].Cod_WKInfo,
      };
    } else if (codSapCF[0]) {
      dataRet = {
        ...dataRet,
        codice_SAP: codSapCF[0].codice_SAP,
        //testoTestata: codSapCF[0].Cod_WKInfo,
      };
    } else {
      dataRet = { ...dataRet, codice_SAP: "" };
    }
    if (codBpointPI[0]) {
      //   console.log(codSap[0].codice_SAP);
      dataRet = {
        ...dataRet,
        testoTestata: codBpointPI[0].codBpoint,
        //testoTestata: codSapPI[0].Cod_WKInfo,
      };
    } else if (codBpointCF[0]) {
      dataRet = {
        ...dataRet,
        testoTestata: codBpointCF[0].codBpoint,
        //testoTestata: codSapCF[0].Cod_WKInfo,
      };
    } else {
      dataRet = {
        ...dataRet,
        testoTestata: "",
      };
    }
    return dataRet;
  });
  // console.log("aperture", aperture);

  // insoluti #################################################################### INIZIO INSOLUTI
  let insoluti = [];
  let dataInsoluti = {};
  for (const incassoRow of incassiRows) {
    const incassoRowSplittato = incassoRow.split(";");
    if (incassoRowSplittato[12] === "00201") {
      dataInsoluti = {
        ...dataIncassi,
        testoTestata: incassoRowSplittato[8],
        RagioneSocile: incassoRowSplittato[9],
        Codice_fiscale: incassoRowSplittato[10],
        Partita_IVA: incassoRowSplittato[11],
        Movimento: incassoRowSplittato[0],
        Registro: incassoRowSplittato[1],
        Sezionale: incassoRowSplittato[2],
        Data_Operazione: incassoRowSplittato[3],
        Protocollo: incassoRowSplittato[4],
        Data_documento: incassoRowSplittato[5],
        Numero_Documento: incassoRowSplittato[6],
        Totale_Documento: incassoRowSplittato[7],
        Causale: incassoRowSplittato[12],
        Descrizione_Causale: incassoRowSplittato[13],
        Annotazioni: incassoRowSplittato[14],
        Cdc: incassoRowSplittato[15],
        Codice_Conto: incassoRowSplittato[16],
        Quarto_Livello: incassoRowSplittato[17],
        Descricione_Conto: incassoRowSplittato[18],
        Dare: Number(
          incassoRowSplittato[19].replace(".", "").replace(",", ".")
        ),
        Avere: incassoRowSplittato[20],
        Imponibile: incassoRowSplittato[21],
        Codice_iva: incassoRowSplittato[22],
        Imposta: incassoRowSplittato[23],
        Merci: incassoRowSplittato[24],
        Bdr: incassoRowSplittato[25],
        Detrazione: incassoRowSplittato[26],
        Importo_Detraibile: incassoRowSplittato[27],
        Importo_Indetraibile: incassoRowSplittato[28],
        Causale_iva: incassoRowSplittato[29],
        Descrizione_Causale_Iva: incassoRowSplittato[30],
        Causale_Analitica: incassoRowSplittato[31],
        Descrizione_Analitica: incassoRowSplittato[32],
      };
      insoluti.push(dataInsoluti);
    }
  }

  insoluti = insoluti.map((e) => {
    let codSapPI = tabRaccordoAnagrafiche.filter(
      (anagrafica) => anagrafica.Partita_IVA === e.Partita_IVA
    );
    let codSapCF = tabRaccordoAnagrafiche.filter(
      (anagrafica) => anagrafica.Codice_fiscale === e.Codice_fiscale
    );
    // console.log("filtered", codSapPI);

    let codBpointPI = tabRaccordoBpoint.filter(
      (anagrafica) =>
        Number(anagrafica.Partita_IVA.trim()) === Number(e.Partita_IVA.trim())
    );
    let codBpointCF = tabRaccordoBpoint.filter(
      (anagrafica) =>
        Number(anagrafica.Codice_fiscale.trim()) ===
        Number(e.Codice_fiscale.trim())
    );

    // console.log("filtered", codSapPI);
    let dataRet = { ...e };
    if (codSapPI[0]) {
      //   console.log(codSap[0].codice_SAP);
      dataRet = {
        ...dataRet,
        codice_SAP: codSapPI[0].codice_SAP,
        //testoTestata: codSapPI[0].Cod_WKInfo,
      };
    } else if (codSapCF[0]) {
      dataRet = {
        ...dataRet,
        codice_SAP: codSapCF[0].codice_SAP,
        //testoTestata: codSapCF[0].Cod_WKInfo,
      };
    } else {
      dataRet = { ...dataRet, codice_SAP: "" };
    }
    if (codBpointPI[0]) {
      //   console.log(codSap[0].codice_SAP);
      dataRet = {
        ...dataRet,
        testoTestata: codBpointPI[0].codBpoint,
        //testoTestata: codSapPI[0].Cod_WKInfo,
      };
    } else if (codBpointCF[0]) {
      dataRet = {
        ...dataRet,
        testoTestata: codBpointCF[0].codBpoint,
        //testoTestata: codSapCF[0].Cod_WKInfo,
      };
    } else {
      dataRet = {
        ...dataRet,
        testoTestata: "",
      };
    }
    return dataRet;
  });

  // console.log("insoluti", insoluti);
  // fine insoluti
  for (const insoluto of insoluti) {
    fattureElaborate.push({
      Codice_fiscale: insoluto.Codice_fiscale,
      Data_documento: insoluto.Data_Operazione,
      Partita_IVA: insoluto.Partita_IVA,
      Ragione_sociale: insoluto.RagioneSocile,
      Tipo_documento: "AO",
      attribuzione: insoluti.Numero_Documento,
      codice_SAP: "",
      dataIncasso: "",
      imponibile: insoluto.Imponibile,
      importoIncasso: 0,
      incassoDiretto: false,
      iva: "22",
      modalitàPagamento: "1002",
      note: "Riba varie insolute",
      residuo: insoluto.Dare,
      testoTestata: insoluto.testoTestata,
      totDocumento: insoluto.Dare.toString().replace(",", "").replace(".", ","),
    });
  }
  // FINE INSOLUTI ############################################################################## FINE INSOLUTI

  // INIZIO CAUSALI 202 ######################################################################### INIZIO CAUSALE 202
  let dareCli = [];
  let datadareCli = {};
  for (const incassoRow of incassiRows) {
    const incassoRowSplittato = incassoRow.split(";");
    if (incassoRowSplittato[12] === "00202") {
      datadareCli = {
        ...datadareCli,
        testoTestata: incassoRowSplittato[8],
        RagioneSocile: incassoRowSplittato[9],
        Codice_fiscale: incassoRowSplittato[10],
        Partita_IVA: incassoRowSplittato[11],
        Movimento: incassoRowSplittato[0],
        Registro: incassoRowSplittato[1],
        Sezionale: incassoRowSplittato[2],
        Data_Operazione: incassoRowSplittato[3],
        Protocollo: incassoRowSplittato[4],
        Data_documento: incassoRowSplittato[5],
        Numero_Documento: incassoRowSplittato[6],
        Totale_Documento: incassoRowSplittato[7],
        Causale: incassoRowSplittato[12],
        Descrizione_Causale: incassoRowSplittato[13],
        Annotazioni: incassoRowSplittato[14],
        Cdc: incassoRowSplittato[15],
        Codice_Conto: incassoRowSplittato[16],
        Quarto_Livello: incassoRowSplittato[17],
        Descricione_Conto: incassoRowSplittato[18],
        Dare: Number(
          incassoRowSplittato[19].replace(".", "").replace(",", ".")
        ),
        Avere: Number(
          incassoRowSplittato[20].replace(".", "").replace(",", ".")
        ),
        Imponibile: incassoRowSplittato[21],
        Codice_iva: incassoRowSplittato[22],
        Imposta: incassoRowSplittato[23],
        Merci: incassoRowSplittato[24],
        Bdr: incassoRowSplittato[25],
        Detrazione: incassoRowSplittato[26],
        Importo_Detraibile: incassoRowSplittato[27],
        Importo_Indetraibile: incassoRowSplittato[28],
        Causale_iva: incassoRowSplittato[29],
        Descrizione_Causale_Iva: incassoRowSplittato[30],
        Causale_Analitica: incassoRowSplittato[31],
        Descrizione_Analitica: incassoRowSplittato[32],
      };
      dareCli.push(datadareCli);
    }
  }

  dareCli = dareCli.map((e) => {
    let codSapPI = tabRaccordoAnagrafiche.filter(
      (anagrafica) => anagrafica.Partita_IVA === e.Partita_IVA
    );
    let codSapCF = tabRaccordoAnagrafiche.filter(
      (anagrafica) => anagrafica.Codice_fiscale === e.Codice_fiscale
    );
    // console.log("filtered", codSapPI);

    let codBpointPI = tabRaccordoBpoint.filter(
      (anagrafica) =>
        Number(anagrafica.Partita_IVA.trim()) === Number(e.Partita_IVA.trim())
    );
    let codBpointCF = tabRaccordoBpoint.filter(
      (anagrafica) =>
        Number(anagrafica.Codice_fiscale.trim()) ===
        Number(e.Codice_fiscale.trim())
    );

    // console.log("filtered", codSapPI);
    let dataRet = { ...e };
    if (codSapPI[0]) {
      //   console.log(codSap[0].codice_SAP);
      dataRet = {
        ...dataRet,
        codice_SAP: codSapPI[0].codice_SAP,
        //testoTestata: codSapPI[0].Cod_WKInfo,
      };
    } else if (codSapCF[0]) {
      dataRet = {
        ...dataRet,
        codice_SAP: codSapCF[0].codice_SAP,
        //testoTestata: codSapCF[0].Cod_WKInfo,
      };
    } else {
      dataRet = { ...dataRet, codice_SAP: "" };
    }
    if (codBpointPI[0]) {
      //   console.log(codSap[0].codice_SAP);
      dataRet = {
        ...dataRet,
        testoTestata: codBpointPI[0].codBpoint,
        //testoTestata: codSapPI[0].Cod_WKInfo,
      };
    } else if (codBpointCF[0]) {
      dataRet = {
        ...dataRet,
        testoTestata: codBpointCF[0].codBpoint,
        //testoTestata: codSapCF[0].Cod_WKInfo,
      };
    } else {
      dataRet = {
        ...dataRet,
        testoTestata: "",
      };
    }
    return dataRet;
  });

  // fine insoluti
  for (const insoluto of dareCli) {
    fattureElaborate.push({
      Codice_fiscale: insoluto.Codice_fiscale,
      Data_documento: insoluto.Data_Operazione,
      Partita_IVA: insoluto.Partita_IVA,
      Ragione_sociale: insoluto.RagioneSocile,
      Tipo_documento: "Avere Cliente",
      attribuzione: insoluti.Numero_Documento,
      codice_SAP: "",
      dataIncasso: "",
      imponibile: insoluto.Imponibile,
      importoIncasso: 0,
      incassoDiretto: false,
      iva: "22",
      modalitàPagamento: "1002",
      note: "Riba varie insolute",
      residuo: insoluto.Dare,
      testoTestata: insoluto.testoTestata,
      totDocumento:
        "-" + insoluto.Avere.toString().replace(",", "").replace(".", ","),
    });
  }
  // FINE CUSALE 202 ############################################################################ FINE CAUSALE 202

  // console.log(
  //   "fatture elaborate filtrate per indiv gli ao",
  //   fattureElaborate.filter((e) => e.Tipo_documento === "Avere Cliente")
  // );
  //inizio note di credito

  let noteDiCredito = [];
  let dataNoteDiCredito = {};
  for (const incassoRow of incassiRows) {
    const incassoRowSplittato = incassoRow.split(";");
    if (incassoRowSplittato[12] === "01285" && incassoRowSplittato[9] !== "") {
      dataNoteDiCredito = {
        ...dataNoteDiCredito,
        testoTestata: incassoRowSplittato[8],
        RagioneSocile: incassoRowSplittato[9],
        Codice_fiscale: incassoRowSplittato[10],
        Partita_IVA: incassoRowSplittato[11],
        Movimento: incassoRowSplittato[0],
        Registro: incassoRowSplittato[1],
        Sezionale: incassoRowSplittato[2],
        Data_Operazione: incassoRowSplittato[3],
        Protocollo: incassoRowSplittato[4],
        Data_documento: incassoRowSplittato[5],
        Numero_Documento: Number(incassoRowSplittato[6]),
        Totale_Documento: incassoRowSplittato[7],
        Causale: incassoRowSplittato[12],
        Descrizione_Causale: incassoRowSplittato[13],
        Annotazioni: incassoRowSplittato[14],
        Cdc: incassoRowSplittato[15],
        Codice_Conto: incassoRowSplittato[16],
        Quarto_Livello: incassoRowSplittato[17],
        Descricione_Conto: incassoRowSplittato[18],
        Dare: incassoRowSplittato[19],
        Avere: incassoRowSplittato[20],
        Imponibile: incassoRowSplittato[21],
        Codice_iva: incassoRowSplittato[22],
        Imposta: incassoRowSplittato[23],
        Merci: incassoRowSplittato[24],
        Bdr: incassoRowSplittato[25],
        Detrazione: incassoRowSplittato[26],
        Importo_Detraibile: incassoRowSplittato[27],
        Importo_Indetraibile: incassoRowSplittato[28],
        Causale_iva: incassoRowSplittato[29],
        Descrizione_Causale_Iva: incassoRowSplittato[30],
        Causale_Analitica: incassoRowSplittato[31],
        Descrizione_Analitica: incassoRowSplittato[32],
      };
      noteDiCredito.push(dataNoteDiCredito);
    }
  }

  noteDiCredito = noteDiCredito.map((e) => {
    let codSapPI = tabRaccordoAnagrafiche.filter(
      (anagrafica) => anagrafica.Partita_IVA === e.Partita_IVA
    );
    let codSapCF = tabRaccordoAnagrafiche.filter(
      (anagrafica) => anagrafica.Codice_fiscale === e.Codice_fiscale
    );

    let codBpointPI = tabRaccordoBpoint.filter(
      (anagrafica) =>
        Number(anagrafica.Partita_IVA.trim()) === Number(e.Partita_IVA.trim())
    );
    let codBpointCF = tabRaccordoBpoint.filter(
      (anagrafica) =>
        Number(anagrafica.Codice_fiscale.trim()) ===
        Number(e.Codice_fiscale.trim())
    );

    // console.log("filtered", codSapPI);
    let dataRet = { ...e };
    if (codSapPI[0]) {
      //   console.log(codSap[0].codice_SAP);
      dataRet = {
        ...dataRet,
        codice_SAP: codSapPI[0].codice_SAP,
        //testoTestata: codSapPI[0].Cod_WKInfo,
      };
    } else if (codSapCF[0]) {
      dataRet = {
        ...dataRet,
        codice_SAP: codSapCF[0].codice_SAP,
        //testoTestata: codSapCF[0].Cod_WKInfo,
      };
    } else {
      dataRet = { ...dataRet, codice_SAP: "" };
    }
    if (codBpointPI[0]) {
      //   console.log(codSap[0].codice_SAP);
      dataRet = {
        ...dataRet,
        testoTestata: codBpointPI[0].codBpoint,
        //testoTestata: codSapPI[0].Cod_WKInfo,
      };
    } else if (codBpointCF[0]) {
      dataRet = {
        ...dataRet,
        testoTestata: codBpointCF[0].codBpoint,
        //testoTestata: codSapCF[0].Cod_WKInfo,
      };
    } else {
      dataRet = {
        ...dataRet,
        testoTestata: "",
      };
    }
    return dataRet;
  });

  // console.log("noteDiCredito", noteDiCredito);

  //fine note di credito

  // console.log("fatturePreAperture", fattureElaborate);
  // INSERIMENTO APERTURE TRA I DOCUMENTI ###################################################### INSERIMENTO APERTURE TRA I DOCUMENTI
  for (const apertura of aperture) {
    let dataApertura = {
      Codice_fiscale: apertura.Codice_fiscale,
      Data_documento: apertura.Data_Operazione,
      Partita_IVA: apertura.Partita_IVA,
      Ragione_sociale: apertura.RagioneSocile,
      Tipo_documento: "M1",
      attribuzione: "0",
      imponibile: "0",
      iva: "0",
      modalitàPagamento: "",
      totDocumento: apertura.Dare,
      note: "Aperture saldo 1/1/23",
      testoTestata: apertura.testoTestata,
      codice_SAP: apertura.codice_SAP,
    };
    if (apertura.Causale === "00242") {
      dataApertura = {
        ...dataApertura,
        totDocumento: "-" + apertura.Avere,
      };
    }
    fattureElaborate.push(dataApertura);
  }
  // console.log("fatturePostAperture", fattureElaborate);
  //convertitore per numeri

  //aggiungo il codice sap
  const fattureConSap = fattureElaborate.map((e) => {
    let codSapPI = tabRaccordoAnagrafiche.filter(
      (anagrafica) => anagrafica.Partita_IVA === e.Partita_IVA
    );
    let codSapCF = tabRaccordoAnagrafiche.filter(
      (anagrafica) => anagrafica.Codice_fiscale === e.Codice_fiscale
    );

    let codBpointPI = tabRaccordoBpoint.filter(
      (anagrafica) => Number(anagrafica.Partita_IVA) === Number(e.Partita_IVA)
    );
    let codBpointCF = tabRaccordoBpoint.filter(
      (anagrafica) =>
        Number(anagrafica.Codice_fiscale) === Number(e.Codice_fiscale)
    );

    // console.log("filtered", codSapPI);
    let dataRet = { ...e };
    if (codSapPI[0]) {
      //   console.log(codSap[0].codice_SAP);
      dataRet = {
        ...dataRet,
        codice_SAP: codSapPI[0].codice_SAP,
        //testoTestata: codSapPI[0].Cod_WKInfo,
      };
    } else if (codSapCF[0]) {
      dataRet = {
        ...dataRet,
        codice_SAP: codSapCF[0].codice_SAP,
        //testoTestata: codSapCF[0].Cod_WKInfo,
      };
    } else {
      dataRet = { ...dataRet, codice_SAP: "" };
    }
    if (codBpointPI[0]) {
      //   console.log(codSap[0].codice_SAP);
      dataRet = {
        ...dataRet,
        testoTestata: codBpointPI[0].codBpoint,
        //testoTestata: codSapPI[0].Cod_WKInfo,
      };
    } else if (codBpointCF[0]) {
      dataRet = {
        ...dataRet,
        testoTestata: codBpointCF[0].codBpoint,
        //testoTestata: codSapCF[0].Cod_WKInfo,
      };
    } else {
      dataRet = {
        ...dataRet,
        testoTestata: "",
      };
    }
    return dataRet;
  });
  // console.log("fatture con SAP", fattureConSap);

  function converter(numbStr) {
    return Number(numbStr.replace(".", "").replace(",", "."));
  }

  // console.log("incassi", incassiElaborati);
  //inizio a processare le fatture per cercare i pagamenti
  const fatturePostPagamentiDiretti = [];
  const eccedenzaDiPagamento = [];
  i = 0;
  const residuo = (tot, incasso) => {
    if (converter(tot) - converter(incasso) < 0) {
      return 0;
    } else {
      return converter(tot) - converter(incasso);
    }
  };
  for (const fatturaConSap of fattureConSap) {
    const findMe = (e) => {
      if (
        (e.Partita_IVA === fatturaConSap.Partita_IVA ||
          e.Codice_fiscale === fatturaConSap.Codice_fiscale) &&
        Number(fatturaConSap.attribuzione) === Number(e.Numero_Documento)
      ) {
        return true;
      } else {
        return false;
      }
    };
    const indexIncasso = incassiElaborati.findIndex(findMe);
    // if (indexIncasso !== -1) {
    //   console.log(indexIncasso);
    //   // console.log(incassiElaborati[indexIncasso]);
    // }
    const incassiFiltered = [];
    if (incassiElaborati[indexIncasso]) {
      const residuoConInc =
        Math.round(
          residuo(
            fatturaConSap.totDocumento,
            incassiElaborati[indexIncasso].Avere
          ) * 100
        ) / 100;
      fatturePostPagamentiDiretti.push({
        ...fatturaConSap,
        incassoDiretto: true,
        dataIncasso: incassiElaborati[indexIncasso].Data_Operazione,
        importoIncasso: converter(incassiElaborati[indexIncasso].Avere),
        residuo: residuoConInc,
        totDocumento: fatturaConSap.totDocumento,
      });
      if (
        residuo(
          incassiElaborati[indexIncasso].Avere,
          fatturaConSap.totDocumento
        )
      ) {
        eccedenzaDiPagamento.push({
          ...incassiElaborati[indexIncasso],
          residuoDaIncassare: residuo(
            incassiElaborati[indexIncasso].Avere,
            fatturaConSap.totDocumento
          ),
        });
      } else {
        eccedenzaDiPagamento.push({
          ...incassiElaborati[indexIncasso],
          residuoDaIncassare: 0,
        });
      }
      incassiElaborati.splice(indexIncasso, 1);
    } else {
      const residuo = Number(
        fatturaConSap.totDocumento.replace(".", "").replace(",", ".")
      );
      fatturePostPagamentiDiretti.push({
        ...fatturaConSap,
        incassoDiretto: false,
        dataIncasso: false,
        importoIncasso: false,
        residuo: residuo,
      });
    }
    incassiFiltered[1] &&
      console.log(
        "fattura",
        fatturaConSap,
        "incasso corrispondente",
        incassiFiltered
      );
    i++;
  }
  for (const inc of incassiElaborati) {
    const incDaAttr = {
      ...inc,
      residuoDaIncassare: Number(inc.Avere.replace(".", "").replace(",", ".")),
    };
    eccedenzaDiPagamento.push(incDaAttr);
  }
  // console.log("fatturePostPagamentiDiretti", fatturePostPagamentiDiretti);
  // console.log("fattura a campione", fatturePostPagamentiDiretti[2201]);
  // console.log(
  //   "incassi generici con incassi specifici già elaborati",
  //   eccedenzaDiPagamento
  // );
  i = 0;
  const fattureDateCorrette = fatturePostPagamentiDiretti.map((e) => {
    const dataSplit = e.Data_documento.split("/");
    return {
      ...e,
      Data_documento: Date.parse(
        dataSplit[1] + "/" + dataSplit[0] + "/" + dataSplit[2]
      ),
    };
  });

  // console.log(
  //   "filtro 2EMMET",
  //   fattureDateCorrette.filter((e) => e.testoTestata === "2EMMET")
  // );

  const fattureOrdinate = fattureDateCorrette.sort((a, b) => {
    if (a.attribuzione === b.attribuzione) {
      return a.Data_documento - b.Data_documento;
    }
    if (Number(a.attribuzione) < Number(b.attribuzione)) {
      return -1;
    }
    if (Number(a.attribuzione) > Number(b.attribuzione)) {
      return 1;
    }
  });
  // console.log("fatture ordinate", fattureOrdinate);
  const incassiDateCorrette = eccedenzaDiPagamento.map((e) => {
    let dataDocDaAssegnare;
    if (e.Data_documento) {
      const dataDocSplit = e.Data_documento.split("/");
      dataDocDaAssegnare = Date.parse(
        dataDocSplit[1] + "/" + dataDocSplit[0] + "/" + dataDocSplit[2]
      );
    } else {
      dataDocDaAssegnare = "";
    }
    const DataOpSplit = e.Data_Operazione.split("/");
    return {
      ...e,
      Data_Operazione: Date.parse(
        DataOpSplit[1] + "/" + DataOpSplit[0] + "/" + DataOpSplit[2]
      ),
      Data_documento: dataDocDaAssegnare,
    };
  });
  // console.log("incassi date corrette", incassiDateCorrette);
  const incassiOrdinati = incassiDateCorrette.sort((a, b) => {
    if (a.testoTestata === b.testoTestata) {
      return a.Data_Operazione - b.Data_Operazione;
    }
    if (a.testoTestata < b.testoTestata) {
      return -1;
    }
    if (a.testoTestata > b.testoTestata) {
      return 1;
    }
  });
  // console.log("incassi ordinati per data", incassiOrdinati);

  let incassiPostIncasso = [];
  let fattureOrdinatePreIncasso = [...fattureOrdinate];

  //splitto i pagamenti multipli
  fattureOrdinatePreIncasso = fattureOrdinatePreIncasso.flatMap((e) => {
    const modalitàPagamento = specialPayment.filter((a) => {
      for (const ref of a.ref) {
        if (ref === e.modalitàPagamento) {
          return true;
        }
      }
      return false;
    });
    if (modalitàPagamento[0]) {
      const scadenzaSplittate = [];
      let indSplit = 0;
      for (const code of modalitàPagamento[0].nuoviCodici) {
        indSplit++;
        scadenzaSplittate.push({
          ...e,
          attribuzione: e.attribuzione + " 0" + indSplit,
          modalitàPagamento: code,
          note: "Scadenza multipla",
          residuo:
            Math.round(
              (e.residuo / modalitàPagamento[0].nuoviCodici.length) * 100
            ) / 100,
        });
      }
      return scadenzaSplittate;
    } else {
      return { ...e };
    }
  });
  console.log(
    "fattureOrdinatePreIncasso",
    fattureOrdinatePreIncasso.filter((e) => e.residuo < 0)
  );

  //fine split pagamenti multipli

  for (const incSingolo of incassiOrdinati) {
    const incasso = { ...incSingolo };
    fattureOrdinatePreIncasso = fattureOrdinatePreIncasso.map((fattura) => {
      if (fattura.residuo <= 0) {
        return { ...fattura };
      } else {
        if (
          fattura.Partita_IVA === incasso.Partita_IVA ||
          fattura.Codice_fiscale === incasso.Codice_fiscale
        ) {
          if (incasso.Partita_IVA === "11692530014") {
            // console.log("fattura.residuo", fattura.residuo);
            // console.log("incasso.residuoDaIncassare", incasso.residuoDaIncassare);
            // console.log(
            //   "differenza",
            //   Math.round((fattura.residuo - incasso.residuoDaIncassare) * 100) /
            //     100
            // );
          }
          const residuo =
            fattura.residuo * 100 - incasso.residuoDaIncassare * 100 <= 0
              ? 0
              : Math.round(
                  (fattura.residuo - incasso.residuoDaIncassare) * 100
                ) / 100;
          incasso.residuoDaIncassare =
            incasso.residuoDaIncassare - fattura.residuo <= 0
              ? 0
              : Math.round(
                  (incasso.residuoDaIncassare - fattura.residuo) * 100
                ) / 100;

          return { ...fattura, residuo: residuo };
        }
        return { ...fattura };
      }
    });
    incassiPostIncasso.push(incasso);
  }
  // console.log(
  //   "incassiPostIncasso",
  //   incassiPostIncasso.filter((e) => e.Partita_IVA === "11692530014")
  // );
  // console.log(
  //   "fattureOrdinatePreIncasso",
  //   fattureOrdinatePreIncasso.filter((e) => e.Partita_IVA === "11692530014")
  // );
  // aggiorno le modalità di pagamento con i codici WKI
  for (const fattura of fattureOrdinatePreIncasso) {
  }
  fattureOrdinatePreIncasso = fattureOrdinatePreIncasso.map((e) => {
    const modalitàPagamento = payment.filter((a) => {
      for (const ref of a.ref) {
        if (ref === e.modalitàPagamento) {
          return true;
        }
      }
      return false;
    });
    if (modalitàPagamento[0]) {
      return { ...e, modalitàPagamento: modalitàPagamento[0].cd };
    } else {
      return { ...e };
    }
  });
  // aggiorno i tipi documento con i codici WKI

  fattureOrdinatePreIncasso = fattureOrdinatePreIncasso.map((e) => {
    const Tipo_documento = docType.filter((a) => {
      for (const ref of a.ref) {
        // console.log(e.Tipo_documento.toUpperCase().trim());
        if (ref === e.Tipo_documento.toUpperCase().trim()) {
          return true;
        }
      }
      return false;
    });
    if (Tipo_documento[0]) {
      return { ...e, Tipo_documento: Tipo_documento[0].cd };
    } else {
      return { ...e };
    }
  });
  function formatDate(date) {
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join("/");
  }
  // creo gli array da esportare
  const Intestazioni = [
    "Tipo documento",
    "Data Doc",
    "Testo Testata",
    "Importo",
    "Attribuzione",
    "Modalità di pagamento",
    "Note",
    "Ragione Sociale",
    "Partita Iva",
    "Codice Fiscale",
    "Importo Documento",
    "Codice SAP",
    "Indirizzo",
    "Città",
    "CAP",
  ];
  const arrInsolutiSommati = [];

  insoluti = insoluti.sort((a, b) => {
    return a.Partita_IVA - b.Partita_IVA;
  });
  dataInsoluti = {};
  for (const insoluto of insoluti) {
    if (
      dataInsoluti.Codice_fiscale === insoluto.Codice_fiscale ||
      dataInsoluti.Partita_IVA === insoluto.Partita_IVA
    ) {
      dataInsoluti = {
        ...dataInsoluti,
        Dare: dataInsoluti.Dare + insoluto.Dare,
      };
    } else {
      if (dataInsoluti.Codice_fiscale) {
        dataInsoluti = {
          ...dataInsoluti,
          Dare: Math.round(dataInsoluti.Dare * 100) / 100,
        };
        arrInsolutiSommati.push(dataInsoluti);
      }
      dataInsoluti = { ...insoluto };
    }
  }
  // console.log("arrInsolutiSommati", arrInsolutiSommati);

  let incassiDaTrasporre = [...incassiPostIncasso];

  incassiDaTrasporre = incassiDaTrasporre.map((e) => {
    let codSapPI = tabRaccordoAnagrafiche.filter(
      (anagrafica) => anagrafica.Partita_IVA === e.Partita_IVA
    );
    let codSapCF = tabRaccordoAnagrafiche.filter(
      (anagrafica) => anagrafica.Codice_fiscale === e.Codice_fiscale
    );
    // console.log("filtered", codSapPI);
    if (codSapPI[0]) {
      //   console.log(codSap[0].codice_SAP);
      return {
        ...e,
        codice_SAP: codSapPI[0].codice_SAP,
      };
    } else if (codSapCF[0]) {
      return {
        ...e,
        codice_SAP: codSapCF[0].codice_SAP,
      };
    } else {
      return { ...e, codice_SAP: "" };
    }
  });

  const anticipi = incassiDaTrasporre.filter((e) => e.residuoDaIncassare !== 0);

  let fattureCsv = [
    ...fattureOrdinatePreIncasso.map((e) => [
      e.Tipo_documento,
      formatDate(new Date(e.Data_documento)),
      e.testoTestata,
      Number.parseFloat(e.residuo).toString().replace(".", ","),
      e.attribuzione,
      e.modalitàPagamento,
      e.note,
      e.Ragione_sociale,
      e.Partita_IVA,
      e.Codice_fiscale,
      e.totDocumento,
      e.codice_SAP,
      e.indirizzo,
      e.Città,
      e.cap,
    ]),
    // ...arrInsolutiSommati.map((e) => [
    //   "AO",
    //   e.Data_Operazione,
    //   e.testoTestata,
    //   Number.parseFloat(e.Dare).toString().replace(".", ","),
    //   "",
    //   "",
    //   "Riba varie insolute",
    //   e.RagioneSocile,
    //   e.Partita_IVA,
    //   e.Codice_fiscale,
    //   Number.parseFloat(e.Dare).toString().replace(".", ","),
    //   e.codice_SAP,
    // ]),
    ...noteDiCredito.map((e) => [
      "M2",
      e.Data_Operazione,
      e.testoTestata,
      "-" + e.Avere,
      e.Numero_Documento,
      "",
      "Nota di credito",
      e.RagioneSocile,
      e.Partita_IVA,
      e.Codice_fiscale,
      "-" + e.Avere,
      e.codice_SAP,
      "",
      "",
      "",
    ]),
    ...anticipi.map((e) => [
      "M6",
      formatDate(new Date(e.Data_Operazione)),
      e.testoTestata,
      "-" + e.residuoDaIncassare.toString().replace(".", ","),
      "0",
      "",
      "Eccesso di incasso",
      e.RagioneSocile,
      e.Partita_IVA,
      e.Codice_fiscale,
      "-" + e.Avere,
      e.codice_SAP,
      "",
      "",
      "",
    ]),
  ];

  function dateConverter(e) {
    const dataSplit = e.split("/");
    return Date.parse(dataSplit[1] + "/" + dataSplit[0] + "/" + dataSplit[2]);
  }

  fattureCsv = fattureCsv.sort(
    (a, b) => dateConverter(a[1]) - dateConverter(b[1])
  );

  let pagamDaContratto = comeDaContratto.split("\n").map((e) => e.split(";"));

  console.log("pagamDaContratto", pagamDaContratto);
  console.log("fatture csv", fattureCsv);
  fattureCsv = fattureCsv.map((e) => {
    const pagContratto = pagamDaContratto.filter(
      (pg) => pg[6] === e[8] || pg[7] === e[9]
    );
    if (pagContratto[0] && e[4] !== "0") {
      console.log(pagContratto[0]);
      let toRet = [...e];
      toRet[5] = pagContratto[0][4];
      return toRet;
    } else {
      return [...e];
    }
  });

  fattureCsv = [Intestazioni, ...fattureCsv];
  console.log(fattureCsv);

  console.log("incassiDaTrasporre", incassiDaTrasporre);
  console.log("anticipi");

  const incassiCsv = [
    [
      "Ragione Sociale",
      "Partita IVA",
      "Codice fiscale",
      "Totale Incasso",
      "Residuo incasso",
      "Data Operazione",
      "Numero documento",
      "Annotazione",
      "Codice SAP",
      "Codice BPOINT",
    ],
    ...incassiPostIncasso.map((e) => [
      e.RagioneSocile,
      e.Partita_IVA,
      e.Codice_fiscale,
      e.Avere,
      Number.parseFloat(e.residuoDaIncassare).toString().replace(".", ","),
      formatDate(new Date(e.Data_Operazione)),
      e.Numero_Documento,
      e.Annotazioni,
      e.codice_SAP,
      e.testoTestata,
    ]),
  ];

  console.log(incassiCsv);
  return (
    <div>
      <div className="mainArea">
        <div className="downoloadButton">
          <CSVLink data={fattureCsv} filename={"fatture.csv"} separator={";"}>
            Scarica dati fatture
          </CSVLink>
        </div>
        <div className="downoloadButton">
          <CSVLink data={incassiCsv} filename={"incassi.csv"} separator={";"}>
            Scarica dati incassi{" "}
          </CSVLink>
        </div>
      </div>
    </div>
  );
};

export default Elaborate;
