const vorpal = require('vorpal');
const minimist = require('minimist');
const udp = require('./udp');
const PersistenceClass = require('./persistence/memoryPersistence');
const listCommand = require('./commands/listCommand');
const addCommand = require('./commands/addCommand');

const app = vorpal();
const argv = minimist(process.argv.slice(2));

const persistence = new PersistenceClass();

udp.start(argv, persistence);

listCommand.register(app, persistence);
addCommand.register(app, persistence);

app.delimiter('$').show();