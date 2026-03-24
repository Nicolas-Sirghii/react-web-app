CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255) NOT NULL
);

INSERT INTO messages (text) VALUES ('Hello from mySQL !!!');

CREATE TABLE IF NOT EXISTS greetings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255) NOT NULL
);

INSERT INTO greetings (text) VALUES ('Hello greeting!');