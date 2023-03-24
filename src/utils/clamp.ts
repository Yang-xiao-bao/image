export function clamp(i:number,low:number,high:number) {
  if(i<low) { return low }
  if(i>high) { return high }
  return i
}
