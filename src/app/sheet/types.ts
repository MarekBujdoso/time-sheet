export interface WorkDay {
    month: number, // Mesiac
    year: number, // Rok
    startTime: Date, // Začiatok
    endTime: Date, // Koniec
    lunchTime?: number, // Obed
    workFromHome?: number, // Praca doma
    sickLeave?: boolean, // PN
    sickLeaveFamily?: boolean, // OCR
    compensatoryLeave?: number, // NV
    doctorsLeave?: number, // P-cko
    doctorsLeaveFamily?: number, // P-doprovod
    dayWorked: number, // Odpracovane za den
    holiday?: boolean, // Sviatok
    vacation?: number, // Dovolenka
}
