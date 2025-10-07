import { format } from 'date-fns/format';
import Decimal from 'decimal.js';
import ExcelJS from 'exceljs';
import { ConfigContextType } from '../app/sheet/ConfigContext';
import { WorkDay } from '../app/sheet/types';
import {
  calcDoctorsLeave,
  calcDoctorsLeaveFamily,
  calcSickLeave,
  calcSickLeaveFamily,
} from '../components/utils/calculations';
import { getTitle } from '../components/utils/workDay';
import { getMonthName } from './skUtils';

const BLACK_COLOR = 'FF000000';
const GREEN_COLOR = 'FFDDE5C3';
const GRAY_COLOR = 'FFD9D9D9';

const fillCell = (cell: ExcelJS.Cell, color: string) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: color },
    bgColor: { argb: color },
  };
};

const borderCell = (cell: ExcelJS.Cell) => {
  cell.border = {
    top: { style: 'thin', color: { argb: BLACK_COLOR } },
    bottom: { style: 'thin', color: { argb: BLACK_COLOR } },
    left: { style: 'thin', color: { argb: BLACK_COLOR } },
    right: { style: 'thin', color: { argb: BLACK_COLOR } },
  };
};

export const generateEPC = (config: ConfigContextType, monthData: WorkDay[], userName: string) => {
  console.log('generate EPC');
  const month = monthData[0].month + 1;
  const year = monthData[0].year;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`${getMonthName(month)}`,{
    pageSetup:{paperSize: 9, orientation:'portrait'}
  });
  sheet.columns = [
    { key: 'day', width: 3 },
    { key: 'startTime', width: 8 },
    { key: 'endTime', width: 8 },
    { key: 'lunch', width: 8 },
    { key: 'intFrom', width: 6 },
    { key: 'intTo', width: 6 },
    { key: 'intTime', width: 5 },
    { key: 'overtime', width: 5 },
    { key: 'compensatory', width: 5 },
    { key: 'vacation', width: 5 },
    { key: 'home', width: 5 },
    { key: 'workTime', width: 7 },
    { key: 'signature', width: 9 },
  ];
  let row = sheet.addRow(['', '', '', '', '', '', '', '', '', '', '', '', '']);
  row.eachCell((cell) => {
    cell.font = { size: 10 };
  });
  row = sheet.addRow([
    '',
    '',
    '',
    '',
    '',
    'Pracovny fond:',
    null,
    config.officialWorkTime.toNumber(),
    '',
    'obdobie:',
    null,
    `${getMonthName(month)} ${year}`,
    null,
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10, bold: [6, 10].includes(collNumber) };
  });
  row = sheet.addRow([
    'Evidencia pracovné času v zmysle § 99 Zákonníka práce',
    null,
    null,
    null,
    null,
    null,
    null,
    '',
    '',
    'zamestnanec:',
    null,
    userName,
    null,
  ]);
  row.eachCell((cell) => {
    cell.font = { size: 10, bold: true };
  });
  row = sheet.addRow(['', '', '', '', '', '', '', '', '', '', '', '', '']);
  row.eachCell((cell) => {
    cell.font = { size: 10 };
  });
  //                    A        B                    C    D           E   F  G     H               I              J               K                   L                                  M
  row = sheet.addRow([
    'dni',
    'Základný pracovný čas',
    '',
    'Prerušenie',
    '',
    '',
    '',
    'Nadčasová práca',
    'Čerpanie NV',
    'Dovolenka DOV',
    'práca doma (PZ)',
    'celkom odpracovaný pracovný čas',
    'podpis zamestnanca',
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { bold: true, size: 10 };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
      textRotation: [1, 8, 9, 10, 11, 12, 13].includes(collNumber) ? 90 : 0,
    };
    fillCell(cell, GREEN_COLOR);
    borderCell(cell);
  });
  row = sheet.addRow([
    '',
    '',
    '',
    'z toho prestávku v čase od 11:30 do 14:30',
    'lekárske ošetrenie, sprevádzanie s členom rodiny na ošetrenie',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  row.eachCell((cell, colNumber) => {
    cell.font = { bold: true, size: colNumber === 4 ? 7.5 : 10 };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    fillCell(cell, GREEN_COLOR);
    borderCell(cell);
  });
  row = sheet.addRow([
    '',
    'príchod',
    'odchod',
    'čas /h/',
    'od',
    'do',
    'spolu',
    'čas /h/',
    'čas /h/',
    'čas /h/',
    'čas /h/',
    'čas /h/',
    '',
  ]);
  row.eachCell((cell) => {
    cell.font = { bold: true, size: 10 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    fillCell(cell, GREEN_COLOR);
    borderCell(cell);
  });
  sheet.mergeCells('A5:A7'); //dni
  sheet.mergeCells('B5:C6'); //Základný pracovný čas
  sheet.mergeCells('D5:G5'); //Prerušenie
  sheet.mergeCells('E6:G6');
  sheet.mergeCells('H5:H6'); //Nadčasové práca
  sheet.mergeCells('I5:I6'); //Čerpanie NV
  sheet.mergeCells('J5:J6'); //Dovolenka DOV
  sheet.mergeCells('K5:K6'); //práca doma (PZ)
  sheet.mergeCells('L5:L6'); //celkom odpracovaný pracovný čas
  sheet.mergeCells('M5:M7'); //podpis zamestnanca

  monthData.forEach((data) => {
    const title = getTitle(data);
    const isWorkingDay = title === 'Práca';
    const negativeInterruptions = data.interruptions?.filter(
      (interruption) => interruption.type !== 'compensatoryLeave',
    ) ?? [];
    const compensatoryLeaveInterruptions = data.interruptions?.filter(
      (interruption) => interruption.type === 'compensatoryLeave',
    ) ?? [];
    const vacationTime = data.interruptions?.filter(
      (interruption) => interruption.type === 'vacation',
    )?.reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0)) ?? new Decimal(0);

    const row = sheet.addRow({
      day: data.startTime.getDate(),
      startTime: isWorkingDay ? format(data.startTime, 'HH: mm') : title,
      endTime: isWorkingDay ? format(data.endTime, 'HH:mm') : '',
      lunch: data.lunch ? 0.5 : '',
      intFrom: data.vacation ? '' : 
        negativeInterruptions
          ?.map((interruption) => format(interruption.startTime, 'HH:mm'))
          .join('\r\n') ?? '',
      intTo: data.vacation ? '' : 
        negativeInterruptions
          ?.map((interruption) => format(interruption.endTime, 'HH:mm'))
          .join('\r\n') ?? '',
      intTime: data.vacation ? '' : 
        negativeInterruptions?.length > 0 ? negativeInterruptions
          ?.reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0))
          .toNumber() ?? '' : '',
      overtime: '',
      compensatory: data.vacation ? '' :
        compensatoryLeaveInterruptions?.length > 0 ? compensatoryLeaveInterruptions
          ?.reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0))
          .toNumber() ?? '' : '',
      vacation: data.vacation || vacationTime.greaterThan(0) ? vacationTime.toNumber() : '',
      home:
        data.workFromHome && data.workFromHome.greaterThan(0) ? data.workFromHome.toNumber() : '',
      workTime:
        data.dayWorked.toNumber() +
        compensatoryLeaveInterruptions
          .reduce(
            (acc, interruption) => acc.plus(interruption?.time ?? new Decimal(0)),
            new Decimal(0),
          )
          .toNumber(),
      signature: '',
    });
    row.height = 10; //* (data.interruptions?.length ?? 1);
    // row.getCell('intFrom').alignment = { wrapText: true };
    // row.getCell('intTo').alignment = { wrapText: true };
    row.eachCell((cell, colNumber) => {
      cell.font = { size: 10 };
      cell.alignment = { horizontal: 'center' };
      borderCell(cell);
      if (title === 'Víkend' || [8, 12].includes(colNumber)) {
        fillCell(cell, GREEN_COLOR);
      }
    });
    if (!isWorkingDay) {
      sheet.mergeCells(`B${sheet.rowCount}:C${sheet.rowCount}`); //Základný pracovný čas
    }
  });
  row = sheet.addRow([
    'celkom',
    null,
    null,
    null,
    '',
    '',
    { formula: `SUM(G8:G${sheet.rowCount})` },
    { formula: `SUM(H8:H${sheet.rowCount})` },
    { formula: `SUM(I8:I${sheet.rowCount})` },
    { formula: `SUM(J8:J${sheet.rowCount})` },
    '',
    { formula: `SUM(L8:L${sheet.rowCount})` },
    '',
  ]);
  row.eachCell((cell) => {
    cell.font = { size: 10 };
    cell.alignment = { horizontal: 'center' };
    borderCell(cell);
    fillCell(cell, GREEN_COLOR);
  });
  sheet.mergeCells(`A${sheet.rowCount}:D${sheet.rowCount}`); // celkom
  row = sheet.addRow(['', null, null, null, null, null, null, null, null, null, null, null]);
  row.eachCell((cell) => {
    cell.font = { size: 10 };
  });
  const [doctorsLeave] = calcDoctorsLeave(monthData, config);
  const [doctorsLeaveFamily] = calcDoctorsLeaveFamily(monthData, config);
  const [sickLeave] = calcSickLeave(monthData, config);
  const [sickLeaveFamily] = calcSickLeaveFamily(monthData, config);
  row = sheet.addRow([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'Rekapitulácia',
    null,
    null,
    'dni',
    'hodiny',
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10, bold: true };
    cell.alignment = { horizontal: 'center' };
    if (collNumber > 8) {
      borderCell(cell);
      fillCell(cell, GRAY_COLOR);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:K${sheet.rowCount}`);
  row = sheet.addRow([
    'Schválil:......................................',
    null,
    null,
    null,
    '',
    '',
    '',
    '',
    'odpracované/čistý čas',
    null,
    null,
    { formula: `M${sheet.rowCount + 1}/H2` },
    { formula: `L${sheet.rowCount - 2}` },
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10 };
    cell.alignment = { horizontal: collNumber > 9 ? 'center' : 'left' };
    if (collNumber > 8) {
      borderCell(cell);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:K${sheet.rowCount}`);
  row = sheet.addRow([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'nadčasy',
    null,
    null,
    { formula: `M${sheet.rowCount + 1}/H2` },
    { formula: `H${sheet.rowCount - 3}` },
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10 };
    cell.alignment = { horizontal: collNumber > 9 ? 'center' : 'left' };
    if (collNumber > 8) {
      borderCell(cell);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:K${sheet.rowCount}`);
  row = sheet.addRow([
    'Kontroloval:............................',
    null,
    null,
    null,
    '',
    '',
    '',
    '',
    'dovolenka',
    null,
    null,
    { formula: `M${sheet.rowCount + 1}/H2` },
    { formula: `J${sheet.rowCount - 4}` },
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10 };
    cell.alignment = { horizontal: collNumber > 9 ? 'center' : 'left' };
    if (collNumber > 8) {
      borderCell(cell);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:K${sheet.rowCount}`);
  row = sheet.addRow([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'PN, OČR',
    null,
    null,
    { formula: `M${sheet.rowCount + 1}/H2` },
    sickLeave.plus(sickLeaveFamily).toNumber(),
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10 };
    cell.alignment = { horizontal: collNumber > 9 ? 'center' : 'left' };
    if (collNumber > 8) {
      borderCell(cell);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:K${sheet.rowCount}`);
  row = sheet.addRow([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'SČR na O ("péčko")',
    null,
    null,
    { formula: `M${sheet.rowCount + 1}/H2` },
    doctorsLeaveFamily.toNumber(),
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10 };
    cell.alignment = { horizontal: collNumber > 9 ? 'center' : 'left' };
    if (collNumber > 8) {
      borderCell(cell);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:K${sheet.rowCount}`);
  row = sheet.addRow([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'lekárske ošetrenie ("péčko")',
    null,
    null,
    { formula: `M${sheet.rowCount + 1}/H2` },
    doctorsLeave.toNumber(),
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10 };
    cell.alignment = { horizontal: collNumber > 9 ? 'center' : 'left' };
    if (collNumber === 12) {
      cell.numFmt = '0.0';
    }
    if (collNumber > 8) {
      borderCell(cell);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:K${sheet.rowCount}`);
  row = sheet.addRow(['', null, null, null, null, null, null, null, null, null, null, null]);
  row.eachCell((cell) => {
    cell.font = { size: 10 };
  });
  row = sheet.addRow([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    'SPOLU',
    null,
    null,
    null,
    { formula: `SUM(M${sheet.rowCount - 6}:M${sheet.rowCount - 1})` },
  ]);
  row.eachCell((cell) => {
    cell.font = { size: 10, bold: true };
    borderCell(cell);
    fillCell(cell, GRAY_COLOR);
  });
  sheet.mergeCells(`I${sheet.rowCount}:L${sheet.rowCount}`); // spolu

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'epc.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  });
};
