export function formatNumber(number: string | number | undefined | null): string {
    if (number === undefined || number === null) {
      return '$0';
    }
  
    const num = typeof number === 'string' ? parseFloat(number) : number;
  
    if (isNaN(num)) {
      return '$0';
    }
  
    const formattedNum = num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
    
    return '$' + formattedNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  export function getDate(data: Date | string) {
    const date = new Date(data)
    return date.toLocaleDateString("en-AU")
}
export function getTime(data: Date) {
    const date = new Date(data);
    return date.toLocaleTimeString("en-AU", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}
export function formatDateForDB(date: string | number | Date) {
  // Ensure we're working with a Date object
  const d = new Date(date);
  
  // Convert to UTC
  const utcYear = d.getUTCFullYear();
  const utcMonth = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  const utcDay = d.getUTCDate().toString().padStart(2, '0');
  const utcHours = d.getUTCHours().toString().padStart(2, '0');
  const utcMinutes = d.getUTCMinutes().toString().padStart(2, '0');
  const utcSeconds = d.getUTCSeconds().toString().padStart(2, '0');
  const utcMilliseconds = d.getUTCMilliseconds().toString().padStart(3, '0');

  // Format the string
  return `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}:${utcSeconds}.${utcMilliseconds}000+00`;
}