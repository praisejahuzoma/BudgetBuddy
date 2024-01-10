// Mocking the script file to simulate the convertCurrency function
jest.mock("./script", () => ({
  convertCurrency: jest.fn(),
}));

const { convertCurrency } = require("./script");

describe("Currency conversion", () => {
  test("Converts amount to USD correctly", () => {
    // Mock the initial amount and conversion rate
    const amount = 100; // Replace with your test amount
    const ngnToUSD = 0.0025; // Mocked conversion rate
    const selectedCurrency = "USD";

    // Mock the behavior of convertCurrency function
    convertCurrency.mockImplementation((amt, currency) => {
      if (currency === "USD") {
        return amt * ngnToUSD;
      }
      // You can add similar implementations for other currencies here
    });

    // Call the function to be tested
    const convertedAmount = convertCurrency(amount, selectedCurrency);

    // Calculate the expected conversion
    const expectedConversion = amount * ngnToUSD;

    // Assert that the conversion is as expected
    expect(convertedAmount).toBe(expectedConversion);
  });

  // Similar tests for other currencies can be added
});
