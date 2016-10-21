// Load and instantiate Chance
const chance = require('chance').Chance();


export default number=> {
  const names = [];

  for (let i = 0; i < number; i++)
    names.push({
      first: chance.first(),
      last: chance.last()
    });

  return names;
};
