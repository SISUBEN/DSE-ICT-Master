db = db.getSiblingDB('dse-ict-master');

print("Initializing database: dse-ict-master");

const ensureCollection = (name) => {
  if (!db.getCollectionNames().includes(name)) {
    db.createCollection(name);
  }
};

ensureCollection('users');
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

ensureCollection('modules');
db.modules.createIndex({ id: 1 }, { unique: true });
db.modules.createIndex({ category: 1 });

ensureCollection('questions');
db.questions.createIndex({ moduleId: 1 });

ensureCollection('usersettings');
db.usersettings.createIndex({ userId: 1 }, { unique: true });

ensureCollection('useractions');
db.useractions.createIndex({ userId: 1 });
db.useractions.createIndex({ actionType: 1 });
db.useractions.createIndex({ timestamp: -1 });

ensureCollection('knowledgepoints');
db.knowledgepoints.createIndex({ moduleId: 1 });
db.knowledgepoints.createIndex({ author: 1 });
db.knowledgepoints.createIndex({ createdAt: -1 });

print("Mongo init completed (collections + indexes).");
