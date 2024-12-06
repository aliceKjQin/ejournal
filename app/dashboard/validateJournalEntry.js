// Validation function for journal entry textarea
export const validateJournalEntry = (input) => {
  const trimmedInput = input.trim();
  const maxLength = 500;

  // Check if the input exceeds the max length
  if (trimmedInput.length > maxLength) {
    return { valid: false, message: `Entry cannot exceed ${maxLength} characters.` };
  }

  // Check for prohibited characters (e.g., < > {} tags)
  const prohibitedChars = /[<>]/;
  if (prohibitedChars.test(trimmedInput)) {
    return { valid: false, message: "HTML tags are not allowed." };
  }

  // If no validation issues, the input is valid
  return { valid: true };
};
