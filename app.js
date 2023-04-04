class OrganisationUnit {
  constructor(name, config) {
    this.name = name;
    this.config = config;
    this.parent = null;
    this.children = [];
  }

  addChild(child) {
    child.parent = this;
    this.children.push(child);
  }
}

class OrganisationUnitConfig {
  constructor(has_fixed_membership_fee, fixed_membership_fee_amount) {
    this.has_fixed_membership_fee = has_fixed_membership_fee;
    this.fixed_membership_fee_amount = fixed_membership_fee_amount;
  }
}

function calculate_membership_fee(rent_amount, rent_period, organisation_unit) {
  if (rent_period !== "week" && rent_period !== "month") {
    throw new Error("Rent period must be either 'week' or 'month'");
  }

  // What can we do to make the month period better than assuming it's just 4 weeks. A better calculation could be `(rent_amount * 52) / 12`
  const rent_in_pence = rent_period === "week" ? rent_amount * 100 : rent_amount * 100 * 4;

  // Minimum rent amount is £25 per week or £110 per month
  // Maximum rent amount is £2000 per week or £8660 per month
  // This fails if we pass in that the rent is £1000 per week
//   if (rent_in_pence < 2500 || rent_in_pence > 866000) {
//     throw new Error("Rent amount must be between £25 per week and £8660 per month");
//   }

//   if (rent_in_pence < 250000) {
//     throw new Error("Rent amount must be at least £25 per week");
//   }

if(rent_period === "week" && rent_amount < 2500 || rent_amount > 200000) {
    throw new Error("Rent amount must be at least £25 per week");
} 
    else if (rent_period === "month" && rent_amount < 11000 || rent_amount > 866000) {
    throw new Error("Rent amount must be at least £25 per week");
}

  // add 20% VAT to the rent amount to get the membership fee
  let membership_fee_in_pence = rent_in_pence * 1.2;

  if (membership_fee_in_pence < 12000) {
    membership_fee_in_pence = 12000;
  }

  let current_org_unit = organisation_unit;

  while (current_org_unit.config === undefined || !current_org_unit.config.has_fixed_membership_fee) {
    current_org_unit = current_org_unit.parent;

    if (current_org_unit === null) {
      break;
    }
  }

  if (current_org_unit !== null && current_org_unit.config !== undefined && current_org_unit.config.has_fixed_membership_fee) {
    membership_fee_in_pence = current_org_unit.config.fixed_membership_fee_amount;
  }

  return membership_fee_in_pence;
}

const client = new OrganisationUnit("Client");
const division = new OrganisationUnit("Division");
const area = new OrganisationUnit("Area");
const branch = new OrganisationUnit("Branch");

client.addChild(division);
division.addChild(area);
area.addChild(branch);

console.log(calculate_membership_fee(2400, "week", branch));
  

module.exports = {calculate_membership_fee, OrganisationUnit, OrganisationUnitConfig }