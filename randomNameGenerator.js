const firstNames = ['Robert', 'Jared', 'Anton', 'Steven', 'Jon', 'Danny', 'Ava', 'Adam', 'Karl'];
const lastNames = ['Lancer', 'Rosen', 'Volt', 'Reubenstone', 'Goldberg', 'Katz', 'Schrier', 'Wasserman', 'Schmidt'];

export default number=> {
    const names = [];

    for (let i = 0; i < number; i++)
        names.push({
            first: firstNames[Math.floor(Math.random() * firstNames.length)],
            last: lastNames[Math.floor(Math.random() * firstNames.length)]
        });

    return names;
};