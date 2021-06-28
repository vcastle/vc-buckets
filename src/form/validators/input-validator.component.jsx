export default function validateInput(value) {
  let error = {};
  const valToNum = Number(value);

  if (!valToNum) {
    error = "Numeric value required";
  } else if (valToNum < 0 || valToNum > 100) {
    error = "Enter a number between 1 and 100";
  }

  return error;
}
