export function get_overall(arr: Array<number>) {
  let val = 0;

  arr.forEach(v => {
    val += v;
  });

  return val;
}