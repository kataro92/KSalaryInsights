/** Pure helper — gate amounts until disclaimer ack (SC-002 / T012). */
export function canShowRetirementAmounts(acknowledged: boolean): boolean {
  return acknowledged === true;
}
