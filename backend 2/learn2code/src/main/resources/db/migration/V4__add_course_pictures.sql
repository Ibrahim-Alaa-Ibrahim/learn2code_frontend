ALTER TABLE courses ADD COLUMN IF NOT EXISTS picture VARCHAR(500);

UPDATE courses 
SET picture = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
WHERE name = 'Python Basics';

UPDATE courses 
SET picture = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'
WHERE name = 'Java Programming';

UPDATE courses 
SET picture = 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Scratch_cat.svg'
WHERE name = 'Scratch for Kids';

UPDATE courses 
SET picture = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
WHERE name = 'Web Development (HTML/CSS/JS)';

UPDATE courses 
SET picture = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
WHERE name = 'React.js Fundamentals';

UPDATE courses 
SET picture = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg'
WHERE name = 'C++ for Beginners';

UPDATE courses 
SET picture = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'
WHERE name = 'SQL & Databases';

UPDATE courses 
SET picture = 'https://upload.wikimedia.org/wikipedia/commons/5/54/Antu_applications-utilities.svg'
WHERE name = 'Cybersecurity Basics';

UPDATE courses 
SET picture = 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg'
WHERE name = 'Data Science with Python';

UPDATE courses 
SET picture = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg'
WHERE name = 'Mobile Development with Flutter';
