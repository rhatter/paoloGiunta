import React, { useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { useEffect } from "react";
import { tabella_di_raccordo as tabella_di_raccordo_data } from "../data/tabella-di-raccordo";
import { fatture } from "../data/fatture2023";
import { incassi } from "../data/primaNotaAgosto";

const Elaborate = () => {
  const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  ];

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
  console.log("tab raccordo anagrafiche", tabRaccordoAnagrafiche);
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
  console.log("fatture elaborate", fattureElaborate);

  //aggiungo il codice sap
  const fattureConSap = fattureElaborate.map((e) => {
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
        testoTestata: codSapPI[0].Cod_WKInfo,
      };
    } else if (codSapCF[0]) {
      return {
        ...e,
        codice_SAP: codSapCF[0].codice_SAP,
        testoTestata: codSapCF[0].Cod_WKInfo,
      };
    } else {
      return { ...e, codice_SAP: "" };
    }
  });
  console.log("fatture con SAP", fattureConSap);

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

  //convertitore per numeri
  function converter(numbStr) {
    return Number(numbStr.replace(".", "").replace(",", "."));
  }

  console.log("incassi", incassiElaborati);
  //inizio a processare le fatture per cercare i pagamenti
  const fatturePostPagamentiDiretti = [];
  const eccedenzaDiPagamento = [];
  i = 0;
  for (const fatturaConSap of fattureConSap) {
    const incassiFiltered = incassiElaborati.filter((e) => {
      return (
        e.testoTestata === fatturaConSap.testoTestata &&
        Number(fatturaConSap.attribuzione) === Number(e.Numero_Documento)
      );
    });

    if (incassiFiltered[0]) {
      const residuo = () => {
        if (
          converter(fatturaConSap.totDocumento) -
            converter(incassiFiltered[0].Avere) <
          0
        ) {
          return 0;
        } else {
          return (
            converter(fatturaConSap.totDocumento) -
            converter(incassiFiltered[0].Avere)
          );
        }
      };

      console.log({
        ...fatturaConSap,
        incassoDiretto: true,
        dataIncasso: incassiFiltered[0].Data_Operazione,
        importoIncasso: converter(incassiFiltered[0].Avere),
        residuo: Math.floor(residuo() * 100) / 100,
        totDocumento: converter(fatturaConSap.totDocumento),
      });
      fatturePostPagamentiDiretti.push({
        ...fatturaConSap,
        incassoDiretto: true,
        dataIncasso: incassiFiltered[0].Data_Operazione,
        importoIncasso: converter(incassiFiltered[0].Avere),
        residuo: residuo(),
        totDocumento: converter(fatturaConSap.totDocumento),
      });
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
  console.log("fatturePostPagamentiDiretti", fatturePostPagamentiDiretti);
  console.log("fattura a campione", fatturePostPagamentiDiretti[2222]);
  return (
    <div>
      <div className="mainArea">
        <div className="downoloadButton">
          <CSVLink data={csvData}>Download me</CSVLink>
        </div>
      </div>
    </div>
  );
};

export default Elaborate;
