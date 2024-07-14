const countqueries = {
  "Total Users": "SELECT COUNT(*) as count from users;",
  "Total People": "SELECT COUNT(*) as count from person;",
  "Total Images": "SELECT COUNT(*) as count from imagedata;",
  "Total Audios": "SELECT COUNT(*) as count from personaudio;",
  "Total Predictions": "SELECT COUNT(*) as count from classifiers;",
  "Matched Predictions":
    "SELECT COUNT(*) as count from classifiers where status = 'Match Found';",
  "No Match Predictions":
    "SELECT COUNT(*) as count from classifiers where status = 'No Match Found';",
  "Weekly Predictions": `SELECT 
  WEEK(creationDate, 1) AS week, 
  COUNT(*) AS count
FROM 
  classifiers 
WHERE 
  YEAR(creationDate) = YEAR(CURDATE()) 
  AND WEEK(creationDate, 1) = WEEK(CURDATE(), 1)
GROUP BY 
  WEEK(creationDate, 1)
ORDER BY 
  WEEK(creationDate, 1);`,
};

const predictionsqueris = {
  "Monthly Predictions": `SELECT MONTH(creationDate) AS month,COUNT(*) AS prediction_count FROM classifiers WHERE YEAR(creationDate) = ?
    GROUP BY MONTH(creationDate) ORDER BY MONTH(creationDate)`,
  "Weekly Predictions": `SELECT 
  DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) + INTERVAL n DAY AS day,
  COUNT(classifiers.creationDate) AS prediction_count
FROM 
  (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6) AS numbers
LEFT JOIN 
  classifiers ON DATE(classifiers.creationDate) = DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) + INTERVAL numbers.n DAY
WHERE 
  classifiers.creationDate IS NULL OR (YEAR(classifiers.creationDate) = YEAR(CURDATE()) AND WEEK(classifiers.creationDate, 1) = WEEK(CURDATE(), 1))
GROUP BY 
  day
ORDER BY 
  day;`,
  "Daily Predictions": `SELECT 
    COUNT(*) AS prediction_count,
    SUM(CASE WHEN status = 'Match Found' THEN 1 ELSE 0 END) AS matched_count
    FROM classifiers
    WHERE 
    DAY(creationDate) = DAY(CURDATE()) AND
    MONTH(creationDate) = MONTH(CURDATE()) AND
    YEAR(creationDate) = YEAR(CURDATE());`,
  "Today Predictions Data": `SELECT MAX(pre.personName) AS personName, avg(pre.confidence) as averageConfidence, pre.personId AS personId,
COUNT(pre.id) as matchCount FROM predictions pre INNER JOIN classifiers cls ON cls.id = pre.classifierId
INNER JOIN users u ON u.id = cls.userId 
WHERE  DAY(pre.creationDate) = DAY(CURDATE()) AND pre.match = 1
GROUP BY pre.personId;`,
  "Predictions Count": {
    "All Predicted People": "SELECT COUNT(*) AS count FROM predictions;",
    Matches:
      "SELECT COUNT(*) AS count FROM predictions pre WHERE pre.match = 1;",
    "No Match Found":
      "SELECT COUNT(*) AS count FROM predictions pre WHERE pre.match = 0;",
  },
};

module.exports = {
  countqueries,
  predictionsqueris,
};
