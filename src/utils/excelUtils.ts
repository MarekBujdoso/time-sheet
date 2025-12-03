import { format } from 'date-fns/format';
import Decimal from 'decimal.js';
import ExcelJS from 'exceljs';
import { ConfigContextType } from '../app/sheet/ConfigContext';
import { DayType, WorkDay } from '../app/sheet/types';
import {
  calcDoctorsLeave,
  calcDoctorsLeaveFamily,
  calcWorkFreeDay,
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
  const month = monthData[0].month;
  const year = monthData[0].year;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`${getMonthName(month)}`, {
    pageSetup: { paperSize: 9, orientation: 'portrait' },
  });
  sheet.columns = [
    { key: 'day', width: 3 },
    { key: 'startTime', width: 7 },
    { key: 'endTime', width: 7 },
    { key: 'lunch', width: 7 },
    { key: 'intFrom', width: 6 },
    { key: 'intTo', width: 6 },
    { key: 'intTime', width: 5 },
    { key: 'overtime', width: 5 },
    { key: 'compensatory', width: 5 },
    { key: 'workFreeDay', width: 5 },
    { key: 'vacation', width: 5 },
    { key: 'home', width: 5 },
    { key: 'workTime', width: 7 },
    { key: 'signature', width: 9 },
  ];
  let row = sheet.addRow(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  row.eachCell((cell) => {
    cell.font = { size: 10, name: 'Calibri' };
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
    null,
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10, name: 'Calibri', bold: [6, 10].includes(collNumber) };
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
    null,
  ]);
  row.eachCell((cell) => {
    cell.font = { size: 10, name: 'Calibri', bold: true };
  });
  // row = sheet.addRow(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  // row.eachCell((cell) => {
  //   cell.font = { size: 10, name: 'Calibri' };
  // });
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
    'Prac. voľno (PV)',
    'Dovolenka DOV',
    'práca doma (PZ)',
    'celkom odpracovaný pracovný čas',
    'podpis zamestnanca',
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { bold: true, size: 10, name: 'Calibri' };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
      textRotation: [1, 8, 9, 10, 11, 12, 13, 14].includes(collNumber) ? 90 : 0,
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
    '',
  ]);
  row.eachCell((cell, colNumber) => {
    cell.font = { bold: true, size: colNumber === 4 ? 7.5 : 10, name: 'Calibri' };
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
    'čas /h/',
    '',
  ]);
  row.eachCell((cell) => {
    cell.font = { bold: true, size: 10, name: 'Calibri' };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    fillCell(cell, GREEN_COLOR);
    borderCell(cell);
  });
  sheet.mergeCells('A4:A6'); //dni
  sheet.mergeCells('B4:C5'); //Základný pracovný čas
  sheet.mergeCells('D4:G4'); //Prerušenie
  sheet.mergeCells('E5:G5');
  sheet.mergeCells('H4:H5'); //Nadčasové práca
  sheet.mergeCells('I4:I5'); //Čerpanie NV
  sheet.mergeCells('J4:J5'); //Prac. voľno (PV)
  sheet.mergeCells('K4:K5'); //Dovolenka DOV
  sheet.mergeCells('L4:L5'); //práca doma (PZ)
  sheet.mergeCells('M4:M6'); //celkom odpracovaný pracovný čas
  sheet.mergeCells('N4:N6'); //podpis zamestnanca

  monthData.forEach((data) => {
    const title = getTitle(data);
    const isWorkingDay = data.dayType === DayType.WORK_DAY;
    const isCustomDay = data.dayType === DayType.CUSTOM_DAY;
    const negativeInterruptions =
      data.interruptions?.filter((interruption) => interruption.type !== 'workFreeDay') ?? [];
    const compensatoryLeaveTime = data.compensatoryLeave;
    const vacationTime = data.vacation;
    const workFreeDayTime =
      data.interruptions
        ?.filter((interruption) => interruption.type === 'workFreeDay')
        ?.reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0)) ??
      new Decimal(0);

    const row = sheet.addRow({
      day: data.startTime.getDate(),
      startTime:
        isWorkingDay || (isCustomDay && !data.noWorkTime)
          ? format(data.startTime, 'HH:mm')
          : title,
      endTime:
        isWorkingDay || (isCustomDay && !data.noWorkTime) ? format(data.endTime, 'HH:mm') : '',
      lunch: data.lunch ? 0.5 : '',
      intFrom:
        negativeInterruptions
          ?.map((interruption) => format(interruption.startTime, 'HH:mm'))
          .join('\n') ?? '',
      intTo:
        negativeInterruptions
          ?.map((interruption) => format(interruption.endTime, 'HH:mm'))
          .join('\n') ?? '',
      intTime:
        negativeInterruptions?.length > 0
          ? (negativeInterruptions
              ?.reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0))
              .toNumber() ?? '')
          : '',
      overtime: '',
      compensatory:
        data.compensatoryLeave && data.compensatoryLeave.greaterThan(0)
          ? data.compensatoryLeave.toNumber()
          : '',
      workFreeDay: data.dayType === DayType.WORK_FREE_DAY ? workFreeDayTime.toNumber() : '',
      vacation: data.vacation && vacationTime.greaterThan(0) ? vacationTime.toNumber() : '',
      home:
        data.workFromHome && data.workFromHome.greaterThan(0) ? data.workFromHome.toNumber() : '',
      workTime: data.dayWorked
        .plus(compensatoryLeaveTime)
        .plus(workFreeDayTime)
        .plus(data.workFromHome)
        .toNumber(),
      signature: '',
    });
    // row.height = 10; //* (data.interruptions?.length ?? 1);
    // row.getCell('intFrom').alignment = { wrapText: true };
    // row.getCell('intTo').alignment = { wrapText: true };
    row.eachCell((cell, colNumber) => {
      cell.font = { size: 10, name: 'Calibri' };
      cell.alignment = { horizontal: 'center' };
      borderCell(cell);
      if (title === 'Víkend' || [8, 13].includes(colNumber)) {
        fillCell(cell, GREEN_COLOR);
      }
    });
    if (!isWorkingDay && !isCustomDay) {
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
    { formula: `SUM(K8:K${sheet.rowCount})` },
    '',
    { formula: `SUM(M8:M${sheet.rowCount})` },
    '',
  ]);
  row.eachCell((cell) => {
    cell.font = { size: 10, name: 'Calibri' };
    cell.alignment = { horizontal: 'center' };
    borderCell(cell);
    fillCell(cell, GREEN_COLOR);
  });
  sheet.mergeCells(`A${sheet.rowCount}:D${sheet.rowCount}`); // celkom
  row = sheet.addRow(['', null, null, null, null, null, null, null, null, null, null, null]);
  row.eachCell((cell) => {
    cell.font = { size: 10, name: 'Calibri' };
  });
  const [doctorsLeave] = calcDoctorsLeave(monthData, config);
  const [doctorsLeaveFamily] = calcDoctorsLeaveFamily(monthData, config);
  const [sickLeave] = calcSickLeave(monthData, config);
  const [sickLeaveFamily] = calcSickLeaveFamily(monthData, config);
  const [workFreeDay] = calcWorkFreeDay(monthData, config);
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
    null,
    'dni',
    'hodiny',
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10, bold: true, name: 'Calibri' };
    cell.alignment = { horizontal: 'center' };
    if (collNumber > 8) {
      borderCell(cell);
      fillCell(cell, GRAY_COLOR);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:L${sheet.rowCount}`);
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
    null,
    { formula: `N${sheet.rowCount + 1}/H2` },
    { formula: `M${sheet.rowCount - 2}-J${sheet.rowCount - 2}` },
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10, name: 'Calibri' };
    cell.alignment = { horizontal: collNumber > 9 ? 'center' : 'left' };
    if (collNumber > 8) {
      borderCell(cell);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:L${sheet.rowCount}`);
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
    null,
    { formula: `N${sheet.rowCount + 1}/H2` },
    { formula: `H${sheet.rowCount - 3}` },
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10, name: 'Calibri' };
    cell.alignment = { horizontal: collNumber > 9 ? 'center' : 'left' };
    if (collNumber > 8) {
      borderCell(cell);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:L${sheet.rowCount}`);
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
    null,
    { formula: `N${sheet.rowCount + 1}/H2` },
    { formula: `K${sheet.rowCount - 4}` },
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10, name: 'Calibri' };
    cell.alignment = { horizontal: collNumber > 9 ? 'center' : 'left' };
    if (collNumber > 8) {
      borderCell(cell);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:L${sheet.rowCount}`);
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
    null,
    { formula: `N${sheet.rowCount + 1}/H2` },
    sickLeave.plus(sickLeaveFamily).toNumber(),
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10, name: 'Calibri' };
    cell.alignment = { horizontal: collNumber > 9 ? 'center' : 'left' };
    if (collNumber > 8) {
      borderCell(cell);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:L${sheet.rowCount}`);
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
    null,
    { formula: `N${sheet.rowCount + 1}/H2` },
    doctorsLeaveFamily.toNumber(),
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10, name: 'Calibri'  };
    cell.alignment = { horizontal: collNumber > 9 ? 'center' : 'left' };
    if (collNumber > 8) {
      borderCell(cell);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:L${sheet.rowCount}`);
  row = sheet.addRow([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'prekážka v práci (prac. voľno)',
    null,
    null,
    null,
    { formula: `N${sheet.rowCount + 1}/H2` },
    workFreeDay.toNumber(),
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10, name: 'Calibri' };
    cell.alignment = { horizontal: collNumber > 9 ? 'center' : 'left' };
    if (collNumber > 8) {
      borderCell(cell);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:L${sheet.rowCount}`);
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
    null,
    { formula: `N${sheet.rowCount + 1}/H2` },
    doctorsLeave.toNumber(),
  ]);
  row.eachCell((cell, collNumber) => {
    cell.font = { size: 10, name: 'Calibri' };
    cell.alignment = { horizontal: collNumber > 9 ? 'center' : 'left' };
    if (collNumber === 12) {
      cell.numFmt = '0.0';
    }
    if (collNumber > 8) {
      borderCell(cell);
    }
  });
  sheet.mergeCells(`I${sheet.rowCount}:L${sheet.rowCount}`);
  row = sheet.addRow(['', null, null, null, null, null, null, null, null, null, null, null, null]);
  row.eachCell((cell) => {
    cell.font = { size: 10, name: 'Calibri' };
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
    null,
    { formula: `SUM(N${sheet.rowCount - 7}:N${sheet.rowCount - 1})` },
  ]);
  row.eachCell((cell) => {
    cell.font = { size: 10, bold: true, name: 'Calibri' };
    borderCell(cell);
    fillCell(cell, GRAY_COLOR);
  });
  sheet.mergeCells(`I${sheet.rowCount}:M${sheet.rowCount}`); // spolu

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
