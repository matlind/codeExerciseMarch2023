const calculate_membership_fee = require('./app').calculate_membership_fee;
const OrganisationUnit = require('./app').OrganisationUnit;
const OrganisationUnitConfig = require('./app').OrganisationUnitConfig;

describe('calculate_membership_fee', () => {
  const client = new OrganisationUnit("Client");
  const division = new OrganisationUnit("Division");
  const area = new OrganisationUnit("Area");
  const branch = new OrganisationUnit("Branch");
  client.addChild(division);
  division.addChild(area);
  area.addChild(branch);

  it('throws an error if rent period is not "week" or "month"', () => {
    expect(() => calculate_membership_fee(1000, "year", branch)).toThrow("Rent period must be either 'week' or 'month'");
  });

  it('throws an error if rent amount is below the minimum', () => {
    expect(() => calculate_membership_fee(2400, "week", branch)).toThrow("Rent amount must be at least £25 per week");
    expect(() => calculate_membership_fee(10000, "month", branch)).toThrow("Rent amount must be at least £110 per month");
  });

  it('throws an error if rent amount is above the maximum', () => {
    expect(() => calculate_membership_fee(200100, "week", branch)).toThrow("Rent amount must be between £25 per week and £2000 per week");
    expect(() => calculate_membership_fee(867000, "month", branch)).toThrow("Rent amount must be between £110 per month and £8660 per month");
  });

  it('calculates the membership fee correctly when there is no fixed fee config', () => {
    expect(calculate_membership_fee(2501, "week", branch)).toBe(30012);
    expect(calculate_membership_fee(11000, "month", branch)).toBe(15840);
  });

  it('calculates the membership fee correctly when there is a fixed fee config', () => {
    const org_unit_config = new OrganisationUnitConfig(true, 50000);
    const branch_with_config = new OrganisationUnit("Branch with config", org_unit_config);
    area.addChild(branch_with_config);
    expect(calculate_membership_fee(2501, "week", branch_with_config)).toBe(50000);
  });
});