export function exportToExcel(guests, tables) {
    if (!window.XLSX) return alert("Excel Library nicht geladen");
    const wsGuests = XLSX.utils.json_to_sheet(guests);
    const wsTables = XLSX.utils.json_to_sheet(tables);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsGuests, "Gäste");
    XLSX.utils.book_append_sheet(wb, wsTables, "Tische");
    XLSX.writeFile(wb, "Hochzeit_Sitzplan.xlsx");
}
