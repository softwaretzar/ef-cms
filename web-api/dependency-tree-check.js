const madge = require('madge');

const args = process.argv.slice(2);
const stack = args[0];

const stackMap = {
  api: './web-api/src/apiHandlers.js',
  caseDeadlines: './web-api/src/caseDeadlinesHandlers.js',
  caseDocuments: './web-api/src/caseDocumentsHandlers.js',
  caseNotes: './web-api/src/caseNotesHandlers.js',
  cases: './web-api/src/casesHandlers.js',
  documents: './web-api/src/documentsHandlers.js',
  notifications: './web-api/src/notificationHandlers.js',
  sections: './web-api/src/sectionsHandlers.js',
  streams: './web-api/src/streamsHandlers.js',
  trialSessions: './web-api/src/trialSessionsHandlers.js',
  users: './web-api/src/usersHandlers.js',
  workItems: './web-api/src/workItemsHandlers.js',
};

(async function() {
  if (!stackMap[stack]) {
    return;
  }

  const dependencies = await madge(stackMap[stack]);

  process.stdin.on('data', data => {
    let numberOfDependencies = 0;

    Buffer.from(data)
      .toString()
      .split('\n')
      .filter(v => v)
      .forEach(file => {
        const { length } = dependencies.depends(`../../${file}`);
        numberOfDependencies += length;
      });

    if (numberOfDependencies) {
      console.log(numberOfDependencies);
    }
  });
})();
